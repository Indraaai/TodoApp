-- =====================================================
-- MIGRATION: Create Todos Table
-- Description: Setup todos table dengan RLS dan triggers
-- Created: 2025-11-04
-- =====================================================

-- =====================================================
-- STEP 1: Enable UUID Extension
-- =====================================================
/**
 * UUID Extension
 * 
 * FUNGSI:
 * Extension ini untuk generate UUID v4 otomatis
 * UUID = Universally Unique Identifier (128-bit)
 * 
 * KENAPA UUID?
 * ✅ Globally unique (tidak akan bentrok)
 * ✅ Non-sequential (security - tidak bisa ditebak)
 * ✅ Distributed systems friendly
 * ✅ No auto-increment issues
 * 
 * FORMAT:
 * "123e4567-e89b-12d3-a456-426614174000"
 */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STEP 2: Create Todos Table
-- =====================================================
/**
 * Todos Table
 * 
 * STRUKTUR:
 * - id: Primary key (UUID)
 * - user_id: Foreign key ke auth.users (owner)
 * - title: Judul todo (required)
 * - description: Deskripsi detail (optional)
 * - completed: Status selesai (default: false)
 * - priority: Priority level (low/medium/high)
 * - due_date: Deadline (optional)
 * - created_at: Timestamp creation (auto)
 * - updated_at: Timestamp last update (auto)
 * 
 * RELATIONSHIPS:
 * - todos.user_id → auth.users.id (One user has many todos)
 * 
 * CONSTRAINTS:
 * - title: NOT NULL (required)
 * - user_id: NOT NULL + FK (must exist in auth.users)
 * - priority: CHECK constraint (only accept 'low', 'medium', 'high')
 * - ON DELETE CASCADE: Kalau user dihapus, todos juga dihapus
 */
CREATE TABLE IF NOT EXISTS todos (
  -- Primary Key
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Foreign Key (Owner)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Content Fields
  title TEXT NOT NULL,
  description TEXT,
  
  -- Status Fields
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium' NOT NULL,
  
  -- Date Fields
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

/**
 * FIELD EXPLANATIONS:
 * 
 * id UUID DEFAULT uuid_generate_v4():
 * - Auto-generate UUID saat insert
 * - Tidak perlu manual input ID
 * 
 * user_id UUID NOT NULL:
 * - Setiap todo HARUS punya owner
 * - Reference ke auth.users (Supabase auth table)
 * 
 * REFERENCES auth.users(id):
 * - Foreign key constraint
 * - Ensure user_id valid (user exists)
 * 
 * ON DELETE CASCADE:
 * - Jika user dihapus → todos miliknya juga dihapus
 * - Prevent orphaned data
 * 
 * CHECK (priority IN (...)):
 * - Database-level validation
 * - Hanya accept 'low', 'medium', 'high'
 * - Insert/Update akan error jika value lain
 * 
 * TIMESTAMP WITH TIME ZONE:
 * - Store timezone info
 * - Penting untuk global apps
 * - Auto convert ke user timezone
 * 
 * DEFAULT NOW():
 * - Auto-set current timestamp saat insert
 * - Tidak perlu manual input
 */

-- =====================================================
-- STEP 3: Create Indexes for Performance
-- =====================================================
/**
 * Database Indexes
 * 
 * FUNGSI:
 * Indexes mempercepat query dengan membuat "lookup table"
 * Seperti index di buku - langsung ke halaman yang dicari
 * 
 * TRADE-OFF:
 * ✅ Faster SELECT queries
 * ❌ Slower INSERT/UPDATE (harus update index)
 * ❌ Extra storage space
 * 
 * RULE OF THUMB:
 * Index columns yang sering di-query di WHERE, ORDER BY, JOIN
 */

-- Index 1: User ID (Most Important!)
/**
 * Index pada user_id
 * 
 * KENAPA?
 * - Setiap query todos pasti filter by user_id
 * - SELECT * FROM todos WHERE user_id = 'xxx'
 * - Tanpa index: Full table scan (slow!)
 * - Dengan index: Direct lookup (fast!)
 * 
 * IMPACT:
 * Query time: 1000ms → 10ms (100x faster!)
 */
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);

-- Index 2: Completed Status
/**
 * Index pada completed
 * 
 * KENAPA?
 * - Filter todos by status sering dipakai
 * - "Show active todos" → WHERE completed = false
 * - "Show completed todos" → WHERE completed = true
 * 
 * USAGE:
 * SELECT * FROM todos 
 * WHERE user_id = 'xxx' AND completed = false
 */
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);

-- Index 3: Created Date (Optional)
/**
 * Index pada created_at
 * 
 * KENAPA?
 * - Sort by date sering dipakai
 * - ORDER BY created_at DESC (newest first)
 * 
 * USAGE:
 * SELECT * FROM todos 
 * WHERE user_id = 'xxx' 
 * ORDER BY created_at DESC
 */
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);

-- Index 4: Composite Index (Advanced)
/**
 * Composite index pada user_id + completed
 * 
 * KENAPA?
 * - Query yang paling sering: filter by user + status
 * - WHERE user_id = 'xxx' AND completed = false
 * - Composite index lebih efisien untuk query kombinasi
 * 
 * ORDER MATTERS:
 * (user_id, completed) ≠ (completed, user_id)
 * Put most selective column first (user_id)
 */
CREATE INDEX IF NOT EXISTS idx_todos_user_completed ON todos(user_id, completed);

-- =====================================================
-- STEP 4: Enable Row Level Security (RLS)
-- =====================================================
/**
 * Row Level Security (RLS)
 * 
 * FUNGSI:
 * Database-level authorization
 * User hanya bisa akses data mereka sendiri
 * 
 * KENAPA PENTING?
 * ✅ Security di database level (bukan hanya app)
 * ✅ Prevent data leaks
 * ✅ No need manual WHERE user_id = auth.uid()
 * ✅ Works with Supabase client queries
 * 
 * CARA KERJA:
 * 1. User login → Supabase set auth.uid()
 * 2. User query todos → RLS policies checked
 * 3. Only return/modify rows that pass policies
 * 
 * AUTOMATIC:
 * Supabase client otomatis apply RLS
 * Tidak perlu manual check di app code
 */
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 5: Create RLS Policies
-- =====================================================
/**
 * RLS Policies
 * 
 * Policy = Rule yang define siapa bisa akses data
 * 
 * FORMAT:
 * CREATE POLICY "name" ON table
 * FOR operation (SELECT/INSERT/UPDATE/DELETE)
 * USING (read_condition)
 * WITH CHECK (write_condition)
 * 
 * auth.uid():
 * - Function dari Supabase Auth
 * - Return user ID yang sedang login
 * - null jika tidak login
 */

-- Policy 1: SELECT (Read)
/**
 * SELECT Policy - Users can view own todos
 * 
 * RULE:
 * User hanya bisa SELECT todos miliknya
 * WHERE user_id = auth.uid()
 * 
 * CONTOH:
 * User A login:
 * - SELECT * FROM todos → Hanya return todos user A
 * - Todos user B, C, D otomatis di-filter
 * 
 * AUTOMATIC:
 * Tidak perlu manual WHERE user_id = auth.uid() di query
 * Supabase otomatis tambahkan
 */
CREATE POLICY "Users can view own todos"
  ON todos
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: INSERT (Create)
/**
 * INSERT Policy - Users can insert own todos
 * 
 * RULE:
 * User hanya bisa INSERT dengan user_id = auth.uid()
 * 
 * WITH CHECK:
 * Validate saat INSERT
 * Kalau user_id ≠ auth.uid() → ERROR
 * 
 * CONTOH:
 * User A (id: xxx) tries:
 * INSERT INTO todos (user_id, title) VALUES ('yyy', 'Hack!')
 * → ERROR: Policy violation
 * 
 * INSERT INTO todos (user_id, title) VALUES ('xxx', 'Valid')
 * → SUCCESS
 * 
 * SECURITY:
 * User tidak bisa create todos atas nama user lain
 */
CREATE POLICY "Users can insert own todos"
  ON todos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: UPDATE (Modify)
/**
 * UPDATE Policy - Users can update own todos
 * 
 * RULE:
 * User hanya bisa UPDATE todos miliknya
 * 
 * USING:
 * Check existing row ownership
 * 
 * CONTOH:
 * User A tries:
 * UPDATE todos SET completed = true WHERE id = 'todo-user-B'
 * → ERROR: Row not found (filtered by RLS)
 * 
 * UPDATE todos SET completed = true WHERE id = 'todo-user-A'
 * → SUCCESS
 */
CREATE POLICY "Users can update own todos"
  ON todos
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy 4: DELETE (Remove)
/**
 * DELETE Policy - Users can delete own todos
 * 
 * RULE:
 * User hanya bisa DELETE todos miliknya
 * 
 * CONTOH:
 * User A tries:
 * DELETE FROM todos WHERE id = 'todo-user-B'
 * → ERROR: Row not found
 * 
 * DELETE FROM todos WHERE id = 'todo-user-A'
 * → SUCCESS
 */
CREATE POLICY "Users can delete own todos"
  ON todos
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- STEP 6: Create Function untuk Auto-Update Timestamp
-- =====================================================
/**
 * Update Timestamp Function
 * 
 * FUNGSI:
 * Otomatis update updated_at saat row di-UPDATE
 * 
 * CARA KERJA:
 * 1. User UPDATE todo
 * 2. Trigger fire BEFORE UPDATE
 * 3. Function set NEW.updated_at = NOW()
 * 4. Row saved dengan timestamp baru
 * 
 * NEW vs OLD:
 * - OLD: Row sebelum update
 * - NEW: Row setelah update (yang akan disave)
 * 
 * RETURN NEW:
 * Return modified row
 */
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Set updated_at ke timestamp sekarang
  NEW.updated_at = NOW();
  
  -- Return row yang sudah dimodifikasi
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/**
 * FUNCTION EXPLANATION:
 * 
 * CREATE OR REPLACE FUNCTION:
 * - Create function baru atau replace yang existing
 * 
 * RETURNS TRIGGER:
 * - Function ini untuk trigger
 * - Return modified row
 * 
 * AS $$...$$ LANGUAGE plpgsql:
 * - Function body dalam PL/pgSQL
 * - PostgreSQL procedural language
 * 
 * BEGIN...END:
 * - Function body
 * 
 * NEW:
 * - Special variable di triggers
 * - Represent row yang akan di-insert/update
 * 
 * NOW():
 * - PostgreSQL function
 * - Return current timestamp with timezone
 */

-- =====================================================
-- STEP 7: Create Trigger untuk Auto-Update
-- =====================================================
/**
 * Update Trigger
 * 
 * TRIGGER:
 * Event-driven function execution
 * Execute function saat event tertentu
 * 
 * EVENTS:
 * - BEFORE INSERT: Sebelum insert
 * - AFTER INSERT: Setelah insert
 * - BEFORE UPDATE: Sebelum update
 * - AFTER UPDATE: Setelah update
 * - BEFORE DELETE: Sebelum delete
 * - AFTER DELETE: Setelah delete
 * 
 * TIMING:
 * BEFORE = Bisa modify row (NEW)
 * AFTER = Read only (untuk logging, notifications)
 */
CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

/**
 * TRIGGER EXPLANATION:
 * 
 * CREATE TRIGGER update_todos_updated_at:
 * - Name: update_todos_updated_at
 * 
 * BEFORE UPDATE ON todos:
 * - Fire sebelum UPDATE operation
 * - ON todos table
 * 
 * FOR EACH ROW:
 * - Fire untuk setiap row yang di-update
 * - Alternative: FOR EACH STATEMENT (sekali per query)
 * 
 * EXECUTE FUNCTION:
 * - Call function update_updated_at_column()
 * 
 * CONTOH:
 * UPDATE todos SET completed = true WHERE user_id = 'xxx'
 * → Trigger fires untuk setiap row
 * → updated_at di-set NOW() untuk setiap row
 */

-- =====================================================
-- STEP 8: Insert Sample Data (Optional - untuk testing)
-- =====================================================
/**
 * Sample Data
 * 
 * OPTIONAL: Uncomment untuk insert sample todos
 * Berguna untuk testing tanpa UI
 * 
 * NOTE: Ganti 'YOUR_USER_ID_HERE' dengan user_id real
 * dari Supabase Auth → Users
 */

-- Uncomment lines di bawah untuk insert sample data:
/*
INSERT INTO todos (user_id, title, description, priority, completed) VALUES
  ('YOUR_USER_ID_HERE', 'Belajar Next.js', 'Tutorial App Router dan Server Components', 'high', false),
  ('YOUR_USER_ID_HERE', 'Setup Supabase', 'Configure database dan authentication', 'high', true),
  ('YOUR_USER_ID_HERE', 'Integrate TanStack Query', 'Setup providers dan hooks', 'medium', false),
  ('YOUR_USER_ID_HERE', 'Build UI dengan shadcn/ui', 'Install dan customize components', 'medium', false),
  ('YOUR_USER_ID_HERE', 'Deploy ke Vercel', 'Production deployment', 'low', false);
*/

-- =====================================================
-- VERIFICATION QUERIES (untuk testing)
-- =====================================================
/**
 * Run queries ini untuk verify setup berhasil
 */

-- Check table exists
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'todos';

-- Check indexes
-- SELECT indexname FROM pg_indexes WHERE tablename = 'todos';

-- Check RLS enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'todos';

-- Check policies
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'todos';

-- =====================================================
-- MIGRATION COMPLETE ✅
-- =====================================================
/**
 * Database setup selesai!
 * 
 * NEXT STEPS:
 * 1. Copy SQL di atas
 * 2. Buka Supabase Dashboard → SQL Editor
 * 3. Paste dan Run
 * 4. Verify di Table Editor
 * 5. Test dengan sample data
 * 6. Ready untuk connect dari Next.js app!
 */
