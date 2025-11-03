import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js Middleware - Entry Point
 * 
 * FUNGSI:
 * File ini adalah ENTRY POINT untuk semua middleware logic di aplikasi.
 * Next.js akan otomatis detect file bernama 'middleware.ts' di root project.
 * 
 * LETAK FILE:
 * File ini HARUS di root project (sejajar dengan app/, lib/, dll)
 * BUKAN di dalam folder app/ atau lib/
 * 
 * CARA KERJA:
 * 1. Setiap HTTP request masuk ke aplikasi
 * 2. Next.js jalankan function middleware() di bawah
 * 3. Function ini call updateSession() dari Supabase
 * 4. Setelah selesai, request lanjut ke page/API
 * 
 * FLOW:
 * Browser Request 
 *   → Next.js detect middleware.ts
 *   → Run middleware() function
 *   → Call updateSession() (Supabase auth logic)
 *   → Return response (allow/redirect)
 *   → Continue to Page/API
 * 
 * KENAPA TERPISAH?
 * - Separation of concerns: Next.js logic vs Supabase logic
 * - Modular: Bisa tambah middleware lain (logging, analytics, dll)
 * - Clean: File ini jadi orchestrator, logic detail di file lain
 * 
 * CONTOH MULTIPLE MIDDLEWARE:
 * export async function middleware(request: NextRequest) {
 *   // 1. Logging middleware
 *   await logRequest(request)
 *   
 *   // 2. Auth middleware (Supabase)
 *   const authResponse = await updateSession(request)
 *   if (authResponse.status === 307) return authResponse // Redirect
 *   
 *   // 3. Rate limiting middleware
 *   await checkRateLimit(request)
 *   
 *   return authResponse
 * }
 */
export async function middleware(request: NextRequest) {
  /**
   * Call Supabase middleware
   * 
   * updateSession() akan:
   * - Refresh user session
   * - Check authentication
   * - Protect routes
   * - Handle redirects
   * 
   * Return NextResponse (allow atau redirect)
   */
  return await updateSession(request)
}

/**
 * Matcher Configuration
 * 
 * FUNGSI:
 * Menentukan path mana saja yang akan di-process oleh middleware.
 * Untuk performance, kita exclude static files (images, CSS, dll).
 * 
 * REGEX EXPLANATION:
 * (?!...) = Negative lookahead (jangan match yang di dalam)
 * 
 * Yang DI-EXCLUDE (tidak diproses middleware):
 * - _next/static/*     → Next.js static files (JS, CSS chunks)
 * - _next/image/*      → Next.js optimized images
 * - favicon.ico        → Favicon
 * - .*\.svg|png|jpg... → Semua file gambar
 * 
 * Yang DI-INCLUDE (diproses middleware):
 * - / (homepage)
 * - /login
 * - /register
 * - /todos
 * - /api/*
 * - Semua routes lainnya
 * 
 * KENAPA EXCLUDE STATIC FILES?
 * - Performance: Static files tidak butuh auth check
 * - Reduce overhead: Middleware tidak perlu jalan untuk setiap image/CSS
 * - Faster response: Static files langsung served tanpa processing
 * 
 * CONTOH:
 * Request ke /logo.png → SKIP middleware (langsung served)
 * Request ke /todos → RUN middleware (cek auth, dll)
 * 
 * CUSTOM MATCHER:
 * Kalau mau protect hanya route tertentu:
 * 
 * export const config = {
 *   matcher: [
 *     '/todos/:path*',      // Semua path di bawah /todos
 *     '/dashboard/:path*',  // Semua path di bawah /dashboard
 *     '/api/protected/:path*', // Protected API routes
 *   ],
 * }
 */
export const config = {
  matcher: [
    /*
     * Match all request paths kecuali yang dimulai dengan:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Files dengan extension: .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
