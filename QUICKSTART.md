# Quick Start Guide

## Initial Setup (First Time Only)

```bash
# 1. Install dependencies (if not already done)
pnpm install

# 2. Configure environment variables
# Edit .env file:
# - Update NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - Update ADMIN_EMAIL and ADMIN_PASSWORD
# - Update DATABASE_URL if using Supabase

# 3. Run database migrations and seed data
npx prisma migrate dev --name init

# 4. Generate Prisma client
npx prisma generate

# 5. Start development server
pnpm dev
```

## Daily Development

```bash
# Start dev server
pnpm dev

# Open admin dashboard
# Navigate to: http://localhost:3000/admin/login
# Login with credentials from .env
```

## Common Commands

```bash
# View database
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name your_migration_name

# Seed database manually
npx prisma db seed
```

## Default Credentials

Check your `.env` file for:

- Email: Value of `ADMIN_EMAIL`
- Password: Value of `ADMIN_PASSWORD`

## Admin URLs

- Login: `/admin/login`
- Dashboard: `/admin`
- Add Dog: `/admin/dogs/new`
- Edit Dog: `/admin/dogs/[id]/edit`

## Public URLs (unchanged)

- Home: `/`
- Dog Details: `/dogs/[id]`
- Thank You: `/thank-you`
