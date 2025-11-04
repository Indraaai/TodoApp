import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

/**
 * Supabase Browser Client
 *
 * FUNGSI:
 * Client ini digunakan untuk berinteraksi dengan Supabase dari sisi browser/client.
 *
 * KAPAN DIGUNAKAN:
 * - Di Client Components (yang ada 'use client' di atas)
 * - Untuk authentication (login, register, logout)
 * - Untuk real-time subscriptions
 * - Untuk operasi yang butuh user interaction
 *
 * CARA KERJA:
 * 1. createBrowserClient() membuat instance Supabase khusus browser
 * 2. Menggunakan NEXT_PUBLIC_* environment variables (bisa diakses di client)
 * 3. Session disimpan di browser cookies
 * 4. Otomatis handle authentication state
 *
 * TYPE SAFETY:
 * <Database> = Generic type untuk type-safe queries
 * Semua operasi database akan punya autocomplete dan type checking
 *
 * CONTOH PENGGUNAAN:
 *
 * import { createClient } from '@/lib/supabase/client'
 *
 * function LoginComponent() {
 *   const supabase = createClient()
 *
 *   async function handleLogin() {
 *     const { data, error } = await supabase.auth.signInWithPassword({
 *       email: 'userexample.com',
 *       password: 'password123'
 *     })
 *   }
 *   
 *   // Type-safe query
 *   async function getTodos() {
 *     const { data } = await supabase.from('todos').select('*')
 *     // data: Todo[] | null (dengan autocomplete!)
 *   }
 * }
 *
 * PENTING:
 * - Jangan gunakan di Server Components!
 * - Untuk server, gunakan lib/supabase/server.ts
 */
export function createClient(){
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

export async function loginUser(email: string, password: string) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login failed:', error.message);
        throw new Error(error.message);
    }

    console.log('Login successful:', data);
    return data;
}

// Tambahkan ekspor untuk fungsi getTodos dan createTodo
export async function getTodos() {
    const supabase = createClient();

    const { data, error } = await supabase.from('todos').select('*');

    if (error) {
        console.error('Error fetching todos:', error.message);
        throw new Error(error.message);
    }

    return data;
}

export async function createTodo(todo: {
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    due_date?: string;
}) {
    const supabase = createClient();

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be authenticated to create a todo');
    }

    // Filter out empty or invalid due_date
    const todoData = {
        ...todo,
        user_id: user.id,
        due_date: todo.due_date ? todo.due_date : null, // Set to null if empty
    };

    const { data, error } = await supabase.from('todos').insert(todoData);

    if (error) {
        console.error('Error creating todo:', error.message);
        throw new Error(error.message);
    }

    return data;
}

export async function deleteTodo(id: string) {
    const supabase = createClient();

    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
        console.error('Error deleting todo:', error.message);
        throw new Error(error.message);
    }

    return { success: true };
}

export async function toggleTodoComplete(id: string, completed: boolean) {
    const supabase = createClient();

    const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id);

    if (error) {
        console.error('Error updating todo:', error.message);
        throw new Error(error.message);
    }

    return { success: true };
}
