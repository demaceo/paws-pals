# 🏗️ Admin Dashboard Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        PUBLIC SITE                          │
│  ┌───────────┐  ┌───────────┐  ┌────────────────────┐     │
│  │  Home     │  │  Dog      │  │  Adoption          │     │
│  │  /        │  │  /dogs/id │  │  Form              │     │
│  └───────────┘  └───────────┘  └────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Uses
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE (Prisma)                      │
│  ┌───────────────┐              ┌──────────────────┐       │
│  │  Dog Table    │              │  Admin Table     │       │
│  │  - id         │              │  - id            │       │
│  │  - name       │              │  - email         │       │
│  │  - breed      │              │  - password      │       │
│  │  - age        │              │  - name          │       │
│  │  - sex        │              │  - createdAt     │       │
│  │  - size       │              │  - updatedAt     │       │
│  │  - location   │              └──────────────────┘       │
│  │  - description│                                          │
│  │  - image      │                                          │
│  │  - gallery[]  │                                          │
│  │  - createdAt  │                                          │
│  │  - updatedAt  │                                          │
│  └───────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ Manages
                            │
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                          │
│  ┌──────────────────────────────────────────────────┐      │
│  │  Admin Routes (Protected by Middleware)          │      │
│  │  ┌────────────┐ ┌──────────────┐ ┌────────────┐ │      │
│  │  │  Dashboard │ │  Add Dog     │ │  Edit Dog  │ │      │
│  │  │  /admin    │ │  /admin/dogs/│ │  /admin/   │ │      │
│  │  │            │ │  new         │ │  dogs/id/  │ │      │
│  │  │  - List    │ │              │ │  edit      │ │      │
│  │  │  - Stats   │ │  - Form      │ │            │ │      │
│  │  │  - Actions │ │  - Upload    │ │  - Form    │ │      │
│  │  └────────────┘ └──────────────┘ └────────────┘ │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │  Login Page (Public)                             │      │
│  │  /admin/login                                     │      │
│  │  - Credentials form                               │      │
│  │  - NextAuth.js authentication                     │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────────┐
│  Admin   │
│  User    │
└────┬─────┘
     │
     │ 1. Visit /admin/*
     ▼
┌─────────────────┐
│  Middleware     │  ←── Checks for valid session
│  (middleware.ts)│
└────┬───────┬────┘
     │       │
     │ No    │ Yes
     │ Auth  │ Auth
     │       │
     ▼       ▼
┌─────────┐ ┌──────────────┐
│ Redirect│ │ Allow Access │
│ to      │ │ to Admin     │
│ /login  │ │ Routes       │
└─────────┘ └──────────────┘
     │
     │ 2. Enter credentials
     ▼
┌──────────────────┐
│ NextAuth.js      │
│ - Validate email │
│ - Check password │
│ - Create session │
└────┬─────────────┘
     │
     │ 3. Success
     ▼
┌──────────────────┐
│ Redirect to      │
│ /admin           │
└──────────────────┘
```

## Data Flow - Add New Dog

```
┌──────────┐
│  Admin   │
└────┬─────┘
     │
     │ 1. Fill form
     ▼
┌───────────────────┐
│ /admin/dogs/new   │
│ (DogForm)         │
└────┬──────────────┘
     │
     │ 2. Upload images
     ▼
┌───────────────────┐
│ POST /api/upload  │  ──→  Upload to Cloudinary CDN
│ - Validate file   │       Return Cloudinary URLs
│ - Check auth      │
└────┬──────────────┘
     │
     │ 3. Submit form
     ▼
┌───────────────────┐
│ POST /api/dogs    │
│ - Validate data   │
│ - Check auth      │
│ - Zod validation  │
└────┬──────────────┘
     │
     │ 4. Create in DB
     ▼
┌───────────────────┐
│ Prisma Client     │  ──→  Insert into Dog table
│ dog.create()      │       Return new dog
└────┬──────────────┘
     │
     │ 5. Success
     ▼
┌───────────────────┐
│ Redirect to       │
│ /admin            │  ──→  Dashboard shows new dog
└───────────────────┘
```

## Data Flow - View Dogs (Public)

```
┌──────────┐
│  Visitor │
└────┬─────┘
     │
     │ 1. Visit homepage
     ▼
┌─────────────────┐
│ / (app/page.tsx)│
└────┬────────────┘
     │
     │ 2. Server Component fetches data
     ▼
┌───────────────────┐
│ getDogs()         │
│ (lib/dogs.ts)     │
└────┬──────────────┘
     │
     │ 3. Query database
     ▼
┌───────────────────┐
│ Prisma Client     │  ──→  SELECT * FROM Dog
│ dog.findMany()    │       ORDER BY name
└────┬──────────────┘
     │
     │ 4. Return dogs
     ▼
┌───────────────────┐
│ DogExplorer       │  ──→  Render dog cards
│ Component         │       with filters
└───────────────────┘
```

## File Upload Flow

```
┌──────────┐
│  Admin   │
└────┬─────┘
     │
     │ 1. Select image file
     ▼
┌────────────────────┐
│ <input type="file">│
└────┬───────────────┘
     │
     │ 2. onChange event
     ▼
┌────────────────────┐
│ handleImageUpload()│
│ (DogForm)          │
└────┬───────────────┘
     │
     │ 3. Create FormData
     ▼
┌────────────────────┐
│ POST /api/upload   │
│ - file: File       │
│ - dogName: string  │
└────┬───────────────┘
     │
     │ 4. Validate & Save
     ▼
┌────────────────────────────────┐
│ API Handler                    │
│ 1. Check auth                  │
│ 2. Validate file type          │
│ 3. Check file size < 5MB       │
│ 4. Generate UUID filename      │
│ 5. Create /dogs/[Name]/ folder │
│ 6. Write file to disk          │
└────┬───────────────────────────┘
     │
     │ 5. Return path
     ▼
┌────────────────────┐
│ { path: "/dogs/... │  ──→  Update form state
│   /uuid.jpg" }     │       Show preview
└────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────┐
│           Layer 1: Middleware            │
│  ✓ Checks JWT session                   │
│  ✓ Protects /admin/* routes             │
│  ✓ Redirects to /login if no auth       │
└─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         Layer 2: API Route Auth          │
│  ✓ Calls auth() in each protected route │
│  ✓ Returns 401 if no session            │
│  ✓ Validates user is admin               │
└─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│        Layer 3: Data Validation          │
│  ✓ Zod schema validation                │
│  ✓ Type checking                        │
│  ✓ Required field enforcement            │
│  ✓ Enum validation                       │
└─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│       Layer 4: Database Security         │
│  ✓ Parameterized queries (Prisma)      │
│  ✓ Connection pooling                   │
│  ✓ Encrypted connection (TLS)           │
└─────────────────────────────────────────┘
```

## Technology Stack

```
┌──────────────────────────────────────────────────────┐
│                    Frontend                          │
│  • React 19                                          │
│  • Next.js 16 (App Router, Server Components)       │
│  • TypeScript                                        │
│  • Tailwind CSS v4                                   │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                  Authentication                       │
│  • NextAuth.js v5 (beta)                             │
│  • Credentials Provider                              │
│  • JWT Sessions                                      │
│  • bcryptjs (password hashing)                       │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                   Validation                         │
│  • Zod (runtime validation)                          │
│  • TypeScript (compile-time)                         │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                    Database                          │
│  • Prisma ORM                                        │
│  • PostgreSQL (Supabase/local)                       │
│  • Migrations                                        │
│  • Type-safe queries                                 │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                  File Storage                        │
│  • Local filesystem (/public/dogs/)                  │
│  • UUID filenames                                    │
│  • Next.js Image optimization                        │
│  • (Future: Cloud storage)                           │
└──────────────────────────────────────────────────────┘
```

## API Endpoints Map

```
Public Endpoints (No Auth Required)
├── GET /api/dogs              → List all dogs
└── GET /api/dogs/[id]         → Get single dog

Protected Endpoints (Admin Only)
├── POST /api/dogs             → Create dog
├── PATCH /api/dogs/[id]       → Update dog
├── DELETE /api/dogs/[id]      → Delete dog
└── POST /api/upload           → Upload images

Authentication Endpoints
├── POST /api/auth/signin      → Login
├── POST /api/auth/signout     → Logout
└── GET /api/auth/session      → Get current session
```

## Component Hierarchy

```
app/
├── layout.tsx (Root Layout)
│   ├── Header
│   ├── Footer
│   └── LocaleProvider
│
├── page.tsx (Homepage)
│   └── DogExplorer
│       └── DogCard (×9)
│
├── dogs/[id]/page.tsx (Dog Detail)
│   ├── Image Gallery
│   └── AdoptionModal
│
└── admin/ (Admin Section)
    ├── layout.tsx (Admin Layout)
    │   ├── Navigation
    │   └── Sign Out Button
    │
    ├── page.tsx (Dashboard)
    │   ├── Stats Cards
    │   └── DogManagementTable
    │       └── Dog Row (Edit/Delete)
    │
    ├── login/page.tsx (Login)
    │   └── Login Form
    │
    └── dogs/
        ├── new/page.tsx (Add)
        │   └── DogForm (mode: create)
        │
        └── [id]/edit/page.tsx (Edit)
            └── DogForm (mode: edit)
```

---

This architecture provides:

- ✅ Separation of concerns
- ✅ Type safety end-to-end
- ✅ Secure authentication
- ✅ Scalable structure
- ✅ Easy to maintain
- ✅ Ready for production
