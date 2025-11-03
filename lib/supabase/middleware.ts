import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

/**
 * Supabase Middleware untuk Authentication
 * 
 * FUNGSI UTAMA:
 * Middleware ini berjalan di SETIAP REQUEST sebelum masuk ke page/API.
 * Ini adalah "gatekeeper" aplikasi kita.
 * 
 * APA YANG DILAKUKAN:
 * 1. Refresh session user otomatis (jika token hampir expired)
 * 2. Cek apakah user sudah login atau belum
 * 3. Protect routes tertentu (redirect jika unauthorized)
 * 4. Redirect logic untuk UX yang lebih baik
 * 
 * CARA KERJA:
 * User Request → Middleware → Cek Auth → Allow/Redirect → Page
 * 
 * CONTOH FLOW:
 * - User akses /todos tapi belum login → redirect ke /login
 * - User sudah login, akses /login → redirect ke /todos
 * - User akses /todos dan sudah login → allow, lanjut ke page
 * 
 * KENAPA PENTING:
 * - Security: Protect halaman yang butuh authentication
 * - UX: User tidak perlu manual refresh untuk update session
 * - Performance: Session refresh otomatis tanpa API call tambahan
 */
export async function updateSession(request: NextRequest) {
  /**
   * STEP 1: Buat response object
   * 
   * NextResponse.next() = lanjutkan ke page berikutnya
   * Kita clone request headers untuk diteruskan
   */
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  /**
   * STEP 2: Create Supabase client khusus untuk middleware
   * 
   * Berbeda dengan server.ts, di middleware kita tidak bisa pakai cookies()
   * dari next/headers. Jadi kita manual handle cookies dari request/response.
   */
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * GET ALL - Baca semua cookies dari request
         * 
         * Middleware akses cookies dari NextRequest object
         * Bukan dari next/headers seperti di server.ts
         */
        getAll() {
          return request.cookies.getAll()
        },

        /**
         * SET ALL - Simpan cookies ke request DAN response
         * 
         * KENAPA DUA KALI?
         * 1. Set di request.cookies → untuk logic di middleware ini
         * 2. Set di response.cookies → untuk dikirim ke browser
         * 
         * FLOW:
         * Request masuk → Update cookies di request → Process logic →
         * Update cookies di response → Send ke browser
         */
        setAll(cookiesToSet) {
          // Set cookies di request (untuk logic internal)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )

          // Buat response baru dengan cookies updated
          response = NextResponse.next({
            request,
          })

          // Set cookies di response (untuk send ke browser)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  /**
   * STEP 3: Refresh session user
   * 
   * supabase.auth.getUser() melakukan:
   * 1. Baca session token dari cookies
   * 2. Cek apakah token masih valid
   * 3. Jika hampir expired, refresh otomatis
   * 4. Return user data jika valid, null jika tidak
   * 
   * PENTING:
   * - JANGAN pakai getSession(), pakai getUser()
   * - getUser() lebih secure karena validate di server Supabase
   * - getSession() hanya baca dari cookie tanpa validasi
   */
  const {
    data: { user },
  } = await supabase.auth.getUser()

  /**
   * STEP 4: Protect Dashboard Routes
   * 
   * Jika user BELUM login dan coba akses /todos atau /dashboard
   * Redirect ke halaman login
   * 
   * pathname.startsWith() = cek apakah URL dimulai dengan string tertentu
   */
  if (!user && request.nextUrl.pathname.startsWith('/todos')) {
    // User belum login, redirect ke /login
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  /**
   * STEP 5: Redirect authenticated users dari login/register
   * 
   * Jika user SUDAH login tapi masih akses halaman login/register
   * Redirect ke dashboard untuk better UX
   * 
   * Use case: User klik back button setelah login
   */
  if (
    user &&
    (request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/register'))
  ) {
    // User sudah login, redirect ke todos
    const redirectUrl = new URL('/todos', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  /**
   * STEP 6: Return response
   * 
   * Jika tidak ada redirect, lanjutkan ke page yang diminta
   * Response sudah include cookies yang di-update (session refresh)
   */
  return response
}
