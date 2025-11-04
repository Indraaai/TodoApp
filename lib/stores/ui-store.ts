import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

/**
 * UI Store - State Management untuk UI
 * 
 * FUNGSI:
 * Store ini mengelola state yang berhubungan dengan UI/tampilan.
 * Bukan server data (todos, user), tapi CLIENT state (sidebar, filter, search).
 * 
 * KAPAN DIGUNAKAN:
 * - Sidebar open/close
 * - Filter selections
 * - Search queries
 * - Theme preferences
 * - Modal states
 * - Any temporary UI state
 * 
 * KENAPA ZUSTAND untuk UI State?
 * ✅ Simple API (no Provider needed)
 * ✅ No boilerplate (unlike Redux)
 * ✅ TypeScript support excellent
 * ✅ DevTools integration
 * ✅ Persistence (localStorage)
 * ✅ Minimal re-renders
 * 
 * ZUSTAND vs TANSTACK QUERY:
 * 
 * | State Type | Tool | Example |
 * |------------|------|---------|
 * | Server State | TanStack Query | Todos, User profile |
 * | UI State | Zustand | Sidebar, Filters, Search |
 * | Form State | React Hook Form | Login form, Todo form |
 * | URL State | Next.js Router | Page params, Query strings |
 * 
 * CARA KERJA:
 * 1. create() membuat store dengan initial state & actions
 * 2. devtools() untuk Redux DevTools integration
 * 3. persist() untuk auto save/restore dari localStorage
 * 4. Components bisa akses store dengan useUIStore()
 * 
 * CONTOH PENGGUNAAN:
 * 
 * import { useUIStore } from '@/lib/stores/ui-store'
 * 
 * function Sidebar() {
 *   const { sidebarOpen, toggleSidebar } = useUIStore()
 *   
 *   return (
 *     <div className={sidebarOpen ? 'open' : 'closed'}>
 *       <button onClick={toggleSidebar}>Toggle</button>
 *     </div>
 *   )
 * }
 */

/**
 * UIState Interface
 * 
 * Define shape dari state & actions
 * TypeScript akan enforce type safety
 */
interface UIState {
  // ==================
  // STATE PROPERTIES
  // ==================
  
  /**
   * Sidebar State
   * 
   * Track apakah sidebar terbuka atau tertutup
   * Useful untuk mobile responsive (hide sidebar di mobile)
   */
  sidebarOpen: boolean

  /**
   * Filter Completed State
   * 
   * Filter todos berdasarkan status completed:
   * - 'all': Show semua todos
   * - 'active': Show hanya todos yang belum completed
   * - 'completed': Show hanya todos yang sudah completed
   * 
   * CONTOH:
   * User pilih filter 'active'
   * → UI hanya show todos dengan completed: false
   */
  filterCompleted: 'all' | 'active' | 'completed'

  /**
   * Search Query State
   * 
   * Track search input user
   * Untuk filter todos by title/description
   * 
   * CONTOH:
   * User ketik "belajar"
   * → UI hanya show todos yang title/description contain "belajar"
   */
  searchQuery: string

  /**
   * Sort By State (Optional - bisa ditambah nanti)
   * 
   * Sort todos berdasarkan:
   * - 'date': Sort by created_at (newest first)
   * - 'priority': Sort by priority (high → medium → low)
   * - 'title': Sort alphabetically
   */
  // sortBy: 'date' | 'priority' | 'title'

  /**
   * View Mode State (Optional - bisa ditambah nanti)
   * 
   * Toggle view mode:
   * - 'list': List view (default)
   * - 'grid': Grid view
   * - 'kanban': Kanban board
   */
  // viewMode: 'list' | 'grid' | 'kanban'

  // ==================
  // ACTIONS (Functions)
  // ==================

  /**
   * Set Sidebar Open
   * 
   * Set sidebar state (open/close)
   * 
   * @param open - true untuk buka, false untuk tutup
   * 
   * CONTOH:
   * setSidebarOpen(true)  // Buka sidebar
   * setSidebarOpen(false) // Tutup sidebar
   */
  setSidebarOpen: (open: boolean) => void

  /**
   * Toggle Sidebar
   * 
   * Toggle sidebar (buka → tutup, tutup → buka)
   * Lebih convenient dari setSidebarOpen
   * 
   * CONTOH:
   * toggleSidebar() // Jika open → close, jika close → open
   */
  toggleSidebar: () => void

  /**
   * Set Filter Completed
   * 
   * Set filter untuk todos
   * 
   * @param filter - 'all' | 'active' | 'completed'
   * 
   * CONTOH:
   * setFilterCompleted('active')     // Show todos aktif saja
   * setFilterCompleted('completed')  // Show todos completed saja
   * setFilterCompleted('all')        // Show semua
   */
  setFilterCompleted: (filter: 'all' | 'active' | 'completed') => void

  /**
   * Set Search Query
   * 
   * Update search query dari input user
   * 
   * @param query - Search string
   * 
   * CONTOH:
   * setSearchQuery('belajar') // Search "belajar"
   * setSearchQuery('')        // Clear search
   */
  setSearchQuery: (query: string) => void

  /**
   * Reset Filters (Optional helper)
   * 
   * Reset semua filters ke default
   * Useful untuk "Clear All Filters" button
   */
  // resetFilters: () => void
}

/**
 * Create UI Store
 * 
 * MIDDLEWARE COMPOSITION:
 * create<UIState>()(...) membuat store dengan TypeScript types
 * devtools(...) wraps untuk Redux DevTools integration
 * persist(...) wraps untuk localStorage persistence
 * 
 * EXECUTION ORDER:
 * persist → devtools → store creation
 * 
 * ARCHITECTURE:
 * Store Creation
 *   └── devtools (Redux DevTools)
 *       └── persist (localStorage)
 *           └── state & actions
 */
export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        // ==================
        // INITIAL STATE
        // ==================
        
        /**
         * Default: Sidebar terbuka
         * 
         * Desktop: Open by default (ada space)
         * Mobile: Bisa override dengan media query
         */
        sidebarOpen: true,

        /**
         * Default: Show all todos
         * 
         * Tidak ada filter by default
         * User bisa pilih filter sesuai kebutuhan
         */
        filterCompleted: 'all',

        /**
         * Default: Empty search
         * 
         * Tidak ada search aktif
         * Show semua todos
         */
        searchQuery: '',

        // ==================
        // ACTIONS IMPLEMENTATION
        // ==================

        /**
         * setSidebarOpen Implementation
         * 
         * set() adalah function dari Zustand untuk update state
         * Mirip seperti setState di React
         * 
         * CARA KERJA:
         * 1. Call setSidebarOpen(true)
         * 2. set({ sidebarOpen: true })
         * 3. State updated
         * 4. Components yang pakai state ini re-render
         * 
         * PARTIAL UPDATE:
         * set() hanya update property yang disebutkan
         * Property lain tidak berubah
         */
        setSidebarOpen: (open) => set({ sidebarOpen: open }),

        /**
         * toggleSidebar Implementation
         * 
         * set() bisa terima callback function
         * Callback dapat current state sebagai parameter
         * Return new state (atau partial state)
         * 
         * CARA KERJA:
         * 1. Call toggleSidebar()
         * 2. set((state) => { ... })
         * 3. Get current state.sidebarOpen
         * 4. Return opposite value
         * 5. State updated
         * 
         * IMMUTABILITY:
         * state parameter adalah READ ONLY
         * Jangan mutate langsung!
         * Always return new object
         * 
         * ✅ BENAR:
         * set((state) => ({ sidebarOpen: !state.sidebarOpen }))
         * 
         * ❌ SALAH:
         * set((state) => {
         *   state.sidebarOpen = !state.sidebarOpen // Mutate! ❌
         *   return state
         * })
         */
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        /**
         * setFilterCompleted Implementation
         * 
         * Simple setter dengan parameter
         * Type-safe: hanya accept 'all' | 'active' | 'completed'
         * 
         * TypeScript akan error jika:
         * setFilterCompleted('invalid') // ❌ Type error
         */
        setFilterCompleted: (filter) => set({ filterCompleted: filter }),

        /**
         * setSearchQuery Implementation
         * 
         * Update search query
         * Components akan re-render dengan filtered todos
         */
        setSearchQuery: (query) => set({ searchQuery: query }),

        // Optional: Reset filters helper
        // resetFilters: () => set({
        //   filterCompleted: 'all',
        //   searchQuery: '',
        // }),
      }),
      {
        /**
         * PERSIST CONFIGURATION
         * 
         * name: Key di localStorage
         * localStorage.getItem('ui-store')
         */
        name: 'ui-store',

        /**
         * PARTIALIZE - Select what to persist
         * 
         * Tidak semua state perlu di-persist
         * Hanya persist yang berguna setelah refresh
         * 
         * PERSIST:
         * - sidebarOpen: User preference
         * - filterCompleted: User preference
         * 
         * DON'T PERSIST:
         * - searchQuery: Temporary (clear after refresh)
         * 
         * CARA KERJA:
         * partialize: (state) => ({
         *   property1: state.property1, // ✅ Persisted
         *   property2: state.property2, // ✅ Persisted
         *   // property3 tidak disebutkan → ❌ Not persisted
         * })
         * 
         * CONTOH:
         * User:
         * 1. Toggle sidebar closed
         * 2. Set filter to 'active'
         * 3. Search "belajar"
         * 4. Refresh page
         * 
         * After refresh:
         * - sidebarOpen: false ✅ (persisted)
         * - filterCompleted: 'active' ✅ (persisted)
         * - searchQuery: '' ❌ (not persisted, back to default)
         */
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          filterCompleted: state.filterCompleted,
          // searchQuery NOT persisted (temporary)
        }),

        /**
         * STORAGE - Custom storage (Optional)
         * 
         * Default: localStorage
         * Bisa ganti ke sessionStorage, AsyncStorage (React Native), dll
         * 
         * CONTOH sessionStorage:
         * storage: createJSONStorage(() => sessionStorage),
         * 
         * PERBEDAAN:
         * - localStorage: Persist even after browser close
         * - sessionStorage: Clear saat close tab
         */
        // storage: createJSONStorage(() => sessionStorage),

        /**
         * VERSION - Migration support (Optional)
         * 
         * Kalau schema store berubah, pakai version untuk migration
         * 
         * CONTOH:
         * version: 1,
         * migrate: (persistedState, version) => {
         *   if (version === 0) {
         *     // Migrate from v0 to v1
         *     return {
         *       ...persistedState,
         *       newField: 'default value'
         *     }
         *   }
         *   return persistedState
         * }
         */
      }
    ),
    {
      /**
       * DEVTOOLS CONFIGURATION
       * 
       * name: Nama store di Redux DevTools
       * Kalau ada multiple stores, bisa distinguish by name
       * 
       * CARA PAKAI DEVTOOLS:
       * 1. Install Redux DevTools browser extension
       * 2. Buka DevTools di browser (F12)
       * 3. Tab "Redux"
       * 4. Lihat state & actions
       * 5. Time-travel debugging!
       * 
       * FEATURES:
       * - View state changes
       * - Action history
       * - Time-travel (undo/redo)
       * - Export/import state
       */
      name: 'UIStore',

      /**
       * ENABLED - Toggle devtools (Optional)
       * 
       * Default: true di development, false di production
       * Bisa manual control:
       * 
       * enabled: process.env.NODE_ENV === 'development',
       */
    }
  )
)

/**
 * CARA PAKAI di Components
 * 
 * EXAMPLE 1: Get single value
 * 
 * function Sidebar() {
 *   const sidebarOpen = useUIStore((state) => state.sidebarOpen)
 *   
 *   // Component hanya re-render kalau sidebarOpen berubah
 *   // Tidak re-render kalau filterCompleted atau searchQuery berubah
 *   
 *   return <div>{sidebarOpen ? 'Open' : 'Closed'}</div>
 * }
 * 
 * EXAMPLE 2: Get multiple values
 * 
 * function TodoFilters() {
 *   const { filterCompleted, setFilterCompleted } = useUIStore((state) => ({
 *     filterCompleted: state.filterCompleted,
 *     setFilterCompleted: state.setFilterCompleted,
 *   }))
 *   
 *   return (
 *     <select value={filterCompleted} onChange={(e) => setFilterCompleted(e.target.value)}>
 *       <option value="all">All</option>
 *       <option value="active">Active</option>
 *       <option value="completed">Completed</option>
 *     </select>
 *   )
 * }
 * 
 * EXAMPLE 3: Get all state (not recommended)
 * 
 * function Component() {
 *   const store = useUIStore()
 *   // Re-render kalau ANY property berubah ❌
 *   
 *   // Better: Select specific properties
 * }
 * 
 * EXAMPLE 4: Actions only
 * 
 * function ToggleButton() {
 *   const toggleSidebar = useUIStore((state) => state.toggleSidebar)
 *   
 *   // Component tidak re-render kalau state berubah
 *   // Hanya get action function
 *   
 *   return <button onClick={toggleSidebar}>Toggle</button>
 * }
 */
