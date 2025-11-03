import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'

/**
 * Supabase Server Client
 * 
 * FUNGSI:
 * Client ini digunakan untuk berinteraksi dengan Supabase dari sisi server.
 * Berbeda dengan browser client, ini handle cookies di server-side.
 * 
 * KAPAN DIGUNAKAN:
 * - Di Server Components (components tanpa 'use client')
 * - Di Server Actions (async functions dengan 'use server')
 * - Di Route Handlers (app/api/xxx/route.ts)
 * - Untuk initial data fetching sebelum page load
 * - Untuk operasi yang butuh keamanan tinggi
 * 
 * CARA KERJA:
 * 1. createServerClient() membuat instance Supabase khusus server
 * 2. cookies() dari Next.js untuk akses cookies di server
 * 3. Menangani get, set, dan remove cookies untuk session management
 * 4. Session user tersimpan aman di server-side cookies
 * 
 * KEUNTUNGAN SERVER CLIENT:
 * - Lebih aman (credentials tidak exposed ke browser)
 * - SEO-friendly (data sudah ada saat page load)
 * - Faster initial load (data fetch di server, kirim HTML yang sudah ada datanya)
 * - Bisa akses service_role key jika perlu (untuk admin operations)
 * 
 * CONTOH PENGGUNAAN:
 * 
 * // Server Component
 * import { createClient } from '@/lib/supabase/server'
 * 
 * async function TodosPage() {
 *   const supabase = await createClient()
 *   const { data: todos } = await supabase.from('todos').select('*')
 *   
 *   return <div>{todos.map(todo => ...)}</div>
 * }
 * 
 * // Server Action
 * 'use server'
 * async function createTodo(formData: FormData) {
 *   const supabase = await createClient()
 *   await supabase.from('todos').insert({ title: formData.get('title') })
 * }
 * 
 * PENTING:
 * - Function ini ASYNC (harus await)
 * - Jangan gunakan di Client Components!
 * - Untuk client, gunakan lib/supabase/client.ts
 */
export async function createClient() {
  // Ambil cookies dari Next.js
  // cookies() adalah async function dari next/headers
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * GET Cookie
         * Fungsi untuk membaca cookie berdasarkan name
         * 
         * @param name - Nama cookie yang mau dibaca
         * @returns Value dari cookie atau undefined
         */
        getAll() {
          return cookieStore.getAll()
        },
        
        /**
         * SET Cookie
         * Fungsi untuk menyimpan/update cookie
         * 
         * @param name - Nama cookie
         * @param value - Nilai yang mau disimpan
         * @param options - Konfigurasi cookie (maxAge, path, httpOnly, dll)
         * 
         * KENAPA TRY-CATCH?
         * Karena ada case tertentu di middleware yang gabisa set cookie
         * Try-catch prevent error yang crash aplikasi
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Cookie setting di middleware kadang fail
            // Ini normal dan tidak masalah
            // Middleware punya handler sendiri
          }
        },
      },
    }
  )
}
