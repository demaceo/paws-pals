# 🐾 Paws & Pals - Dog Adoption Platform

A modern dog adoption website with an integrated admin dashboard for managing dog profiles. Built with Next.js 16, Prisma, NextAuth.js, and Tailwind CSS v4.

## ✨ Features

### Public Site

- 🏠 Beautiful landing page with hero and dog grid
- 🐕 Individual dog detail pages with galleries
- 🔍 Filter dogs by sex, size, and more
- 🌐 Bilingual support (English/Spanish)
- 📱 Fully responsive design
- 🌙 Dark mode support
- 📝 Adoption inquiry forms

### Admin Dashboard (New!)

- 🔐 Secure authentication with NextAuth.js
- ➕ Add new dogs with image uploads
- ✏️ Edit existing dog information
- 🗑️ Delete dogs from the system
- 📊 Dashboard with statistics
- 🖼️ Multi-image gallery support
- 📱 Responsive admin interface

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm (recommended)
- Database (Supabase/PostgreSQL/SQLite)

### Installation

1. **Clone and install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up your database:**
   - See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed instructions
   - Recommended: Use Supabase (free tier available)

3. **Configure environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your database URL and credentials
   ```

4. **Run database migrations:**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start development server:**

   ```bash
   pnpm dev
   ```

6. **Access the application:**
   - Public site: <http://localhost:3000>
   - Admin login: <http://localhost:3000/admin/login>

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference for common commands
- **[ADMIN_SETUP.md](ADMIN_SETUP.md)** - Comprehensive admin setup guide
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Database configuration options
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and data flow
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)** - Complete testing checklist
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Implementation details

## 🗂️ Project Structure

```
app/
├── page.tsx                    # Homepage
├── dogs/[id]/page.tsx          # Dog detail pages
├── admin/                      # Admin dashboard
│   ├── page.tsx               # Dashboard
│   ├── login/page.tsx         # Admin login
│   ├── dogs/new/page.tsx      # Add dog
│   └── dogs/[id]/edit/page.tsx # Edit dog
├── api/                        # API routes
│   ├── dogs/                  # CRUD endpoints
│   ├── upload/                # Image upload
│   └── auth/                  # Authentication
└── components/                 # React components

lib/
├── dogs.ts                     # Database queries
├── prisma.ts                   # Prisma client
├── validations.ts              # Zod schemas
└── i18n-*.ts                   # Internationalization

prisma/
├── schema.prisma               # Database schema
└── seed.ts                     # Seed data
```

## 🔐 Admin Dashboard

### Default Credentials

Check your `.env` file for admin credentials:

- Email: Value of `ADMIN_EMAIL`
- Password: Value of `ADMIN_PASSWORD`

⚠️ **Important:** Change the default password before deployment!

### Admin Features

- **Dashboard:** View all dogs with statistics
- **Add Dog:** Complete form with image upload
- **Edit Dog:** Update any dog information
- **Delete Dog:** Remove dogs from database
- **Image Management:** Upload primary and gallery images

### Admin URLs

- Login: `/admin/login`
- Dashboard: `/admin`
- Add Dog: `/admin/dogs/new`
- Edit Dog: `/admin/dogs/[id]/edit`

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router, React Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Prisma ORM + PostgreSQL (Supabase)
- **Authentication:** NextAuth.js v5
- **Validation:** Zod
- **Image Optimization:** Next.js Image + sharp
- **Deployment Ready:** Vercel, Netlify, or any Node.js host

## 🔧 Development

### Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
npx prisma studio     # Open database GUI
npx prisma migrate dev # Create new migration
npx prisma db seed    # Seed database
npx prisma generate   # Generate Prisma client
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy automatically

### Production Environment Variables

```env
DATABASE_URL=your-production-db-url
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-production-password
```

## 📝 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Guide](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Setup](https://supabase.com/docs)

---

**Made with ❤️ for rescue dogs from Sunrise Sanctuary, Puerto Rico**
