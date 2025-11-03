/**
 * Types Index - Barrel Export
 * 
 * FUNGSI:
 * Central export point untuk semua types.
 * Memudahkan import dari satu tempat.
 * 
 * KEUNTUNGAN BARREL EXPORT:
 * 
 * // ❌ Tanpa barrel:
 * import { Todo } from '@/types/database.types'
 * import { LoginInput } from '@/types/auth.types'
 * import { ApiResponse } from '@/types/api.types'
 * 
 * // ✅ Dengan barrel:
 * import { Todo, LoginInput, ApiResponse } from '@/types'
 * 
 * Lebih clean dan konsisten!
 */

// Export semua database types
export type {
  Database,
  Json,
  Todo,
  TodoInsert,
  TodoUpdate,
  TodoWithoutTimestamps,
  TodoFormData,
} from './database.types'

// Nanti kita tambah types lain:
// export type { ... } from './auth.types'
// export type { ... } from './api.types'
