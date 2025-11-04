'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

/**
 * TanStack Query Provider
 * 
 * FUNGSI:
 * Wrapper component yang menyediakan QueryClient ke seluruh aplikasi.
 * QueryClient adalah "state manager" untuk server state (data dari API/database).
 * 
 * KAPAN DIGUNAKAN:
 * Component ini di-wrap di root layout (app/layout.tsx)
 * Sehingga semua components di bawahnya bisa akses QueryClient.
 * 
 * CARA KERJA:
 * 1. Create QueryClient dengan configuration
 * 2. Wrap children dengan QueryClientProvider
 * 3. Semua child components bisa pakai useQuery, useMutation, dll
 * 
 * KENAPA 'use client'?
 * - QueryClientProvider adalah Client Component
 * - Butuh React Context (hanya available di client)
 * - Hooks (useState) hanya jalan di client
 * 
 * KENAPA useState untuk QueryClient?
 * - Ensures QueryClient hanya dibuat SATU KALI
 * - Prevent re-creation saat component re-render
 * - Lazy initialization dengan function callback
 * 
 * ARCHITECTURE:
 * App Layout
 *   └── QueryProvider ← This component
 *       └── QueryClientProvider
 *           ├── Your Pages (bisa pakai useQuery)
 *           ├── Your Components (bisa pakai useMutation)
 *           └── ReactQueryDevtools (debug tool)
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  /**
   * Create QueryClient Instance
   * 
   * useState dengan function callback = lazy initialization
   * Function hanya jalan SEKALI saat component pertama kali mount
   * 
   * TANPA lazy init (❌):
   * const [client] = useState(new QueryClient()) 
   * → new QueryClient() jalan setiap render!
   * 
   * DENGAN lazy init (✅):
   * const [client] = useState(() => new QueryClient())
   * → new QueryClient() hanya jalan sekali
   */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /**
             * STALE TIME - Waktu data dianggap "fresh"
             * 
             * Value: 5 menit (5 * 60 * 1000 ms)
             * 
             * CARA KERJA:
             * - Data fetch pertama kali → Status: "fresh"
             * - Setelah 5 menit → Status: "stale" (basi)
             * - Data stale akan di-refetch saat component mount/focus
             * 
             * CONTOH:
             * 1. User fetch todos → Data fresh (tidak refetch 5 menit)
             * 2. User pindah tab lain, kembali setelah 2 menit
             *    → Data masih fresh → Tidak refetch
             * 3. User pindah tab, kembali setelah 6 menit
             *    → Data sudah stale → Auto refetch!
             * 
             * BENEFIT:
             * - Reduce unnecessary network requests
             * - Faster UI (pakai cache kalau masih fresh)
             * - Save bandwidth
             * 
             * ADJUST BASED ON DATA:
             * - Static data (rarely change): staleTime: Infinity
             * - User profile: staleTime: 10 * 60 * 1000 (10 min)
             * - Todos: staleTime: 5 * 60 * 1000 (5 min)
             * - Real-time chat: staleTime: 0 (always refetch)
             */
            staleTime: 5 * 60 * 1000, // 5 minutes

            /**
             * GC TIME (Garbage Collection Time)
             * Formerly: cacheTime
             * 
             * Value: 10 menit (10 * 60 * 1000 ms)
             * 
             * CARA KERJA:
             * - Data di-fetch dan disimpan di cache
             * - Saat component unmount, data tetap di cache
             * - Setelah 10 menit tidak ada component yang pakai → Hapus dari cache
             * 
             * RELATIONSHIP dengan staleTime:
             * gcTime HARUS > staleTime
             * 
             * CONTOH:
             * 1. User buka page Todos → Fetch & cache data
             * 2. User pindah ke page lain → Component unmount
             * 3. Data tetap di cache selama 10 menit
             * 4. User kembali ke Todos dalam 10 menit → Pakai cache (instant!)
             * 5. Setelah 10 menit → Cache dihapus → Fetch lagi
             * 
             * BENEFIT:
             * - Navigation cepat (back/forward pakai cache)
             * - Memory efficient (hapus cache yang tidak terpakai)
             * - Better UX (instant load kalau cache ada)
             */
            gcTime: 10 * 60 * 1000, // 10 minutes

            /**
             * REFETCH ON WINDOW FOCUS
             * 
             * Value: true
             * 
             * CARA KERJA:
             * - User pindah ke tab/window lain
             * - User kembali ke aplikasi kita
             * - Jika data sudah stale → Auto refetch!
             * 
             * CONTOH USE CASE:
             * 1. User buka TodoApp di tab 1
             * 2. User pindah ke tab lain untuk email (10 menit)
             * 3. Di tab lain, ada teammate yang update todos
             * 4. User kembali ke tab TodoApp
             * 5. Auto refetch → User lihat data terbaru!
             * 
             * BENEFIT:
             * - Data selalu up-to-date
             * - User tidak perlu manual refresh
             * - Collaborative apps benefit besar
             * 
             * DISABLE WHEN:
             * - Real-time subscriptions already active (Supabase realtime)
             * - Data rarely changes
             * - Want to save bandwidth
             * 
             * refetchOnWindowFocus: false // Disable jika perlu
             */
            refetchOnWindowFocus: true,

            /**
             * RETRY - Retry failed requests
             * 
             * Value: 1
             * 
             * CARA KERJA:
             * - Request gagal (network error, 500, dll)
             * - Otomatis retry 1 kali
             * - Kalau masih gagal → Status: "error"
             * 
             * CONTOH:
             * 1. User fetch todos → Network error
             * 2. Auto retry sekali
             * 3. Berhasil → Data fetched
             * 
             * ATAU:
             * 1. User fetch todos → Network error
             * 2. Auto retry sekali → Gagal lagi
             * 3. Status: error → Show error UI
             * 
             * BENEFIT:
             * - Handle transient network issues
             * - Better UX (auto recovery)
             * 
             * CUSTOM RETRY:
             * retry: (failureCount, error) => {
             *   // Hanya retry untuk network errors
             *   if (error.message.includes('network')) {
             *     return failureCount < 3
             *   }
             *   return false
             * }
             */
            retry: 1,

            /**
             * REFETCH ON MOUNT
             * 
             * Default: true (kita pakai default)
             * 
             * CARA KERJA:
             * - Component mount
             * - Jika data stale → Refetch
             * - Jika data fresh → Pakai cache
             * 
             * BENEFIT:
             * - Ensure data fresh saat component mount
             * - Combined dengan staleTime untuk optimal behavior
             */
            // refetchOnMount: true, // default

            /**
             * REFETCH ON RECONNECT
             * 
             * Default: true (kita pakai default)
             * 
             * CARA KERJA:
             * - User offline (no internet)
             * - User online kembali
             * - Auto refetch data stale
             * 
             * BENEFIT:
             * - Sync data setelah offline
             * - Mobile-friendly
             */
            // refetchOnReconnect: true, // default
          },

          /**
           * MUTATIONS DEFAULT OPTIONS
           * 
           * Untuk create/update/delete operations
           * Kita bisa set default behavior di sini
           */
          mutations: {
            /**
             * RETRY untuk mutations
             * 
             * Value: 0 (default, tidak retry)
             * 
             * KENAPA tidak retry?
             * - Mutations ubah data (create/update/delete)
             * - Retry bisa duplicate data (create 2x)
             * - Better handle manual di onError callback
             * 
             * Kalau mau retry:
             * retry: 1,
             */
            // retry: 0, // default
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {/* 
        Children = Semua components di app kita
        Sekarang bisa pakai useQuery, useMutation, dll
      */}
      {children}

      {/* 
        React Query DevTools
        
        FUNGSI:
        - Debug tool untuk lihat queries
        - Lihat cache, status, errors
        - Manual trigger refetch
        - Lihat query timeline
        
        CARA PAKAI:
        - Buka app di browser
        - Ada icon "React Query" di bottom-left
        - Click untuk buka devtools
        
        FEATURES:
        - Query Explorer: Lihat semua queries aktif
        - Query Details: Status, data, errors, fetch count
        - Actions: Manual refetch, invalidate, remove
        - Timeline: Lihat history fetch
        
        initialIsOpen:
        - false: Devtools tersembunyi (default)
        - true: Devtools langsung terbuka
        
        PRODUCTION:
        - Devtools otomatis di-exclude di production build
        - Tidak perlu manual remove
        - Zero bundle size di production
      */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
