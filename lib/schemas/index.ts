/**
 * Schemas Index - Barrel Export
 * 
 * Central export untuk semua Zod schemas
 */

// Todo schemas
export {
  TodoSchema,
  CreateTodoSchema,
  UpdateTodoSchema,
  DeleteTodoSchema,
  ToggleTodoSchema,
  FilterTodosSchema,
  type Todo,
  type CreateTodo,
  type UpdateTodo,
  type DeleteTodo,
  type ToggleTodo,
  type FilterTodos,
} from './todo-schema'

// Auth schemas
export {
  LoginSchema,
  RegisterSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  UpdateEmailSchema,
  UpdatePasswordSchema,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type UpdateEmailInput,
  type UpdatePasswordInput,
} from './auth-schema'

/**
 * USAGE:
 * 
 * // ✅ Clean import
 * import { LoginSchema, CreateTodoSchema } from '@/lib/schemas'
 * 
 * // ❌ Without barrel (verbose)
 * import { LoginSchema } from '@/lib/schemas/auth-schema'
 * import { CreateTodoSchema } from '@/lib/schemas/todo-schema'
 */
