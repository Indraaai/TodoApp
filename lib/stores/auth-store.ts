import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { User } from '@supabase/supabase-js'

/**
 * Auth Store - State Management untuk Authentication
 * 
 * FUNGSI:
 * Store ini menyimpan user authentication state.
 * Centralized state untuk current user & loading status.
 * 
 * KAPAN DIGUNAKAN:
 * - Check if user is logged in
 * - Get current user data
 * - Track auth loading state
 * - Sync auth state across components
 * 
 * NOTE: OPTIONAL STORE
 * Supabase sudah handle auth state internally.
 * Store ini hanya untuk convenience & centralization.
 * 
 * ALTERNATIF tanpa store:
 * 
 * // Di setiap component yang butuh user:
 * const supabase = createClient()
 * const { data: { user } } = await supabase.auth.getUser()
 * 
 * // Dengan store (cleaner):
 * const user = useAuthStore((state) => state.user)
 * 
 * KENAPA ZUSTAND untuk Auth?
 * ✅ Centralized state (single source of truth)
 * ✅ Easy access from any component
 * ✅ No prop drilling
 * ✅ DevTools integration
 * ❌ NOT persisted (security - don't store auth in localStorage)
 * 
 * SECURITY NOTE:
 * - User data tidak di-persist ke localStorage
 * - Session disimpan di httpOnly cookies (handled by Supabase)
 * - Store ini hanya in-memory cache
 * - Refresh page → fetch user from Supabase again
 * 
 * CARA KERJA:
 * 1. App load → Check auth → setUser()
 * 2. Login success → setUser(user)
 * 3. Logout → setUser(null)
 * 4. Components subscribe → auto re-render on change
 */

/**
 * AuthState Interface
 * 
 * Define state shape & actions
 */
interface AuthState {
  // ==================
  // STATE PROPERTIES
  // ==================

  /**
   * User Data
   * 
   * Current authenticated user from Supabase
   * null = user not logged in
   * 
   * User object contains:
   * - id: UUID
   * - email: string
   * - created_at: timestamp
   * - user_metadata: custom data
   * - app_metadata: system data
   * - etc.
   * 
   * TYPE:
   * User from @supabase/supabase-js
   * Type-safe dengan Supabase User type
   */
  user: User | null

  /**
   * Loading State
   * 
   * Track whether auth check is in progress
   * 
   * STATES:
   * - true: Checking auth status
   * - false: Auth check complete
   * 
   * USE CASE:
   * Show loading spinner while checking if user logged in
   * 
   * FLOW:
   * 1. App load → loading: true
   * 2. Check Supabase auth
   * 3. Set user → loading: false
   */
  loading: boolean

  // ==================
  // ACTIONS
  // ==================

  /**
   * Set User
   * 
   * Update user state
   * Auto set loading to false
   * 
   * @param user - User object atau null
   * 
   * USAGE:
   * setUser(userObject)  // User logged in
   * setUser(null)        // User logged out
   */
  setUser: (user: User | null) => void

  /**
   * Set Loading
   * 
   * Manual control loading state
   * 
   * @param loading - true/false
   * 
   * USAGE:
   * setLoading(true)   // Start loading
   * setLoading(false)  // Stop loading
   */
  setLoading: (loading: boolean) => void
}

/**
 * Create Auth Store
 * 
 * MIDDLEWARE:
 * - devtools: Redux DevTools integration
 * - NO persist: Security (don't store auth in localStorage)
 * 
 * WHY NO PERSIST?
 * 1. Security: Auth tokens in localStorage = XSS vulnerable
 * 2. Supabase handles session in httpOnly cookies (secure)
 * 3. Refresh page → fetch user from Supabase (always fresh)
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      // ==================
      // INITIAL STATE
      // ==================

      /**
       * Default: No user
       * 
       * User harus fetch dari Supabase saat app load
       * Tidak assume user logged in
       */
      user: null,

      /**
       * Default: Loading true
       * 
       * App load → assume checking auth
       * Component akan show loading UI
       * Setelah check selesai → set false
       */
      loading: true,

      // ==================
      // ACTIONS IMPLEMENTATION
      // ==================

      /**
       * setUser Implementation
       * 
       * Update user & set loading to false
       * 
       * CONTOH:
       * // Login success
       * const { data: { user } } = await supabase.auth.signInWithPassword({...})
       * setUser(user) // Update store
       * 
       * // Logout
       * await supabase.auth.signOut()
       * setUser(null) // Clear store
       * 
       * WHY loading: false?
       * Kalau setUser dipanggil, auth check sudah selesai
       * Auto set loading false untuk convenience
       */
      setUser: (user) => set({ user, loading: false }),

      /**
       * setLoading Implementation
       * 
       * Manual control loading
       * 
       * CONTOH:
       * // Start auth check
       * setLoading(true)
       * const { data: { user } } = await supabase.auth.getUser()
       * setUser(user) // Auto sets loading to false
       * 
       * // Or manual:
       * setLoading(false)
       */
      setLoading: (loading) => set({ loading }),
    }),
    {
      /**
       * DEVTOOLS CONFIGURATION
       * 
       * name: Store name di Redux DevTools
       * Distinguish from UIStore
       */
      name: 'AuthStore',
    }
  )
)

/**
 * INITIALIZATION PATTERN
 * 
 * Setup auth check di root layout atau _app
 * 
 * EXAMPLE: app/layout.tsx atau special component
 * 
 * 'use client'
 * 
 * import { useEffect } from 'react'
 * import { createClient } from '@/lib/supabase/client'
 * import { useAuthStore } from '@/lib/stores/auth-store'
 * 
 * function AuthProvider({ children }: { children: React.ReactNode }) {
 *   const setUser = useAuthStore((state) => state.setUser)
 *   const setLoading = useAuthStore((state) => state.setLoading)
 * 
 *   useEffect(() => {
 *     const supabase = createClient()
 * 
 *     // Check current session
 *     async function getUser() {
 *       setLoading(true)
 *       const { data: { user } } = await supabase.auth.getUser()
 *       setUser(user)
 *     }
 * 
 *     getUser()
 * 
 *     // Listen to auth changes
 *     const {
 *       data: { subscription },
 *     } = supabase.auth.onAuthStateChange((_event, session) => {
 *       setUser(session?.user ?? null)
 *     })
 * 
 *     return () => subscription.unsubscribe()
 *   }, [setUser, setLoading])
 * 
 *   return <>{children}</>
 * }
 * 
 * CARA KERJA:
 * 1. Component mount
 * 2. Get current user from Supabase
 * 3. Update store
 * 4. Subscribe to auth changes
 * 5. On login/logout → auto update store
 * 6. All components get updated user state
 */

/**
 * USAGE EXAMPLES
 * 
 * EXAMPLE 1: Check if user logged in
 * 
 * function Header() {
 *   const user = useAuthStore((state) => state.user)
 * 
 *   return (
 *     <header>
 *       {user ? (
 *         <span>Welcome, {user.email}</span>
 *       ) : (
 *         <a href="/login">Login</a>
 *       )}
 *     </header>
 *   )
 * }
 * 
 * EXAMPLE 2: Show loading state
 * 
 * function App() {
 *   const { user, loading } = useAuthStore((state) => ({
 *     user: state.user,
 *     loading: state.loading,
 *   }))
 * 
 *   if (loading) {
 *     return <div>Loading...</div>
 *   }
 * 
 *   return user ? <Dashboard /> : <Login />
 * }
 * 
 * EXAMPLE 3: Protected component
 * 
 * function ProtectedComponent() {
 *   const user = useAuthStore((state) => state.user)
 * 
 *   if (!user) {
 *     return <div>Please login</div>
 *   }
 * 
 *   return <div>Protected content for {user.email}</div>
 * }
 * 
 * EXAMPLE 4: Get user ID for queries
 * 
 * function MyTodos() {
 *   const user = useAuthStore((state) => state.user)
 * 
 *   const { data: todos } = useQuery({
 *     queryKey: ['todos', user?.id],
 *     queryFn: async () => {
 *       const { data } = await supabase
 *         .from('todos')
 *         .select('*')
 *         .eq('user_id', user!.id)
 *       return data
 *     },
 *     enabled: !!user, // Only fetch if user exists
 *   })
 * 
 *   return <div>...</div>
 * }
 */

/**
 * ALTERNATIVE: Without Auth Store
 * 
 * Kalau tidak mau pakai Zustand untuk auth, bisa langsung pakai Supabase:
 * 
 * 'use client'
 * 
 * function Component() {
 *   const [user, setUser] = useState<User | null>(null)
 *   const supabase = createClient()
 * 
 *   useEffect(() => {
 *     supabase.auth.getUser().then(({ data: { user } }) => {
 *       setUser(user)
 *     })
 * 
 *     const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
 *       setUser(session?.user ?? null)
 *     })
 * 
 *     return () => subscription.unsubscribe()
 *   }, [])
 * 
 *   // Use user state
 * }
 * 
 * PROS & CONS:
 * 
 * With Zustand:
 * ✅ Centralized state
 * ✅ Easy access dari semua components
 * ✅ DevTools
 * ❌ Extra dependency
 * 
 * Without Zustand:
 * ✅ Less dependencies
 * ✅ Direct Supabase usage
 * ❌ Duplicate logic di banyak components
 * ❌ Prop drilling jika perlu share state
 */
