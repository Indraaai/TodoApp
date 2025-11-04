/**
 * Stores Index - Barrel Export
 * 
 * Central export untuk semua Zustand stores
 * Memudahkan import
 */

export { useUIStore } from './ui-store'
export { useAuthStore } from './auth-store'

/**
 * USAGE:
 * 
 * // ✅ Dengan barrel export
 * import { useUIStore, useAuthStore } from '@/lib/stores'
 * 
 * // ❌ Tanpa barrel (lebih panjang)
 * import { useUIStore } from '@/lib/stores/ui-store'
 * import { useAuthStore } from '@/lib/stores/auth-store'
 */
