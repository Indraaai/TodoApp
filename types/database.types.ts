/**
 * Database Type Definitions
 * 
 * FUNGSI:
 * File ini berisi TypeScript types yang merepresentasikan struktur database Supabase.
 * Dengan types ini, kita dapat type-safe operations (autocomplete, error detection).
 * 
 * CARA KERJA:
 * 1. Types ini match dengan schema database di Supabase
 * 2. TypeScript akan validate semua query/insert/update operations
 * 3. IDE akan kasih autocomplete untuk column names dan types
 * 4. Compile-time error jika ada typo atau wrong type
 * 
 * CONTOH MANFAAT:
 * 
 * // ❌ Tanpa types:
 * const { data } = await supabase.from('todos').select('*')
 * data[0].titel // Typo! Tapi tidak ada error
 * 
 * // ✅ Dengan types:
 * const { data } = await supabase.from('todos').select('*')
 * data[0].titel // TypeScript error: Property 'titel' does not exist
 * data[0].title // ✅ Autocomplete & type-safe
 * 
 * AUTO-GENERATE:
 * Idealnya types ini auto-generated dari Supabase schema:
 * npx supabase gen types typescript --project-id your-project-id > types/database.types.ts
 * 
 * Tapi untuk sekarang kita buat manual based on schema kita.
 */

/**
 * Json Type
 * 
 * Generic type untuk JSON data di PostgreSQL
 * Supabase support JSONB columns yang bisa store complex data
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * Database Interface
 * 
 * Root interface yang contains semua schemas.
 * Supabase default pakai 'public' schema.
 * 
 * STRUKTUR:
 * Database
 *   └── public (schema)
 *       └── Tables
 *           └── todos (table)
 *               ├── Row (untuk SELECT)
 *               ├── Insert (untuk INSERT)
 *               └── Update (untuk UPDATE)
 */
export interface Database {
  public: {
    Tables: {
      /**
       * Todos Table
       * 
       * Schema SQL reference:
       * CREATE TABLE todos (
       *   id UUID PRIMARY KEY,
       *   user_id UUID REFERENCES auth.users(id),
       *   title TEXT NOT NULL,
       *   description TEXT,
       *   completed BOOLEAN DEFAULT FALSE,
       *   priority VARCHAR(10),
       *   due_date TIMESTAMP WITH TIME ZONE,
       *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
       * );
       */
      todos: {
        /**
         * Row Type - Untuk SELECT queries
         * 
         * KAPAN DIGUNAKAN:
         * - Saat fetch data dari database
         * - Response dari .select()
         * - Data yang sudah ada di database
         * 
         * KARAKTERISTIK:
         * - Semua fields ada (karena sudah tersimpan)
         * - Semua required (tidak ada optional)
         * - Include auto-generated fields (id, timestamps)
         * 
         * CONTOH:
         * const { data } = await supabase.from('todos').select('*')
         * // data: Row[] | null
         */
        Row: {
          id: string                    // UUID primary key
          user_id: string               // UUID foreign key ke auth.users
          title: string                 // Title todo (required)
          description: string | null    // Description (optional, bisa null)
          completed: boolean            // Status completed (default: false)
          priority: 'low' | 'medium' | 'high'  // Priority level (enum)
          due_date: string | null       // ISO datetime string (optional)
          created_at: string            // ISO datetime (auto-generated)
          updated_at: string            // ISO datetime (auto-updated)
        }

        /**
         * Insert Type - Untuk INSERT operations
         * 
         * KAPAN DIGUNAKAN:
         * - Saat create todo baru
         * - Parameter untuk .insert()
         * - Form submission data
         * 
         * KARAKTERISTIK:
         * - Auto-generated fields optional (id, timestamps)
         * - Required fields tetap required (title, user_id)
         * - Optional fields marked dengan ? atau | null
         * - Default values bisa di-skip
         * 
         * CONTOH:
         * const newTodo: Insert = {
         *   title: 'Belajar TypeScript',  // Required
         *   user_id: 'xxx',                // Required
         *   // id, created_at, updated_at auto-generated
         *   // completed auto-default false
         * }
         * await supabase.from('todos').insert(newTodo)
         */
        Insert: {
          id?: string                   // Optional (auto-generated UUID)
          user_id: string               // Required (foreign key)
          title: string                 // Required
          description?: string | null   // Optional
          completed?: boolean           // Optional (default: false)
          priority?: 'low' | 'medium' | 'high'  // Optional (default: 'medium')
          due_date?: string | null      // Optional
          created_at?: string           // Optional (auto: NOW())
          updated_at?: string           // Optional (auto: NOW())
        }

        /**
         * Update Type - Untuk UPDATE operations
         * 
         * KAPAN DIGUNAKAN:
         * - Saat update existing todo
         * - Parameter untuk .update()
         * - Partial updates (hanya update field tertentu)
         * 
         * KARAKTERISTIK:
         * - SEMUA fields optional (karena bisa update sebagian)
         * - Tidak perlu semua fields untuk update
         * - Hanya field yang diisi yang akan di-update
         * 
         * CONTOH:
         * // Update hanya completed status
         * const updates: Update = {
         *   completed: true
         *   // Field lain tidak perlu
         * }
         * await supabase.from('todos').update(updates).eq('id', todoId)
         * 
         * // Update title dan description
         * const updates: Update = {
         *   title: 'New title',
         *   description: 'New description'
         * }
         */
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          created_at?: string
          updated_at?: string           // Auto-updated by trigger
        }

        /**
         * Relationships (Optional)
         * 
         * Untuk define foreign key relationships
         * Berguna untuk joins dan nested selects
         * 
         * Contoh:
         * Relationships: [
         *   {
         *     foreignKeyName: "todos_user_id_fkey"
         *     columns: ["user_id"]
         *     referencedRelation: "users"
         *     referencedColumns: ["id"]
         *   }
         * ]
         */
        Relationships: [
          {
            foreignKeyName: "todos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      // Table lain bisa ditambah di sini
      // Contoh:
      // categories: {
      //   Row: { ... }
      //   Insert: { ... }
      //   Update: { ... }
      // }
    }

    /**
     * Views (Optional)
     * 
     * Untuk database views jika ada
     * Views = Virtual tables dari query results
     */
    Views: {
      [_ in never]: never
    }

    /**
     * Functions (Optional)
     * 
     * Untuk PostgreSQL functions/stored procedures
     * Bisa dipanggil via supabase.rpc()
     */
    Functions: {
      [_ in never]: never
    }

    /**
     * Enums (Optional)
     * 
     * PostgreSQL ENUM types
     */
    Enums: {
      priority_level: 'low' | 'medium' | 'high'
    }

    /**
     * CompositeTypes (Optional)
     * 
     * PostgreSQL composite types
     */
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

/**
 * Type Aliases untuk Kemudahan
 * 
 * Shorthand types agar tidak perlu type panjang
 */

// Todo types (shorthand)
export type Todo = Database['public']['Tables']['todos']['Row']
export type TodoInsert = Database['public']['Tables']['todos']['Insert']
export type TodoUpdate = Database['public']['Tables']['todos']['Update']

// Untuk specific use cases
export type TodoWithoutTimestamps = Omit<Todo, 'created_at' | 'updated_at'>
export type TodoFormData = Pick<Todo, 'title' | 'description' | 'priority' | 'due_date'>
