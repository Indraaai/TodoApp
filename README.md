# 📝 TodoApp - Modern Task Management Application

> Aplikasi manajemen tugas yang dibangun dengan Next.js 16, Supabase, dan teknologi modern lainnya.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8)](https://tailwindcss.com/)

---

## 📑 Daftar Isi

- [Tentang Aplikasi](#-tentang-aplikasi)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Fitur Utama](#-fitur-utama)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Folder](#-struktur-folder)
- [Cara Menggunakan](#-cara-menggunakan)
- [API Endpoints](#-api-endpoints)
- [State Management](#-state-management)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Tentang Aplikasi

TodoApp adalah aplikasi manajemen tugas modern yang memungkinkan pengguna untuk:

- Membuat, membaca, memperbarui, dan menghapus tugas (CRUD)
- Autentikasi pengguna dengan Supabase Auth
- Menandai tugas sebagai selesai/belum selesai
- Interface yang responsif dan user-friendly
- Real-time updates dengan Supabase

Aplikasi ini dibangun dengan prinsip **type-safety**, **scalability**, dan **best practices** dalam pengembangan web modern.

---

## 🛠️ Teknologi yang Digunakan

### Core Framework

- **Next.js 16** - React framework dengan App Router
- **React 19** - Library UI terbaru
- **TypeScript** - Type safety dan better DX

### Backend & Database

- **Supabase** - Backend-as-a-Service (Authentication, Database, Storage)
- **PostgreSQL** - Database relational melalui Supabase

### State Management & Data Fetching

- **TanStack Query (React Query)** - Server state management
- **Zustand** - Client state management

### Form & Validation

- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Styling & UI

- **TailwindCSS 4** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **class-variance-authority** - CVA untuk variant components

### Developer Tools

- **React Compiler** - Optimasi performance
- **TanStack Query DevTools** - Debugging tool

---

## ✨ Fitur Utama

### 🔐 Authentication

- ✅ Register dengan email & password
- ✅ Login & Logout
- ✅ Session management dengan cookies
- ✅ Protected routes dengan middleware
- ✅ Persistent authentication state

### 📝 Todo Management

- ✅ Tambah todo baru
- ✅ Edit todo yang ada
- ✅ Hapus todo
- ✅ Toggle status (completed/incomplete)
- ✅ Real-time updates
- ✅ Filtering & sorting

### 🎨 UI/UX

- ✅ Responsive design (mobile-first)
- ✅ Dark mode support
- ✅ Loading states & error handling
- ✅ Toast notifications
- ✅ Smooth animations
- ✅ Accessible components (a11y)

---

## 🏗️ Arsitektur Sistem

### Alur Data Application

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                   │
│  │  Components  │─────▶│    Hooks     │                   │
│  │   (UI Layer) │      │ (useTodos)   │                   │
│  └──────────────┘      └──────────────┘                   │
│         │                      │                           │
│         │                      ▼                           │
│         │              ┌──────────────┐                   │
│         └─────────────▶│ TanStack     │                   │
│                        │ Query        │                   │
│                        └──────────────┘                   │
│                                │                           │
│                                ▼                           │
│                        ┌──────────────┐                   │
│                        │  Zustand     │                   │
│                        │  Store       │                   │
│                        └──────────────┘                   │
│                                │                           │
└────────────────────────────────┼───────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                        ┌──────────────┐                   │
│                        │ Server       │                   │
│                        │ Actions      │                   │
│                        └──────────────┘                   │
│                                │                           │
│                                ▼                           │
│                        ┌──────────────┐                   │
│                        │  Supabase    │                   │
│                        │  Client      │                   │
│                        └──────────────┘                   │
│                                │                           │
└────────────────────────────────┼───────────────────────────┘
                                 │
                                 ▼
                         ┌──────────────┐
                         │   SUPABASE   │
                         │  (PostgreSQL)│
                         └──────────────┘
```

### Pattern yang Digunakan

1. **Server Actions Pattern** - Untuk mutasi data dari client ke server
2. **Hook Pattern** - Custom hooks untuk logic reusability
3. **Provider Pattern** - Context providers untuk global state
4. **Compound Component Pattern** - Component composition
5. **Route Group Pattern** - Next.js route organization

---

## 📦 Instalasi

### Prerequisites

Pastikan sudah terinstall:

- **Node.js** versi 18.x atau lebih tinggi
- **npm** atau **yarn** atau **pnpm**
- **Git**
- **Akun Supabase** (gratis di [supabase.com](https://supabase.com))

### Langkah Instalasi

1. **Clone Repository**

```bash
git clone https://github.com/Indraaai/TodoApp.git
cd TodoApp/todoapp
```

2. **Install Dependencies**

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

3. **Setup Environment Variables**

Buat file `.env.local` di root folder:

```bash
# Copy dari .env.example
cp .env.example .env.local
```

Isi dengan credentials Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. **Setup Database**

Jalankan migrasi database di Supabase SQL Editor:

```sql
-- File: supabase/migrations/001_create_todos_table.sql
-- Copy dan paste SQL dari file ini ke Supabase SQL Editor
```

---

## ⚙️ Konfigurasi

### Supabase Setup

1. **Buat Project di Supabase**

   - Kunjungi [supabase.com](https://supabase.com)
   - Buat project baru
   - Tunggu sampai database selesai di-provision

2. **Dapatkan API Keys**

   - Buka Settings → API
   - Copy `Project URL` → masukkan ke `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → masukkan ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Setup Authentication**

   - Buka Authentication → Settings
   - Enable Email provider
   - Configure redirect URLs:
     ```
     http://localhost:3000/auth/callback
     ```

4. **Jalankan Migrasi**
   - Buka SQL Editor di Supabase Dashboard
   - Copy SQL dari `supabase/migrations/001_create_todos_table.sql`
   - Run query

### Type Generation (Opsional)

Generate TypeScript types dari Supabase schema:

```bash
npx supabase gen types typescript --project-id "your-project-id" > types/database.types.ts
```

---

## 🚀 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build aplikasi
npm run build

# Jalankan production server
npm run start
```

### Scripts Available

```json
{
  "dev": "next dev", // Development mode dengan hot-reload
  "build": "next build", // Build untuk production
  "start": "next start" // Jalankan production build
}
```

---

## 📁 Struktur Folder

```
todoapp/
│
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group - Authentication
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── register/
│   │       └── page.tsx          # Register page
│   │
│   ├── (dashboard)/              # Route group - Dashboard (Protected)
│   │   ├── layout.tsx            # Dashboard layout dengan Navbar
│   │   ├── page.tsx              # Dashboard home
│   │   └── todos/
│   │       ├── page.tsx          # Todos page
│   │       ├── TodoForm.tsx      # Form untuk add/edit todo
│   │       └── TodoList.tsx      # List todos component
│   │
│   ├── api/                      # API Routes
│   │   ├── todos/
│   │   │   └── route.ts          # REST API untuk todos
│   │   └── webhook/
│   │       └── routes.tsx        # Webhook handlers
│   │
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/                   # React Components
│   ├── auth/                     # Auth-related components
│   ├── layout/
│   │   └── Navbar.tsx            # Navigation bar
│   ├── todos/                    # Todo-related components
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
│
├── lib/                          # Library & Utilities
│   ├── actions/                  # Server Actions
│   │   ├── auth-actions.ts       # Authentication actions
│   │   └── todo-actions.ts       # Todo CRUD actions
│   │
│   ├── hooks/                    # Custom React Hooks
│   │   ├── useAuth.ts            # Auth state management
│   │   └── useTodos.ts           # Todos data fetching
│   │
│   ├── providers/
│   │   └── query-provider.tsx    # TanStack Query Provider
│   │
│   ├── schemas/                  # Zod Validation Schemas
│   │   ├── auth-schema.ts
│   │   ├── todo-schema.ts
│   │   └── index.ts
│   │
│   ├── services/                 # Business Logic
│   │   ├── cn.ts                 # Class name utility
│   │   └── validator.ts          # Validation service
│   │
│   ├── stores/                   # Zustand Stores
│   │   ├── auth-store.ts         # Auth state
│   │   ├── ui-store.ts           # UI state
│   │   └── index.ts
│   │
│   ├── supabase/                 # Supabase Configuration
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Auth middleware
│   │
│   ├── prisma.ts                 # Prisma client (if used)
│   └── utils.ts                  # General utilities
│
├── types/                        # TypeScript Type Definitions
│   ├── database.types.ts         # Generated from Supabase
│   ├── index.ts                  # Common types
│   └── prisma.ts                 # Prisma types
│
├── supabase/                     # Supabase Configuration
│   └── migrations/
│       └── 001_create_todos_table.sql
│
├── public/                       # Static Assets
│
├── middleware.ts                 # Next.js Middleware (Auth)
├── components.json               # shadcn/ui config
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind configuration
├── postcss.config.mjs            # PostCSS configuration
├── package.json                  # Dependencies
├── INTEGRATION_GUIDE.md          # Integration documentation
└── README.md                     # This file
```

### Penjelasan Struktur

#### **App Directory** (`app/`)

- Menggunakan Next.js 16 App Router
- Route groups untuk organisasi: `(auth)`, `(dashboard)`
- Server Components by default
- Client Components ditandai dengan `"use client"`

#### **Components** (`components/`)

- Reusable UI components
- shadcn/ui components di folder `ui/`
- Feature-specific components di folder masing-masing

#### **Lib** (`lib/`)

- Core business logic dan utilities
- **actions**: Server actions untuk data mutation
- **hooks**: Custom React hooks
- **stores**: Global state dengan Zustand
- **supabase**: Supabase client configuration

#### **Types** (`types/`)

- Type definitions untuk TypeScript
- Generated types dari database schema

---

## 📖 Cara Menggunakan

### 1. Registrasi Akun

1. Buka aplikasi di browser
2. Klik tombol **"Register"** atau navigasi ke `/register`
3. Isi form registrasi:
   - Email
   - Password (minimal 6 karakter)
4. Klik **"Register"**
5. Jika berhasil, akan diarahkan ke dashboard

### 2. Login

1. Navigasi ke `/login`
2. Masukkan email dan password
3. Klik **"Login"**
4. Akan diarahkan ke dashboard

### 3. Mengelola Todos

#### Menambah Todo

1. Di halaman `/todos`, cari form **"Add Todo"**
2. Isi **Title** (wajib)
3. Isi **Description** (opsional)
4. Klik **"Add Todo"**

#### Melihat Daftar Todo

- Semua todo ditampilkan di section **"My Todos"**
- Todo yang selesai memiliki styling berbeda (strikethrough)

#### Menandai Todo Selesai/Belum Selesai

- Klik checkbox di sebelah kiri todo
- Status akan berubah secara real-time

#### Menghapus Todo

1. Klik icon **trash** di sebelah kanan todo
2. Todo akan dihapus dari database

### 4. Logout

1. Klik avatar/profile di navbar
2. Pilih **"Logout"**
3. Akan diarahkan ke landing page

---

## 🔌 API Endpoints

### REST API Routes

#### **GET** `/api/todos`

Mendapatkan semua todos untuk user yang login

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Todo title",
      "description": "Todo description",
      "completed": false,
      "created_at": "2025-11-07T00:00:00Z",
      "user_id": "uuid"
    }
  ]
}
```

#### **POST** `/api/todos`

Membuat todo baru

**Request Body:**

```json
{
  "title": "New Todo",
  "description": "Description here"
}
```

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "title": "New Todo",
    "completed": false
  }
}
```

### Server Actions

#### `createTodo(formData)`

```typescript
import { createTodo } from "@/lib/actions/todo-actions";

// Usage in component
const handleSubmit = async (data: TodoFormData) => {
  const result = await createTodo(data);
  if (result.success) {
    // Handle success
  }
};
```

#### `updateTodo(id, formData)`

```typescript
const result = await updateTodo(todoId, {
  completed: true,
});
```

#### `deleteTodo(id)`

```typescript
const result = await deleteTodo(todoId);
```

---

## 🗃️ State Management

### TanStack Query (Server State)

Digunakan untuk data fetching dan caching:

```typescript
// lib/hooks/useTodos.ts
import { useQuery, useMutation } from "@tanstack/react-query";

export function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
}

export function useCreateTodo() {
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
```

### Zustand (Client State)

Digunakan untuk UI state dan auth state:

```typescript
// lib/stores/auth-store.ts
import { create } from "zustand";

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

**Usage:**

```typescript
import { useAuthStore } from "@/lib/stores/auth-store";

function Component() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
}
```

---

## 🗄️ Database Schema

### Table: `todos`

```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_completed ON todos(completed);

-- Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own todos
CREATE POLICY "Users can view own todos"
  ON todos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE
  USING (auth.uid() = user_id);
```

### Type Definition

```typescript
// types/database.types.ts
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          completed?: boolean;
          updated_at?: string;
        };
      };
    };
  };
}
```

---

## 🚢 Deployment

### Deploy ke Vercel (Recommended)

1. **Push ke GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect ke Vercel**

   - Buka [vercel.com](https://vercel.com)
   - Import repository dari GitHub
   - Vercel akan auto-detect Next.js

3. **Set Environment Variables**

   - Di Vercel dashboard, buka Settings → Environment Variables
   - Tambahkan:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     ```

4. **Deploy**

   - Klik **"Deploy"**
   - Tunggu build selesai
   - Aplikasi live di `https://your-app.vercel.app`

5. **Update Supabase Redirect URLs**
   - Buka Supabase Dashboard
   - Authentication → URL Configuration
   - Tambahkan production URL:
     ```
     https://your-app.vercel.app/auth/callback
     ```

### Deploy Manual

```bash
# Build
npm run build

# Start production server
npm run start
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@/lib/supabase/client'"

**Solusi:**

- Pastikan TypeScript paths di `tsconfig.json` sudah benar:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Error: "Invalid API Key"

**Solusi:**

- Periksa `.env.local`
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` benar
- Restart dev server setelah mengubah env variables

### Error: "Row Level Security policy violation"

**Solusi:**

- Pastikan RLS policies sudah dibuat di Supabase
- Cek apakah user sudah login
- Verify `auth.uid()` di Supabase SQL Editor

### Todos Tidak Muncul

**Solusi:**

1. Cek Network tab di DevTools
2. Pastikan tidak ada error di console
3. Verify user sudah login
4. Cek TanStack Query DevTools untuk status query

### Build Error di Production

**Solusi:**

```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

---

## 📚 Resources & Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Panduan integrasi lengkap

---

## 👨‍💻 Author

**Indra**

- GitHub: [@Indraaai](https://github.com/Indraaai)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Next.js Team untuk framework yang luar biasa
- Supabase untuk backend infrastructure
- Vercel untuk hosting platform
- shadcn untuk component library
- Community untuk semua libraries yang digunakan

---

**Happy Coding! 🚀**
