import { z } from 'zod'

/**
 * Todo Zod Schemas
 * 
 * FUNGSI:
 * Schemas ini untuk validasi data todos di client dan server.
 * Dengan Zod, kita dapat:
 * 1. Validate input data (forms, API requests)
 * 2. Auto-generate TypeScript types
 * 3. Custom error messages
 * 4. Transform data
 * 5. Reuse schema di berbagai tempat
 * 
 * KENAPA ZOD?
 * ✅ TypeScript-first (type inference)
 * ✅ Zero dependencies
 * ✅ Small bundle size (~8kb)
 * ✅ Chainable API (easy to read)
 * ✅ Custom error messages
 * ✅ Composable schemas
 * ✅ Runtime validation + compile-time types
 * 
 * KAPAN DIGUNAKAN:
 * - Form validation (React Hook Form)
 * - API request validation (Server Actions)
 * - Response validation
 * - Environment variables validation
 * - Config validation
 * 
 * ARCHITECTURE:
 * Schema Definition
 *   ↓
 * Form Input → Validation → Error/Success
 *   ↓
 * Server Action → Validation → Database
 *   ↓
 * Type Safety di semua layer
 */

/**
 * BASE TODO SCHEMA
 * 
 * Schema lengkap untuk Todo object
 * Includes semua fields dari database
 * 
 * USAGE:
 * - Type inference
 * - Validation data dari database
 * - Base untuk schemas lain (compose)
 */
export const TodoSchema = z.object({
  /**
   * ID Field
   * 
   * z.string() = Must be string
   * .uuid() = Must be valid UUID format
   * .optional() = Field bisa tidak ada (untuk insert)
   * 
   * VALIDATION:
   * ✅ "123e4567-e89b-12d3-a456-426614174000"
   * ❌ "invalid-uuid"
   * ❌ 123 (number)
   * ✅ undefined (karena optional)
   */
  id: z.string().uuid().optional(),

  /**
   * Title Field
   * 
   * z.string() = Must be string
   * .min(1, '...') = Minimum 1 karakter (tidak boleh empty)
   * .max(100, '...') = Maximum 100 karakter
   * .trim() = Remove whitespace di awal/akhir
   * 
   * Custom error messages:
   * - Parameter kedua di .min() dan .max()
   * - User-friendly error messages
   * - Bisa dikustomisasi sesuai bahasa
   * 
   * VALIDATION:
   * ✅ "Belajar Next.js"
   * ✅ "A" (1 karakter)
   * ❌ "" (empty string)
   * ❌ "   " (hanya spaces, akan di-trim jadi "")
   * ❌ "x".repeat(101) (lebih dari 100 karakter)
   * 
   * TRANSFORM:
   * Input: "  Belajar Next.js  "
   * After .trim(): "Belajar Next.js"
   */
  title: z
    .string()
    .min(1, 'Judul tidak boleh kosong')
    .max(100, 'Judul maksimal 100 karakter')
    .trim(),

  /**
   * Description Field
   * 
   * .max(500, '...') = Maximum 500 karakter
   * .trim() = Remove whitespace
   * .optional() = Field bisa tidak ada
   * .nullable() = Field bisa null
   * 
   * OPTIONAL vs NULLABLE:
   * - optional(): Field bisa tidak ada di object
   * - nullable(): Field ada di object, value bisa null
   * - optional().nullable(): Field bisa tidak ada ATAU null
   * 
   * CONTOH:
   * { title: "Test" } ✅ (description tidak ada - optional)
   * { title: "Test", description: null } ✅ (description null - nullable)
   * { title: "Test", description: "..." } ✅ (description ada)
   * 
   * VALIDATION:
   * ✅ "Deskripsi lengkap"
   * ✅ null
   * ✅ undefined
   * ❌ "x".repeat(501) (lebih dari 500 karakter)
   */
  description: z
    .string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .trim()
    .optional()
    .nullable(),

  /**
   * Completed Field
   * 
   * z.boolean() = Must be boolean
   * .default(false) = Default value jika tidak ada
   * 
   * DEFAULT:
   * Jika field tidak ada di input, pakai default value
   * 
   * CONTOH:
   * Input: { title: "Test" }
   * After validation: { title: "Test", completed: false }
   * 
   * VALIDATION:
   * ✅ true
   * ✅ false
   * ✅ undefined (akan jadi false)
   * ❌ "true" (string, bukan boolean)
   * ❌ 1 (number, bukan boolean)
   */
  completed: z.boolean().default(false),

  /**
   * Priority Field
   * 
   * z.enum([...]) = Must be one of the values
   * .default('medium') = Default value
   * 
   * ENUM:
   * Hanya accept nilai yang didefinisikan
   * Type-safe: TypeScript akan error jika salah
   * 
   * VALIDATION:
   * ✅ 'low'
   * ✅ 'medium'
   * ✅ 'high'
   * ✅ undefined (akan jadi 'medium')
   * ❌ 'urgent' (tidak ada di enum)
   * ❌ 'LOW' (case sensitive)
   * 
   * TYPE INFERENCE:
   * TypeScript type: 'low' | 'medium' | 'high'
   */
  priority: z.enum(['low', 'medium', 'high']).default('medium'),

  /**
   * Due Date Field
   * 
   * z.string() = Must be string
   * .datetime() = Must be ISO 8601 datetime format
   * .optional() = Field bisa tidak ada
   * .nullable() = Field bisa null
   * 
   * DATETIME FORMAT:
   * ISO 8601: "2024-11-04T10:30:00.000Z"
   * 
   * VALIDATION:
   * ✅ "2024-11-04T10:30:00.000Z"
   * ✅ "2024-11-04T10:30:00Z"
   * ✅ null
   * ✅ undefined
   * ❌ "2024-11-04" (date only, bukan datetime)
   * ❌ "04/11/2024" (format salah)
   * ❌ "invalid date"
   * 
   * CONVERT dari Date object:
   * const date = new Date()
   * const isoString = date.toISOString() // "2024-11-04T10:30:00.000Z"
   */
  due_date: z.string().datetime().optional().nullable(),

  /**
   * User ID Field
   * 
   * Foreign key ke auth.users table
   * UUID format
   * Optional karena akan diisi otomatis di server
   */
  user_id: z.string().uuid().optional(),

  /**
   * Created At Field
   * 
   * Auto-generated timestamp
   * Optional karena database yang isi
   */
  created_at: z.string().datetime().optional(),

  /**
   * Updated At Field
   * 
   * Auto-updated timestamp
   * Optional karena database yang isi
   */
  updated_at: z.string().datetime().optional(),
})

/**
 * CREATE TODO SCHEMA
 * 
 * Schema untuk create new todo (client-side form)
 * Hanya fields yang user isi
 * 
 * SCHEMA COMPOSITION:
 * .pick({ ... }) = Pilih beberapa fields dari TodoSchema
 * Reuse validation rules dari base schema
 * 
 * FIELDS:
 * - title: Required (dari user)
 * - description: Optional (dari user)
 * - priority: Optional, default 'medium'
 * - due_date: Optional (dari user)
 * 
 * NOT INCLUDED:
 * - id: Auto-generated di database
 * - user_id: Diisi di server (dari auth)
 * - completed: Default false
 * - created_at: Auto-generated
 * - updated_at: Auto-generated
 * 
 * USAGE:
 * Form submission, API request body
 * 
 * CONTOH:
 * const formData = {
 *   title: "Belajar Zod",
 *   description: "Tutorial lengkap",
 *   priority: "high",
 *   due_date: "2024-11-05T10:00:00Z"
 * }
 * 
 * const result = CreateTodoSchema.safeParse(formData)
 * if (result.success) {
 *   // result.data = validated & typed data
 * }
 */
export const CreateTodoSchema = TodoSchema.pick({
  title: true,
  description: true,
  priority: true,
  due_date: true,
})

/**
 * UPDATE TODO SCHEMA
 * 
 * Schema untuk update existing todo
 * Semua fields optional (partial update)
 * 
 * SCHEMA COMPOSITION:
 * .pick({ ... }) = Pilih fields yang bisa di-update
 * .partial() = Buat semua fields optional
 * 
 * PARTIAL:
 * Semua fields jadi optional
 * User hanya kirim fields yang mau di-update
 * 
 * CONTOH UPDATES:
 * 
 * // Update 1: Toggle completed
 * { completed: true }
 * 
 * // Update 2: Change title & priority
 * { title: "New title", priority: "high" }
 * 
 * // Update 3: Clear due date
 * { due_date: null }
 * 
 * // Update 4: Complete update
 * {
 *   title: "Updated title",
 *   description: "Updated description",
 *   completed: true,
 *   priority: "low",
 *   due_date: null
 * }
 * 
 * VALIDATION:
 * Hanya validate fields yang ada
 * Fields yang tidak ada di-skip
 * 
 * USAGE:
 * API update request, form edit
 */
export const UpdateTodoSchema = TodoSchema.pick({
  title: true,
  description: true,
  completed: true,
  priority: true,
  due_date: true,
}).partial()

/**
 * DELETE TODO SCHEMA
 * 
 * Schema untuk delete todo
 * Hanya perlu ID
 * 
 * VALIDATION:
 * ✅ { id: "valid-uuid" }
 * ❌ { id: "invalid" }
 * ❌ {} (id required)
 */
export const DeleteTodoSchema = z.object({
  id: z.string().uuid('ID tidak valid'),
})

/**
 * TOGGLE TODO SCHEMA
 * 
 * Schema untuk toggle completed status
 * Quick action: hanya id & completed
 * 
 * USAGE:
 * Checkbox click → toggle todo
 * 
 * CONTOH:
 * { id: "uuid", completed: true }
 */
export const ToggleTodoSchema = z.object({
  id: z.string().uuid('ID tidak valid'),
  completed: z.boolean(),
})

/**
 * FILTER TODOS SCHEMA
 * 
 * Schema untuk filter & search params
 * Validasi query parameters
 * 
 * FIELDS:
 * - status: Filter by completed status
 * - priority: Filter by priority
 * - search: Search query
 * - sortBy: Sort field
 * - sortOrder: Sort direction
 * 
 * USAGE:
 * URL query params, filter form
 * 
 * CONTOH URL:
 * /todos?status=active&priority=high&search=belajar&sortBy=date&sortOrder=desc
 */
export const FilterTodosSchema = z.object({
  status: z.enum(['all', 'active', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['date', 'priority', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

// ==================
// TYPE EXPORTS
// ==================

/**
 * Type Inference dari Zod Schemas
 * 
 * z.infer<typeof Schema> = Extract TypeScript type
 * 
 * BENEFIT:
 * - Single source of truth (schema)
 * - Runtime validation + compile-time types
 * - No duplicate type definitions
 * 
 * CONTOH:
 * 
 * // ❌ Duplicate definitions (bad)
 * const schema = z.object({ title: z.string() })
 * type Todo = { title: string }  // Duplicate!
 * 
 * // ✅ Single source (good)
 * const schema = z.object({ title: z.string() })
 * type Todo = z.infer<typeof schema>  // Auto-generated!
 */

/**
 * Todo Type
 * Full todo object with all fields
 */
export type Todo = z.infer<typeof TodoSchema>

/**
 * CreateTodo Type
 * Data untuk create new todo
 */
export type CreateTodo = z.infer<typeof CreateTodoSchema>

/**
 * UpdateTodo Type
 * Data untuk update existing todo (partial)
 */
export type UpdateTodo = z.infer<typeof UpdateTodoSchema>

/**
 * DeleteTodo Type
 * Data untuk delete todo
 */
export type DeleteTodo = z.infer<typeof DeleteTodoSchema>

/**
 * ToggleTodo Type
 * Data untuk toggle completed status
 */
export type ToggleTodo = z.infer<typeof ToggleTodoSchema>

/**
 * FilterTodos Type
 * Data untuk filter & search
 */
export type FilterTodos = z.infer<typeof FilterTodosSchema>

/**
 * VALIDATION EXAMPLES
 * 
 * // Example 1: Safe Parse (recommended)
 * const result = CreateTodoSchema.safeParse(data)
 * if (result.success) {
 *   // result.data: CreateTodo (typed & validated)
 *   console.log(result.data.title)
 * } else {
 *   // result.error: ZodError
 *   console.log(result.error.errors)
 * }
 * 
 * // Example 2: Parse (throws on error)
 * try {
 *   const data = CreateTodoSchema.parse(input)
 *   // data: CreateTodo (typed & validated)
 * } catch (error) {
 *   // ZodError thrown
 * }
 * 
 * // Example 3: Partial validation
 * const result = UpdateTodoSchema.safeParse({ title: "New title" })
 * // Only validates fields that are present
 * 
 * // Example 4: With React Hook Form
 * const form = useForm<CreateTodo>({
 *   resolver: zodResolver(CreateTodoSchema),
 *   defaultValues: {
 *     title: '',
 *     description: '',
 *     priority: 'medium'
 *   }
 * })
 * 
 * // Example 5: Transform data
 * const data = CreateTodoSchema.parse({
 *   title: "  Belajar  ",  // Has spaces
 * })
 * console.log(data.title) // "Belajar" (trimmed!)
 * console.log(data.completed) // false (default!)
 */
