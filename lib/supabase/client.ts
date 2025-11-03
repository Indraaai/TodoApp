import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

/**
 * Supabase Browser Client
 *
 * FUNGSI:
 * Client ini digunakan untuk berinteraksi dengan Supabase dari sisi browser/client.
 *
 * KAPAN DIGUNAKAN:
 * - Di Client Components (yang ada 'use client' di atas)
 * - Untuk authentication (login, register, logout)
 * - Untuk real-time subscriptions
 * - Untuk operasi yang butuh user interaction
 *
 * CARA KERJA:
 * 1. createBrowserClient() membuat instance Supabase khusus browser
 * 2. Menggunakan NEXT_PUBLIC_* environment variables (bisa diakses di client)
 * 3. Session disimpan di browser cookies
 * 4. Otomatis handle authentication state
 *
 * TYPE SAFETY:
 * <Database> = Generic type untuk type-safe queries
 * Semua operasi database akan punya autocomplete dan type checking
 *
 * CONTOH PENGGUNAAN:
 *
 * import { createClient } from '@/lib/supabase/client'
 *
 * function LoginComponent() {
 *   const supabase = createClient()
 *
 *   async function handleLogin() {
 *     const { data, error } = await supabase.auth.signInWithPassword({
 *       email: 'userexample.com',
 *       password: 'password123'
 *     })
 *   }
 *   
 *   // Type-safe query
 *   async function getTodos() {
 *     const { data } = await supabase.from('todos').select('*')
 *     // data: Todo[] | null (dengan autocomplete!)
 *   }
 * }
 *
 * PENTING:
 * - Jangan gunakan di Server Components!
 * - Untuk server, gunakan lib/supabase/server.ts
 */
export function createClient(){
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
