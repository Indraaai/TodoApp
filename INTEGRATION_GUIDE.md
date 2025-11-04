# 📚 Panduan Integrasi TodoApp - Next.js Ecosystem

> **Dokumentasi lengkap** untuk mengintegrasikan Zod, TanStack Query, Zustand, Supabase, dan shadcn/ui

---

## 📑 Daftar Isi

1. [Gambaran Umum Project](#gambaran-umum-project)
2. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
3. [Fase 1: Setup Dependencies](#fase-1-setup-dependencies)
4. [Fase 2: Setup Supabase](#fase-2-setup-supabase)
5. [Fase 3: Setup State Management](#fase-3-setup-state-management)
6. [Fase 4: Setup Validation](#fase-4-setup-validation)
7. [Fase 5: Build UI Components](#fase-5-build-ui-components)
8. [Testing & Debugging](#testing--debugging)

---

## 🎯 Gambaran Umum Project

### Struktur Folder Saat Ini

```
todoapp/
├── app/
│   ├── (auth)/          # Route group untuk authentication
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/     # Route group untuk protected pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── todos/
│   ├── api/             # API routes
│   │   └── webhook/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/            # Authentication components
│   ├── todos/           # Todo-related components
│   └── ui/              # shadcn/ui components (akan diisi)
├── lib/
│   ├── actions/         # Server actions
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Business logic & utilities
│   └── supabase/        # Supabase configuration
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

### Penjelasan Struktur:

- **Route Groups `(auth)` & `(dashboard)`**: Mengelompokkan routes tanpa mempengaruhi URL
- **Server Actions**: Functions yang berjalan di server untuk data mutations
- **Hooks**: Custom hooks untuk logic reusability
- **Services**: Utility functions dan business logic

---

## 🛠️ Teknologi yang Digunakan

### 1. **Zod** - Schema Validation

**Fungsi**: Validasi data di TypeScript

```typescript
// Contoh: Memvalidasi input form
const TodoSchema = z.object({
  title: z.string().min(1, "Title tidak boleh kosong"),
  completed: z.boolean().default(false),
});
```

**Kenapa Zod?**

- Type-safe validation
- Otomatis generate TypeScript types
- Error messages yang jelas

### 2. **TanStack Query (React Query)** - Data Fetching & Caching

**Fungsi**: Mengelola server state, caching, dan synchronization

```typescript
// Contoh: Fetch todos dengan automatic caching
const { data, isLoading } = useQuery({
  queryKey: ["todos"],
  queryFn: fetchTodos,
});
```

**Kenapa TanStack Query?**

- Automatic caching & background updates
- Loading & error states built-in
- Optimistic updates untuk UX yang lebih baik

### 3. **Zustand** - State Management

**Fungsi**: Mengelola client state (UI state, temporary data)

```typescript
// Contoh: Store untuk UI state
const useUIStore = create((set) => ({
  sidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
}));
```

**Kenapa Zustand?**

- Simple & minimal boilerplate
- Tidak perlu Provider wrapper
- TypeScript support yang bagus

### 4. **Supabase** - Backend as a Service

**Fungsi**: Database, Authentication, Real-time subscriptions

```typescript
// Contoh: Query database
const { data } = await supabase.from("todos").select("*").eq("user_id", userId);
```

**Kenapa Supabase?**

- PostgreSQL database yang powerful
- Built-in authentication
- Real-time subscriptions
- Free tier yang generous

### 5. **shadcn/ui** - UI Components

**Fungsi**: Komponen UI yang customizable dan accessible

```typescript
// Contoh: Button component
<Button variant="default" size="lg">
  Add Todo
</Button>
```

**Kenapa shadcn/ui?**

- Bukan library, tapi component source code
- Fully customizable
- Built dengan Radix UI (accessible)
- Tailwind CSS styling

---

## 📦 Fase 1: Setup Dependencies

### Step 1.1: Install Core Dependencies

**Command:**

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install zustand
npm install zod
npm install @hookform/resolvers react-hook-form
```

**Penjelasan setiap package:**

1. **@supabase/supabase-js** (Core library)

   - Library utama untuk berinteraksi dengan Supabase
   - Menyediakan client untuk auth, database, storage

2. **@supabase/ssr** (Server-Side Rendering support)

   - Khusus untuk Next.js App Router
   - Menangani cookies dan session di server components

3. **@tanstack/react-query** (Data fetching library)

   - Mengelola server state
   - Automatic refetching dan caching

4. **@tanstack/react-query-devtools** (Development tools)

   - Developer tools untuk debugging queries
   - Hanya untuk development

5. **zustand** (State management)

   - Lightweight state management
   - Untuk UI state dan temporary data

6. **zod** (Validation library)

   - Schema-based validation
   - TypeScript-first

7. **@hookform/resolvers** (Form validation resolver)

   - Menghubungkan Zod dengan React Hook Form
   - Automatic validation

8. **react-hook-form** (Form library)
   - Performant form handling
   - Minimal re-renders

### Step 1.2: Install shadcn/ui CLI

**Command:**

```bash
npx shadcn@latest init
```

**Pilihan saat setup:**

- TypeScript: Yes
- Style: Default
- Base color: Slate (atau pilihan Anda)
- CSS variables: Yes

**Yang terjadi:**

- Membuat `components.json` (konfigurasi shadcn)
- Setup Tailwind config
- Membuat `lib/utils.ts` (utility functions)
- Membuat folder `components/ui/`

**File yang dibuat/dimodifikasi:**

```
components.json          # Konfigurasi shadcn
tailwind.config.ts       # Update config untuk shadcn
lib/utils.ts            # cn() utility untuk className merging
```

### Step 1.3: Install shadcn/ui Components

**Command:**

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add checkbox
npx shadcn@latest add form
npx shadcn@latest add toast
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

**Penjelasan:**

- Setiap component diinstall sebagai source code
- Anda bisa edit component sesuai kebutuhan
- Components otomatis masuk ke `components/ui/`

**Component yang diinstall:**

- **button**: Tombol dengan berbagai variant
- **input**: Text input field
- **label**: Label untuk form fields
- **card**: Container untuk konten
- **checkbox**: Checkbox untuk completed todos
- **form**: Form wrapper dengan validation
- **toast**: Notification messages
- **dialog**: Modal dialogs
- **dropdown-menu**: Dropdown untuk actions

---

## ⚙️ Fase 2: Setup Supabase

### Step 2.1: Create Supabase Project

**Langkah-langkah:**

1. Buka [supabase.com](https://supabase.com)
2. Sign up / Login
3. Create New Project
4. Simpan:
   - Project URL: `https://xxxxx.supabase.co`
   - API Key (anon/public): `eyJxxx...`
   - Database Password (untuk migration)

### Step 2.2: Setup Environment Variables

**File:** `.env.local`

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: untuk development
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**⚠️ PENTING:**

- File `.env.local` TIDAK boleh di-commit ke Git
- Tambahkan ke `.gitignore`
- Untuk production, set di environment variables hosting

**Penjelasan variabel:**

- `NEXT_PUBLIC_*`: Dapat diakses di client-side
- `SUPABASE_URL`: Endpoint API Supabase Anda
- `ANON_KEY`: Public key untuk client-side calls
- `SERVICE_ROLE_KEY`: Admin key (hanya untuk server-side)

### Step 2.3: Create Database Schema

**File:** `supabase/migrations/001_create_todos_table.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create todos table
CREATE TABLE todos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_completed ON todos(completed);

-- Enable Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see their own todos
CREATE POLICY "Users can view own todos"
  ON todos FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own todos
CREATE POLICY "Users can insert own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own todos
CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own todos
CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Penjelasan Schema:**

1. **UUID Extension**: Untuk auto-generate IDs yang unik
2. **todos table**: Table utama untuk menyimpan todos
3. **user_id**: Foreign key ke auth.users (user yang membuat todo)
4. **Indexes**: Mempercepat query berdasarkan user_id dan completed
5. **Row Level Security (RLS)**: Security di database level
6. **Policies**: Aturan akses data (user hanya bisa akses todo mereka)
7. **Trigger**: Otomatis update timestamp saat data berubah

**Cara run migration:**

1. Copy SQL di atas
2. Buka Supabase Dashboard > SQL Editor
3. Paste dan Run

### Step 2.4: Setup Supabase Client

**File:** `lib/supabase/client.ts`

```typescript
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";

/**
 * Supabase Browser Client
 *
 * Digunakan di Client Components untuk:
 * - Authentication (login, register, logout)
 * - Real-time subscriptions
 * - Client-side queries
 *
 * PENTING: Hanya gunakan di Client Components (yang ada 'use client')
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Penjelasan:**

- `createBrowserClient`: Khusus untuk browser/client-side
- `Database`: Type definitions untuk schema (auto-generated)
- Menggunakan environment variables yang di-prefix `NEXT_PUBLIC_`

**File:** `lib/supabase/server.ts`

```typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";

/**
 * Supabase Server Client
 *
 * Digunakan di Server Components dan Server Actions untuk:
 * - Fetch data di server-side
 * - Server actions (mutations)
 * - API routes
 *
 * PENTING: Hanya gunakan di Server Components/Actions
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie setting errors (biasanya di middleware)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Handle cookie removal errors
          }
        },
      },
    }
  );
}
```

**Penjelasan:**

- `createServerClient`: Khusus untuk server-side
- `cookies()`: Next.js function untuk access cookies
- Menangani session via cookies (lebih secure untuk SSR)

**File:** `lib/supabase/middleware.ts`

```typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware untuk Supabase Authentication
 *
 * Fungsi:
 * 1. Refresh session otomatis
 * 2. Protect routes yang memerlukan authentication
 * 3. Redirect unauthorized users
 *
 * Berjalan di setiap request sebelum masuk ke page
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Refresh session jika diperlukan
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard routes
  if (!user && request.nextUrl.pathname.startsWith("/todos")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users dari login/register
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/todos", request.url));
  }

  return response;
}
```

**Penjelasan:**

- Berjalan di **setiap request**
- Refresh auth session secara otomatis
- Protect routes berdasarkan authentication status
- Redirect logic untuk UX yang lebih baik

**File:** `middleware.ts` (root project)

```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js Middleware
 *
 * Entry point untuk semua middleware logic
 * Saat ini hanya handle Supabase session management
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

/**
 * Matcher Configuration
 *
 * Tentukan route mana yang akan di-process oleh middleware
 * Exclude: _next/static, _next/image, favicon.ico, dll
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

**Penjelasan:**

- File ini HARUS di root project
- `matcher`: Regex untuk filter route yang diproses middleware
- Exclude static files untuk performance

### Step 2.5: Generate TypeScript Types

**Command (di Supabase CLI):**

```bash
npx supabase gen types typescript --project-id your-project-id > types/database.types.ts
```

**Atau manual:** `types/database.types.ts`

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          completed: boolean;
          priority: "low" | "medium" | "high";
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          completed?: boolean;
          priority?: "low" | "medium" | "high";
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          completed?: boolean;
          priority?: "low" | "medium" | "high";
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
```

**Penjelasan:**

- **Row**: Type untuk data yang dibaca dari database
- **Insert**: Type untuk insert new rows (optional fields)
- **Update**: Type untuk update rows (semua fields optional)
- Memberikan type safety untuk semua database operations

---

## 🗄️ Fase 3: Setup State Management

### Step 3.1: Setup TanStack Query Provider

**File:** `lib/providers/query-provider.tsx`

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * TanStack Query Provider
 *
 * Wrapper untuk menyediakan QueryClient ke seluruh aplikasi
 *
 * Konfigurasi:
 * - staleTime: Berapa lama data dianggap "fresh" (5 menit)
 * - gcTime: Berapa lama cache disimpan sebelum dihapus (10 menit)
 * - refetchOnWindowFocus: Auto refetch saat user kembali ke tab
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data dianggap fresh selama 5 menit
            staleTime: 5 * 60 * 1000,
            // Cache disimpan selama 10 menit
            gcTime: 10 * 60 * 1000,
            // Refetch saat window focus
            refetchOnWindowFocus: true,
            // Retry failed requests 1x
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Penjelasan konsep:**

1. **staleTime**: Waktu sebelum data dianggap "basi"

   - Jika data masih fresh, tidak akan refetch
   - Mengurangi network requests

2. **gcTime** (garbage collection time): Waktu cache disimpan

   - Setelah ini, data dihapus dari memory
   - Biasanya lebih lama dari staleTime

3. **refetchOnWindowFocus**: Auto refresh data

   - Saat user kembali ke tab/window
   - Ensures data selalu up-to-date

4. **ReactQueryDevtools**: Developer tools
   - Lihat semua queries dan status
   - Debug cache dan network requests

**Update:** `app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TodoApp - Manage Your Tasks",
  description: "A modern todo application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <main className="container mx-auto px-4 py-8">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
```

**Penjelasan:**

- Wrap children dengan `QueryProvider`
- Sekarang semua components punya akses ke QueryClient
- Provider harus di Client Component ('use client')

### Step 3.2: Setup Zustand Stores

**File:** `lib/stores/ui-store.ts`

```typescript
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

/**
 * UI Store - State Management untuk UI
 *
 * Digunakan untuk:
 * - Sidebar state (open/close)
 * - Modal state
 * - Theme preferences
 * - Temporary UI state
 *
 * Kenapa Zustand untuk UI state?
 * - Tidak perlu Provider wrapper
 * - Simple API
 * - Tidak trigger unnecessary re-renders
 */

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Filter state
  filterCompleted: "all" | "active" | "completed";
  setFilterCompleted: (filter: "all" | "active" | "completed") => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        sidebarOpen: true,
        filterCompleted: "all",
        searchQuery: "",

        // Actions
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        toggleSidebar: () =>
          set((state) => ({
            sidebarOpen: !state.sidebarOpen,
          })),

        setFilterCompleted: (filter) => set({ filterCompleted: filter }),
        setSearchQuery: (query) => set({ searchQuery: query }),
      }),
      {
        name: "ui-store", // Key di localStorage
        // Hanya persist beberapa state
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          filterCompleted: state.filterCompleted,
        }),
      }
    ),
    { name: "UIStore" } // Nama di Redux DevTools
  )
);
```

**Penjelasan middleware:**

1. **devtools**: Redux DevTools integration

   - Debug state changes
   - Time-travel debugging

2. **persist**: Save state ke localStorage
   - State bertahan setelah refresh
   - `partialize`: Pilih state mana yang disimpan

**Kapan pakai Zustand vs TanStack Query?**

| Zustand             | TanStack Query   |
| ------------------- | ---------------- |
| UI State            | Server State     |
| Sidebar open/close  | Todos data       |
| Filter selections   | User profile     |
| Theme preferences   | API responses    |
| Temporary form data | Database queries |

**File:** `lib/stores/auth-store.ts`

```typescript
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "@supabase/supabase-js";

/**
 * Auth Store - State Management untuk Authentication
 *
 * Menyimpan:
 * - Current user
 * - Loading states
 * - Auth errors
 *
 * NOTE: Ini optional, karena Supabase sudah handle auth state
 * Tapi berguna untuk centralized auth logic
 */

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      loading: true,

      setUser: (user) => set({ user, loading: false }),
      setLoading: (loading) => set({ loading }),
    }),
    { name: "AuthStore" }
  )
);
```

---

## ✅ Fase 4: Setup Validation dengan Zod

### Step 4.1: Create Zod Schemas

**File:** `lib/schemas/todo-schema.ts`

```typescript
import { z } from "zod";

/**
 * Zod Schema untuk Todo
 *
 * Benefits:
 * 1. Type-safe validation
 * 2. Auto-generate TypeScript types
 * 3. Reusable di client dan server
 * 4. Custom error messages
 */

export const TodoSchema = z.object({
  id: z.string().uuid().optional(),
  title: z
    .string()
    .min(1, "Judul tidak boleh kosong")
    .max(100, "Judul maksimal 100 karakter"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional()
    .nullable(),
  completed: z.boolean().default(false),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  due_date: z.string().datetime().optional().nullable(),
  user_id: z.string().uuid().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

/**
 * Schema untuk Create Todo (client-side form)
 * Hanya fields yang user isi
 */
export const CreateTodoSchema = TodoSchema.pick({
  title: true,
  description: true,
  priority: true,
  due_date: true,
});

/**
 * Schema untuk Update Todo
 * Semua fields optional kecuali yang diupdate
 */
export const UpdateTodoSchema = TodoSchema.pick({
  title: true,
  description: true,
  completed: true,
  priority: true,
  due_date: true,
}).partial();

// Export TypeScript types dari schemas
export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodo = z.infer<typeof CreateTodoSchema>;
export type UpdateTodo = z.infer<typeof UpdateTodoSchema>;
```

**Penjelasan Zod methods:**

1. **z.string()**: Validasi string

   - `.min()`: Minimum length
   - `.max()`: Maximum length
   - Custom error messages sebagai parameter kedua

2. **z.enum()**: Validasi pilihan tertentu

   - Hanya accept nilai yang didefinisikan

3. **z.boolean()**: Validasi boolean

   - `.default()`: Nilai default jika tidak ada

4. **z.uuid()**: Validasi format UUID

5. **z.datetime()**: Validasi ISO datetime string

6. **Schema composition:**

   - `.pick()`: Ambil beberapa fields
   - `.omit()`: Exclude beberapa fields
   - `.partial()`: Buat semua fields optional

7. **z.infer<>**: Generate TypeScript type dari schema

**File:** `lib/schemas/auth-schema.ts`

```typescript
import { z } from "zod";

/**
 * Zod Schema untuk Authentication
 */

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid"),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(50, "Password maksimal 50 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
    name: z
      .string()
      .min(2, "Nama minimal 2 karakter")
      .max(50, "Nama maksimal 50 karakter")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"], // Error akan muncul di field confirmPassword
  });

// Export types
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
```

**Penjelasan:**

- **refine()**: Custom validation logic
- Validasi password match di schema level
- Error path menentukan di field mana error muncul

---

## 🎨 Fase 5: Build UI Components

### Step 5.1: Setup Toaster (Notifications)

**File:** `components/ui/toaster.tsx` (auto-generated oleh shadcn)

**File:** `lib/hooks/use-toast.ts` (auto-generated oleh shadcn)

**Update:** `app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";

// ... fonts config ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <main className="container mx-auto px-4 py-8">{children}</main>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
```

**Penjelasan:**

- `Toaster` component untuk menampilkan toast notifications
- Letakkan di layout agar available di semua pages
- Digunakan untuk success/error messages

### Step 5.2: Create Auth Components

**File:** `components/auth/login-form.tsx`

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginInput } from "@/lib/schemas/auth-schema";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Login Form Component
 *
 * Features:
 * - Form validation dengan Zod
 * - Error handling
 * - Loading states
 * - Toast notifications
 */
export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  // Setup form dengan React Hook Form + Zod
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  async function onSubmit(data: LoginInput) {
    try {
      setIsLoading(true);

      // Supabase login
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Login Gagal",
          description: error.message,
        });
        return;
      }

      // Success
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali!",
      });

      // Redirect ke dashboard
      router.push("/todos");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Masukkan email dan password Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="nama@example.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

**Penjelasan component:**

1. **useForm**: React Hook Form setup

   - `resolver`: Zod validation
   - `defaultValues`: Initial form values
   - Type-safe dengan TypeScript

2. **FormField**: Wrapper untuk input fields

   - Automatic error handling
   - Controlled components
   - Validation on blur/change

3. **Error Handling**:

   - Zod validation errors: Otomatis tampil di FormMessage
   - Supabase errors: Ditampilkan via toast
   - Loading states: Disable form saat submit

4. **Router**:
   - `router.push()`: Navigate ke page lain
   - `router.refresh()`: Refresh server components

### Step 5.3: Create Todo Components

**File:** `lib/hooks/use-todos.ts`

```typescript
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/hooks/use-toast";
import type { Todo, CreateTodo, UpdateTodo } from "@/lib/schemas/todo-schema";

/**
 * Custom Hook untuk Todo Operations
 *
 * Menggunakan TanStack Query untuk:
 * - Fetching todos
 * - Creating todos
 * - Updating todos
 * - Deleting todos
 *
 * Benefits:
 * - Automatic caching
 * - Optimistic updates
 * - Error handling
 * - Loading states
 */

// Fetch todos
export function useTodos() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Todo[];
    },
  });
}

// Create todo
export function useCreateTodo() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newTodo: CreateTodo) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      const { data, error } = await supabase
        .from("todos")
        .insert({
          ...newTodo,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Todo;
    },
    onSuccess: () => {
      // Invalidate queries untuk refetch data
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Berhasil",
        description: "Todo berhasil ditambahkan",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
}

// Update todo
export function useUpdateTodo() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateTodo;
    }) => {
      const { data, error } = await supabase
        .from("todos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Todo;
    },
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot current value
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      // Optimistically update cache
      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(
          ["todos"],
          previousTodos.map((todo) =>
            todo.id === id ? { ...todo, ...updates } : todo
          )
        );
      }

      return { previousTodos };
    },
    onError: (error, variables, context) => {
      // Rollback pada error
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

// Delete todo
export function useDeleteTodo() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Berhasil",
        description: "Todo berhasil dihapus",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
}
```

**Penjelasan TanStack Query concepts:**

1. **useQuery**: Untuk fetching data

   - `queryKey`: Unique identifier untuk cache
   - `queryFn`: Function untuk fetch data
   - Auto refetch on mount, window focus, etc.

2. **useMutation**: Untuk data mutations (create, update, delete)

   - `mutationFn`: Function untuk mutate data
   - `onSuccess`: Callback setelah berhasil
   - `onError`: Callback saat error
   - `onMutate`: Callback sebelum mutation (untuk optimistic updates)

3. **Optimistic Updates**: Update UI sebelum server response

   - `onMutate`: Update cache immediately
   - `onError`: Rollback jika gagal
   - `onSettled`: Refetch untuk sync dengan server

4. **queryClient.invalidateQueries()**: Trigger refetch
   - Setelah mutation berhasil
   - Ensures data tetap sync dengan server

**File:** `components/todos/todo-list.tsx`

```typescript
"use client";

import { useTodos, useUpdateTodo, useDeleteTodo } from "@/lib/hooks/use-todos";
import { useUIStore } from "@/lib/stores/ui-store";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

/**
 * Todo List Component
 *
 * Features:
 * - Display todos
 * - Toggle completed status
 * - Delete todos
 * - Filter by status
 * - Search functionality
 */
export function TodoList() {
  const { data: todos, isLoading, error } = useTodos();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  const { filterCompleted, searchQuery } = useUIStore();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">Error: {error.message}</div>
    );
  }

  // Filter todos
  const filteredTodos = todos?.filter((todo) => {
    // Filter by completed status
    if (filterCompleted === "active" && todo.completed) return false;
    if (filterCompleted === "completed" && !todo.completed) return false;

    // Filter by search query
    if (
      searchQuery &&
      !todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  if (!filteredTodos || filteredTodos.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Tidak ada todo
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredTodos.map((todo) => (
        <Card key={todo.id}>
          <CardContent className="flex items-center gap-4 p-4">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={(checked) => {
                updateTodo.mutate({
                  id: todo.id,
                  updates: { completed: checked as boolean },
                });
              }}
            />
            <div className="flex-1">
              <h3
                className={`font-medium ${
                  todo.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {todo.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo.mutate(todo.id)}
              disabled={deleteTodo.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

**Penjelasan:**

- Menggunakan custom hooks untuk data management
- Zustand store untuk filter state
- Optimistic updates untuk UX yang smooth
- Loading dan error states

---

## 🧪 Testing & Debugging

### Development Tools

1. **TanStack Query Devtools**

   - Buka browser
   - Icon "React Query" di bottom-left
   - Lihat semua queries, cache, dan network requests

2. **Zustand DevTools**

   - Install Redux DevTools browser extension
   - Lihat state changes di "Redux" tab

3. **Supabase Dashboard**
   - Real-time data viewer
   - Query logs
   - Authentication logs

### Common Issues & Solutions

**Issue 1: "User already registered"**

- Solution: Check Supabase > Authentication > Users
- Delete duplicate users jika ada

**Issue 2: RLS Policy Error**

- Solution: Check policies di SQL Editor
- Ensure user_id match dengan auth.uid()

**Issue 3: CORS Errors**

- Solution: Check Supabase project URL
- Ensure environment variables benar

**Issue 4: Middleware redirect loop**

- Solution: Check matcher config
- Ensure proper route protection logic

---

## 📝 Checklist Setup

- [ ] Install dependencies (npm install)
- [ ] Setup .env.local dengan Supabase credentials
- [ ] Run database migration (SQL)
- [ ] Setup shadcn/ui (npx shadcn init)
- [ ] Install shadcn components
- [ ] Create Supabase clients (client, server, middleware)
- [ ] Setup middleware.ts
- [ ] Create Zod schemas
- [ ] Setup TanStack Query provider
- [ ] Create Zustand stores
- [ ] Build authentication components
- [ ] Build todo components
- [ ] Test authentication flow
- [ ] Test todo CRUD operations

---

## 🎓 Konsep Penting untuk Dipahami

### 1. Server vs Client Components (Next.js App Router)

**Server Components** (default):

```typescript
// Tidak ada 'use client'
async function TodosPage() {
  const supabase = createServerClient(); // Server-side
  const { data } = await supabase.from("todos").select();
  return <div>{data}</div>;
}
```

**Client Components**:

```typescript
"use client"; // Required directive
function TodoForm() {
  const [value, setValue] = useState("");
  // Can use hooks, event handlers, browser APIs
}
```

**Kapan pakai apa?**

- Server: Data fetching, static content, SEO
- Client: Interactivity, hooks, browser APIs

### 2. Data Flow Architecture

```
User Action (Client)
    ↓
TanStack Query Mutation
    ↓
Supabase Client
    ↓
Database (dengan RLS)
    ↓
TanStack Query Cache Update
    ↓
UI Re-render
```

### 3. Authentication Flow

```
Login Form
    ↓
Supabase Auth (signInWithPassword)
    ↓
Session stored in Cookies
    ↓
Middleware checks session
    ↓
Protected routes accessible
```

### 4. State Management Strategy

| Type         | Tool            | Example                    |
| ------------ | --------------- | -------------------------- |
| Server State | TanStack Query  | Todos data, User profile   |
| Client State | Zustand         | UI state, Filters, Search  |
| Form State   | React Hook Form | Form inputs, Validation    |
| URL State    | Next.js Router  | Page params, Query strings |

---

## 🚀 Next Steps

Setelah setup selesai:

1. **Tambah features**:

   - Todo categories/tags
   - Due date reminders
   - Collaboration (share todos)

2. **Optimizations**:

   - Implement pagination
   - Add real-time subscriptions
   - Optimize bundle size

3. **Testing**:

   - Unit tests (Vitest)
   - E2E tests (Playwright)
   - Integration tests

4. **Deployment**:
   - Deploy ke Vercel
   - Setup CI/CD
   - Monitor performance

---

## 📚 Resources & Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Zod Docs](https://zod.dev)
- [shadcn/ui Docs](https://ui.shadcn.com)

---

**Happy Coding! 🎉**
