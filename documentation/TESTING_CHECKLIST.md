# ✅ Admin Dashboard - Setup Checklist

Use this checklist to ensure everything is properly configured.

## 📋 Pre-Setup Checklist

- [ ] Node.js 20+ installed
- [ ] pnpm installed
- [ ] All dependencies installed (`pnpm install`)
- [ ] Have chosen database option (Supabase recommended)

---

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)

- [ ] Created Supabase account
- [ ] Created new Supabase project
- [ ] Copied connection string (URI format)
- [ ] Updated `DATABASE_URL` in `.env`

### Option 2: Docker PostgreSQL

- [ ] Docker Desktop installed and running
- [ ] Started PostgreSQL container
- [ ] Updated `DATABASE_URL` in `.env`

### Option 3: SQLite (Quick Test)

- [ ] Updated schema.prisma for SQLite
- [ ] Updated `DATABASE_URL` in `.env`

---

## 🔑 Environment Variables

Check your `.env` file has all these variables:

- [ ] `DATABASE_URL` - Your database connection string
- [ ] `NEXTAUTH_URL` - Set to `http://localhost:3000`
- [ ] `NEXTAUTH_SECRET` - Generated with `openssl rand -base64 32`
- [ ] `ADMIN_EMAIL` - Your admin email address
- [ ] `ADMIN_PASSWORD` - Your admin password (change from default!)

---

## 🚀 Database Initialization

Run these commands in order:

- [ ] `npx prisma migrate dev --name init` - Create tables
- [ ] `npx prisma generate` - Generate Prisma client
- [ ] Verify seed ran successfully (should see 9 dogs + 1 admin)

**Verification:**

```bash
npx prisma studio
```

- [ ] Opened Prisma Studio at <http://localhost:5555>
- [ ] See 9 dogs in Dog table
- [ ] See 1 admin in Admin table

---

## 🏃 Start Development Server

- [ ] Run `pnpm dev`
- [ ] Server starts without errors
- [ ] Public site loads at <http://localhost:3000>
- [ ] Dogs are displayed on homepage

---

## 🔐 Test Authentication

- [ ] Navigate to <http://localhost:3000/admin/login>
- [ ] See login form
- [ ] Enter admin credentials from `.env`
- [ ] Click "Sign in"
- [ ] Successfully redirected to `/admin` dashboard

**If login fails:**

- [ ] Check credentials match `.env` file
- [ ] Verify admin user exists in database (Prisma Studio)
- [ ] Check browser console for errors
- [ ] Try clearing browser cookies

---

## 📊 Test Dashboard Features

### View Dogs

- [ ] Dashboard loads successfully
- [ ] See table with all 9 dogs
- [ ] Statistics show correct counts
- [ ] Dog images display properly

### Navigation

- [ ] "Add New Dog" button visible
- [ ] "View Site" link opens public site in new tab
- [ ] "Sign Out" button works

---

## ➕ Test Add Dog

- [ ] Click "Add New Dog" button
- [ ] Navigate to `/admin/dogs/new`
- [ ] Form displays all required fields
- [ ] Enter dog name first
- [ ] Upload primary image
- [ ] Optionally upload gallery images
- [ ] Fill in all other fields
- [ ] Click "Create Dog"
- [ ] Redirected to dashboard
- [ ] New dog appears in list

**Verify on public site:**

- [ ] New dog appears on homepage
- [ ] Can navigate to dog detail page
- [ ] All information displays correctly
- [ ] Images load properly

---

## ✏️ Test Edit Dog

- [ ] Click "Edit" button on any dog
- [ ] Navigate to `/admin/dogs/[id]/edit`
- [ ] Form pre-filled with existing data
- [ ] Images display correctly
- [ ] Change some fields
- [ ] Upload additional gallery images (optional)
- [ ] Click "Update Dog"
- [ ] Redirected to dashboard
- [ ] Changes reflected in dashboard

**Verify on public site:**

- [ ] Navigate to edited dog's page
- [ ] Changes are visible
- [ ] New images appear (if uploaded)

---

## 🗑️ Test Delete Dog

- [ ] Click "Delete" button on a test dog
- [ ] Confirmation dialog appears
- [ ] Click "OK" to confirm
- [ ] Dog removed from dashboard
- [ ] Dashboard updates without page reload

**Verify on public site:**

- [ ] Dog no longer appears on homepage
- [ ] Dog detail page shows 404

**⚠️ Note:** Images are deleted from Cloudinary when dog is deleted

---

## 🖼️ Test Image Upload

- [ ] Can upload JPEG images
- [ ] Can upload PNG images
- [ ] Can upload WebP images
- [ ] Files > 5MB are rejected
- [ ] Non-image files are rejected
- [ ] Multiple gallery images can be uploaded
- [ ] Can remove gallery images before saving
- [ ] Images display in form preview

**Check Cloudinary:**

- [ ] Images uploaded to Cloudinary under `paws-pals/dogs/[DogName]/` folder
- [ ] Image URLs returned from `/api/upload` are Cloudinary URLs
- [ ] Images accessible via Cloudinary CDN URLs (e.g., `res.cloudinary.com/...`)

---

## 🌐 Test Public Site Integration

- [ ] Homepage displays all dogs from database
- [ ] Dog cards show correct information
- [ ] Filters work (Male/Female, Size)
- [ ] Language switcher works (English/Spanish)
- [ ] Click dog card navigates to detail page
- [ ] Dog detail page shows all information
- [ ] Gallery images display
- [ ] Adoption modal opens
- [ ] Form submission works

---

## 🔒 Test Security

### Route Protection

- [ ] `/admin/*` routes require login
- [ ] Accessing `/admin` without login redirects to `/admin/login`
- [ ] After login, can access all admin pages
- [ ] After logout, redirected to login page

### API Protection

- [ ] `POST /api/dogs` requires authentication (test with curl/Postman)
- [ ] `PATCH /api/dogs/[id]` requires authentication
- [ ] `DELETE /api/dogs/[id]` requires authentication
- [ ] `POST /api/upload` requires authentication
- [ ] Public APIs (`GET /api/dogs`) work without auth

---

## 🐛 Error Handling

### Test Edge Cases

- [ ] Submit form with missing required fields
- [ ] Try to upload image without entering dog name
- [ ] Try to upload file larger than 5MB
- [ ] Try to upload non-image file
- [ ] Edit non-existent dog ID (should 404)
- [ ] Delete non-existent dog (should handle gracefully)

### Check Error Messages

- [ ] Form validation errors display clearly
- [ ] Upload errors show helpful messages
- [ ] Login errors show "Invalid email or password"
- [ ] Network errors handled gracefully

---

## 📱 Responsive Design

Test on different screen sizes:

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**Check:**

- [ ] Dashboard table responsive
- [ ] Forms usable on mobile
- [ ] Navigation works on all sizes
- [ ] Images scale properly
- [ ] No horizontal scrolling

---

## 🌙 Dark Mode

- [ ] Dashboard respects system dark mode
- [ ] All text readable in dark mode
- [ ] Forms styled correctly in dark mode
- [ ] Public site dark mode works

---

## 📦 Production Readiness

Before deploying to production:

- [ ] Changed default admin password
- [ ] Generated strong `NEXTAUTH_SECRET`
- [ ] Updated `NEXTAUTH_URL` to production URL
- [ ] Set up production database (Supabase)
- [ ] Ran migrations on production database
- [ ] Tested on production environment
- [ ] `.env` added to `.gitignore`
- [ ] Environment variables set in hosting platform
- [ ] HTTPS enabled
- [ ] Database backups configured

---

## 📚 Documentation Review

- [ ] Read `ADMIN_SETUP.md`
- [ ] Read `DATABASE_SETUP.md`
- [ ] Read `QUICKSTART.md`
- [ ] Read `IMPLEMENTATION_SUMMARY.md`
- [ ] Understand all environment variables
- [ ] Know how to run migrations
- [ ] Know how to seed database
- [ ] Know how to backup database

---

## ✨ Final Verification

- [ ] All tests passed
- [ ] No console errors
- [ ] No console warnings
- [ ] Database contains expected data
- [ ] All images load correctly
- [ ] Admin can perform all CRUD operations
- [ ] Public site works as expected
- [ ] Performance is acceptable
- [ ] Ready for daily use

---

## 🎉 Success

If all items are checked, congratulations! Your admin dashboard is fully functional and ready to use.

## 🆘 Need Help?

If any tests fail:

1. Check the specific documentation file for that feature
2. Review error messages in browser console and terminal
3. Verify `.env` configuration
4. Check database connection: `npx prisma studio`
5. Try clearing cache: `rm -rf .next && pnpm dev`
6. Regenerate Prisma client: `npx prisma generate`

---

**Last Updated:** January 7, 2026
