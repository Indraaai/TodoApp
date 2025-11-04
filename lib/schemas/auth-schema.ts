import { z } from 'zod'

/**
 * Auth Zod Schemas
 * 
 * FUNGSI:
 * Schemas untuk validasi authentication forms.
 * Login, register, forgot password, etc.
 * 
 * KAPAN DIGUNAKAN:
 * - Login form validation
 * - Register form validation
 * - Password reset validation
 * - Email verification
 * - Server-side auth validation
 * 
 * SECURITY NOTES:
 * - Client-side validation untuk UX (instant feedback)
 * - Server-side validation untuk security (always validate!)
 * - Never trust client input
 * - Zod schemas dipakai di client DAN server
 */

/**
 * LOGIN SCHEMA
 * 
 * Validasi untuk login form
 * Email + Password authentication
 * 
 * FIELDS:
 * - email: Email address
 * - password: Password (min 6 chars)
 * 
 * USE CASE:
 * User login dengan email/password
 */
export const LoginSchema = z.object({
  /**
   * Email Field
   * 
   * z.string() = Must be string
   * .min(1, '...') = Required (tidak boleh empty)
   * .email('...') = Must be valid email format
   * .toLowerCase() = Convert to lowercase
   * 
   * EMAIL VALIDATION:
   * Zod uses RFC 5322 standard
   * 
   * ✅ Valid emails:
   * - "user@example.com"
   * - "user.name@example.com"
   * - "user+tag@example.com"
   * - "user@subdomain.example.com"
   * 
   * ❌ Invalid emails:
   * - "user" (no @)
   * - "user@" (no domain)
   * - "@example.com" (no local part)
   * - "user @example.com" (spaces)
   * - "user@example" (no TLD)
   * 
   * TRANSFORM:
   * Input: "User@Example.COM"
   * After .toLowerCase(): "user@example.com"
   * 
   * WHY toLowerCase?
   * - Email case-insensitive
   * - Consistent storage
   * - Prevent duplicate accounts (User@x.com vs user@x.com)
   */
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid')
    .toLowerCase(),

  /**
   * Password Field
   * 
   * .min(6, '...') = Minimum 6 characters
   * 
   * PASSWORD REQUIREMENTS:
   * - Minimum: 6 characters
   * - No maximum (Supabase handles)
   * - No complexity requirement (untuk simplicity)
   * 
   * SECURITY NOTE:
   * Untuk production, consider:
   * - Minimum 8-12 characters
   * - Require uppercase, lowercase, number, special char
   * - Check against common passwords
   * - Rate limiting
   * 
   * ADVANCED VALIDATION:
   * .min(8, 'Password minimal 8 karakter')
   * .regex(/[A-Z]/, 'Harus ada huruf besar')
   * .regex(/[a-z]/, 'Harus ada huruf kecil')
   * .regex(/[0-9]/, 'Harus ada angka')
   * .regex(/[^A-Za-z0-9]/, 'Harus ada karakter khusus')
   * 
   * VALIDATION:
   * ✅ "password123"
   * ✅ "mySecureP@ss"
   * ❌ "pass" (kurang dari 6 karakter)
   * ❌ "" (empty)
   */
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

/**
 * REGISTER SCHEMA
 * 
 * Validasi untuk register/signup form
 * Email + Password + Confirm Password
 * 
 * FIELDS:
 * - email: Email address
 * - password: Password
 * - confirmPassword: Password confirmation
 * - name: Display name (optional)
 * 
 * VALIDATION:
 * - Email format
 * - Password requirements
 * - Passwords match
 * 
 * USE CASE:
 * New user registration
 */
export const RegisterSchema = z
  .object({
    /**
     * Email Field
     * Same as LoginSchema
     */
    email: z
      .string()
      .min(1, 'Email wajib diisi')
      .email('Format email tidak valid')
      .toLowerCase(),

    /**
     * Password Field
     * 
     * Requirements:
     * - Min: 6 characters
     * - Max: 50 characters (prevent abuse)
     * 
     * MAX LENGTH:
     * Prevent:
     * - DoS attacks (huge passwords)
     * - Database issues
     * - Performance issues
     * 
     * VALIDATION:
     * ✅ "password123"
     * ✅ "x".repeat(50) (exactly 50)
     * ❌ "pass" (less than 6)
     * ❌ "x".repeat(51) (more than 50)
     */
    password: z
      .string()
      .min(6, 'Password minimal 6 karakter')
      .max(50, 'Password maksimal 50 karakter'),

    /**
     * Confirm Password Field
     * 
     * User must re-type password
     * Prevent typos
     * 
     * VALIDATION:
     * - Required field
     * - Must match password (checked via .refine())
     */
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),

    /**
     * Name Field (Optional)
     * 
     * Display name for user
     * Stored in user_metadata
     * 
     * VALIDATION:
     * ✅ "John Doe"
     * ✅ "A" (min 2 chars)
     * ✅ undefined (optional)
     * ❌ "x".repeat(51) (max 50)
     * ❌ "J" (less than 2)
     * 
     * TRIM:
     * Remove leading/trailing spaces
     * "  John  " → "John"
     */
    name: z
      .string()
      .min(2, 'Nama minimal 2 karakter')
      .max(50, 'Nama maksimal 50 karakter')
      .trim()
      .optional(),
  })
  /**
   * REFINE - Custom validation
   * 
   * .refine() untuk validasi yang tidak bisa dilakukan dengan basic validators
   * 
   * PARAMETER:
   * 1. Validation function: (data) => boolean
   * 2. Error config: { message, path }
   * 
   * CARA KERJA:
   * 1. Semua field validations pass
   * 2. Run .refine() function
   * 3. Return true → Valid
   * 4. Return false → Invalid (throw error with message)
   * 
   * PASSWORD MATCH VALIDATION:
   * data.password === data.confirmPassword
   * 
   * ERROR PATH:
   * path: ['confirmPassword']
   * Error akan muncul di field confirmPassword
   * 
   * USE CASE:
   * - Password match
   * - Custom business rules
   * - Cross-field validation
   * - Conditional validation
   * 
   * CONTOH LAIN:
   * .refine((data) => {
   *   // Age must be 18+ if role is 'admin'
   *   if (data.role === 'admin') {
   *     return data.age >= 18
   *   }
   *   return true
   * }, {
   *   message: 'Admin harus berusia minimal 18 tahun',
   *   path: ['age']
   * })
   */
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'], // Error shows on confirmPassword field
  })

/**
 * FORGOT PASSWORD SCHEMA
 * 
 * Validasi untuk request password reset
 * Hanya perlu email
 * 
 * USAGE:
 * User forgot password → Enter email → Send reset link
 */
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid')
    .toLowerCase(),
})

/**
 * RESET PASSWORD SCHEMA
 * 
 * Validasi untuk set new password
 * After user clicks reset link
 * 
 * FIELDS:
 * - password: New password
 * - confirmPassword: Confirm new password
 * 
 * USAGE:
 * User clicks reset link → Enter new password → Reset
 */
export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, 'Password minimal 6 karakter')
      .max(50, 'Password maksimal 50 karakter'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  })

/**
 * UPDATE EMAIL SCHEMA
 * 
 * Validasi untuk change email
 * 
 * FIELDS:
 * - newEmail: New email address
 * - password: Current password (for verification)
 * 
 * SECURITY:
 * Require password untuk change email
 * Prevent unauthorized email changes
 */
export const UpdateEmailSchema = z.object({
  newEmail: z
    .string()
    .min(1, 'Email baru wajib diisi')
    .email('Format email tidak valid')
    .toLowerCase(),
  password: z.string().min(1, 'Password wajib diisi untuk verifikasi'),
})

/**
 * UPDATE PASSWORD SCHEMA
 * 
 * Validasi untuk change password
 * 
 * FIELDS:
 * - currentPassword: Current password
 * - newPassword: New password
 * - confirmNewPassword: Confirm new password
 * 
 * VALIDATION:
 * - Current password required
 * - New password meets requirements
 * - New password != current password
 * - Confirmation matches
 */
export const UpdatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
    newPassword: z
      .string()
      .min(6, 'Password baru minimal 6 karakter')
      .max(50, 'Password baru maksimal 50 karakter'),
    confirmNewPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Password baru tidak cocok',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Password baru harus berbeda dengan password saat ini',
    path: ['newPassword'],
  })

// ==================
// TYPE EXPORTS
// ==================

/**
 * Inferred TypeScript Types
 * 
 * Auto-generated types dari schemas
 * Single source of truth
 */

export type LoginInput = z.infer<typeof LoginSchema>
export type RegisterInput = z.infer<typeof RegisterSchema>
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>
export type UpdateEmailInput = z.infer<typeof UpdateEmailSchema>
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>

/**
 * USAGE EXAMPLES
 * 
 * // Example 1: Client-side validation (React Hook Form)
 * import { useForm } from 'react-hook-form'
 * import { zodResolver } from '@hookform/resolvers/zod'
 * 
 * function LoginForm() {
 *   const form = useForm<LoginInput>({
 *     resolver: zodResolver(LoginSchema),
 *     defaultValues: {
 *       email: '',
 *       password: ''
 *     }
 *   })
 * 
 *   async function onSubmit(data: LoginInput) {
 *     // data is validated & typed!
 *     const { email, password } = data
 *   }
 * }
 * 
 * // Example 2: Server-side validation (Server Action)
 * 'use server'
 * 
 * export async function loginAction(formData: FormData) {
 *   const rawData = {
 *     email: formData.get('email'),
 *     password: formData.get('password')
 *   }
 * 
 *   // Validate
 *   const result = LoginSchema.safeParse(rawData)
 * 
 *   if (!result.success) {
 *     return { error: result.error.errors[0].message }
 *   }
 * 
 *   // result.data is typed & validated
 *   const { email, password } = result.data
 * 
 *   // Proceed with authentication
 *   const { error } = await supabase.auth.signInWithPassword({
 *     email,
 *     password
 *   })
 * 
 *   if (error) return { error: error.message }
 * 
 *   return { success: true }
 * }
 * 
 * // Example 3: Manual validation
 * const data = {
 *   email: 'User@Example.COM',  // Will be lowercased
 *   password: 'mypassword'
 * }
 * 
 * const result = LoginSchema.safeParse(data)
 * 
 * if (result.success) {
 *   console.log(result.data.email) // "user@example.com"
 * } else {
 *   console.log(result.error.errors) // Array of validation errors
 * }
 * 
 * // Example 4: Error handling
 * const result = RegisterSchema.safeParse({
 *   email: 'invalid-email',
 *   password: '123',
 *   confirmPassword: '456'
 * })
 * 
 * if (!result.success) {
 *   result.error.errors.forEach(err => {
 *     console.log(err.path)    // ['email'] or ['password']
 *     console.log(err.message) // "Format email tidak valid"
 *   })
 * }
 */
