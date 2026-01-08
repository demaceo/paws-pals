# Admin Dashboard Implementation Guide

## Overview

The admin dashboard has been successfully implemented with the following features:

- ✅ Authentication with NextAuth.js (credentials-based)
- ✅ Protected admin routes with middleware
- ✅ Full CRUD operations for dogs (Create, Read, Update, Delete)
- ✅ Image upload to filesystem with support for gallery images
- ✅ Database-backed storage with Prisma + PostgreSQL (Supabase)
- ✅ Validation with Zod schemas
- ✅ Responsive admin UI built with Tailwind CSS

## Setup Instructions

### 1. Configure Supabase Database (Recommended)

**Option A: Use Supabase (Easiest)**

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings → Database
4. Copy the "Connection string" (URI format)
5. Update `.env` file:

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Option B: Use Local Prisma Dev Database (Already Running)**

Your `.env` already has a local Prisma Postgres instance running. You can continue using it for development.

### 2. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Update `.env`:

```bash
NEXTAUTH_SECRET="paste-generated-secret-here"
```

### 3. Set Admin Credentials

Update in `.env`:

```bash
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-secure-password"
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will:

- Create the database tables (Dog, Admin)
- Run the seed script automatically
- Import all 9 existing dogs
- Create the admin user

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Verify Database

```bash
npx prisma studio
```

This opens a visual database browser at <http://localhost:5555>

### 7. Start Development Server

```bash
pnpm dev
```

## Usage

### Accessing the Admin Dashboard

1. Navigate to: `http://localhost:3000/admin/login`
2. Login with your credentials from `.env`
3. You'll be redirected to the admin dashboard at `/admin`

### Admin Routes

- `/admin` - Dashboard with dog list and statistics
- `/admin/login` - Login page
- `/admin/dogs/new` - Add new dog
- `/admin/dogs/[id]/edit` - Edit existing dog

### Managing Dogs

**Adding a Dog:**

1. Click "Add New Dog" button
2. Fill in all required fields
3. **Important:** Enter the dog name first before uploading images (creates proper folder structure)
4. Upload primary image (required)
5. Optionally upload gallery images (multiple files)
6. Click "Create Dog"

**Editing a Dog:**

1. Click "Edit" button on any dog in the dashboard
2. Modify fields as needed
3. Upload new images if needed (old images remain unless replaced)
4. Click "Update Dog"

**Deleting a Dog:**

1. Click "Delete" button on any dog
2. Confirm the deletion
3. Dog is removed from database (images remain in `/public/dogs/` for now)

### Image Management

Images are stored in `/public/dogs/[DogName]/` folders:

- Primary image is required for each dog
- Gallery images are optional (can have multiple)
- Supported formats: JPEG, PNG, WebP
- Max file size: 5MB per image
- Images are automatically accessible via Next.js static file serving

## Architecture

### Database Schema

**Dog Model:**

```prisma
model Dog {
  id          String   @id @default(cuid())
  name        String
  breed       String
  age         String
  sex         String   // "Male" or "Female"
  size        String   // "Small", "Medium", or "Large"
  location    String
  description String   @db.Text
  image       String   // Primary image path
  gallery     String[] // Array of image paths
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Admin Model:**

```prisma
model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed with bcrypt
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### API Routes

**Public:**

- `GET /api/dogs` - Get all dogs (used by public site)
- `GET /api/dogs/[id]` - Get single dog

**Protected (Admin only):**

- `POST /api/dogs` - Create new dog
- `PATCH /api/dogs/[id]` - Update dog
- `DELETE /api/dogs/[id]` - Delete dog
- `POST /api/upload` - Upload images

### Authentication Flow

1. User visits `/admin/*` route
2. Middleware checks for valid session
3. If no session → redirect to `/admin/login`
4. Login form submits credentials to NextAuth
5. NextAuth validates against Prisma Admin table
6. On success → JWT session created → redirect to `/admin`

### Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT-based sessions (NextAuth)
- ✅ Middleware protection for admin routes
- ✅ Server-side validation with Zod schemas
- ✅ API route authentication checks
- ✅ CSRF protection (built into NextAuth)
- ✅ Secure cookie settings
- ✅ File type and size validation for uploads

## File Structure

```
app/
├── admin/
│   ├── layout.tsx              # Admin layout with nav & auth
│   ├── page.tsx                # Dashboard (dog list)
│   ├── login/
│   │   └── page.tsx           # Login form
│   ├── dogs/
│   │   ├── new/
│   │   │   └── page.tsx       # Add dog form
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx   # Edit dog form
│   └── components/
│       ├── DogForm.tsx        # Reusable form component
│       └── DogManagementTable.tsx
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts       # NextAuth handlers
│   ├── dogs/
│   │   ├── route.ts           # GET all, POST new
│   │   └── [id]/
│   │       └── route.ts       # GET, PATCH, DELETE
│   └── upload/
│       └── route.ts           # Image upload handler

lib/
├── prisma.ts                  # Prisma client singleton
├── validations.ts             # Zod schemas
├── dogs.ts                    # Updated to use Prisma

prisma/
├── schema.prisma              # Database schema
└── seed.ts                    # Seed script

auth.ts                        # NextAuth configuration
auth.config.ts                 # Auth config with Prisma
middleware.ts                  # Route protection
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Re-run migrations
npx prisma migrate dev
```

### Prisma Client Issues

```bash
# Regenerate client
npx prisma generate

# Clear Next.js cache
rm -rf .next
```

### Authentication Issues

1. Check `.env` has `NEXTAUTH_SECRET` set
2. Verify `NEXTAUTH_URL` matches your local URL
3. Clear browser cookies for localhost
4. Check admin user exists: `npx prisma studio`

### Image Upload Issues

1. Ensure dog name is entered before uploading
2. Check `/public/dogs/` directory permissions
3. Verify file size < 5MB
4. Check file format is JPEG/PNG/WebP

## Next Steps & Enhancements

### Immediate Improvements

1. **Generate Production NextAuth Secret:**

   ```bash
   openssl rand -base64 32
   ```

   Update production environment variables

2. **Setup Supabase for Production:**
   - Create production project
   - Update `DATABASE_URL` in production environment
   - Run migrations: `npx prisma migrate deploy`

3. **Add to `.gitignore`:**

   ```
   .env
   .env.local
   ```

### Future Enhancements

1. **Multi-admin Support:**
   - Add admin management UI
   - Role-based permissions (super admin, editor)
   - Invite system

2. **Cloud Image Storage:**
   - Migrate to Cloudinary/AWS S3/Uploadthing
   - Add image optimization pipeline
   - CDN integration

3. **Audit Logging:**
   - Track all admin actions
   - View history of changes
   - Revert capabilities

4. **Batch Operations:**
   - Bulk delete
   - Bulk status updates
   - Export to CSV

5. **Advanced Features:**
   - Image cropping/editing
   - Draft mode (publish/unpublish dogs)
   - Search and advanced filtering
   - Analytics dashboard

## Support

If you encounter issues:

1. Check Prisma logs: `npx prisma studio`
2. Check Next.js logs in terminal
3. Verify `.env` configuration
4. Ensure migrations are up to date
5. Check browser console for client errors

## Security Checklist for Production

- [ ] Generate strong `NEXTAUTH_SECRET`
- [ ] Change default admin password
- [ ] Use environment-specific URLs
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Add rate limiting
- [ ] Implement CORS properly
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Enable database backups
- [ ] Monitor failed login attempts
- [ ] Add two-factor authentication (optional)

---

**Implementation Complete! 🎉**

The admin dashboard is fully functional and ready for use. Follow the setup instructions above to get started.
