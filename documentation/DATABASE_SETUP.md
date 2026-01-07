# Database Setup Options

You have 3 options for setting up the database. Choose the one that works best for you:

## Option 1: Supabase (Recommended - Free & Easy)

### Steps

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for free account
   - Create a new project

2. **Get Connection String**
   - Go to Project Settings → Database
   - Find "Connection string" section
   - Copy the **URI** (not the pooler)
   - Replace `[YOUR-PASSWORD]` with your database password

3. **Update .env File**

   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.bdcpvpizdnftcjabllri.supabase.co:5432/postgres"
   ```

4. **Run Migrations**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed Database**

   ```bash
   npx prisma db seed
   ```

---

## Option 2: Local PostgreSQL (Docker)

### Prerequisites

- Docker Desktop installed

### Setup Steps

1. **Start PostgreSQL with Docker**

   ```bash
   docker run --name paws-pals-db \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=pawspals \
     -p 5432:5432 \
     -d postgres:16
   ```

2. **Update .env File**

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pawspals"
   ```

3. **Run Migrations**

   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed Database**

   ```bash
   npx prisma db seed
   ```

### Stop/Start Database

```bash
# Stop
docker stop paws-pals-db

# Start again
docker start paws-pals-db

# Remove (WARNING: deletes all data)
docker rm -f paws-pals-db
```

---

## Option 3: SQLite (Quickest - Development Only)

⚠️ **Not recommended for production** - SQLite has limitations with concurrent writes and some Prisma features.

### Configuration Steps

1. **Update prisma/schema.prisma**

   ```prisma
   datasource db {
     provider = "sqlite"
   }
   ```

2. **Update .env File**

   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. **Run Migrations**

   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed Database**

   ```bash
   npx prisma db seed
   ```

The database file will be created at `prisma/dev.db`

---

## Troubleshooting

### Can't Connect to Database

```bash
# Test connection
npx prisma db pull
```

### Reset Database (Deletes All Data)

```bash
npx prisma migrate reset
```

### View Database Content

```bash
npx prisma studio
```

Opens at <http://localhost:5555>

---

## Next Steps

After setting up your database:

1. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

2. **Start Development Server:**

   ```bash
   pnpm dev
   ```

3. **Access Admin Dashboard:**
   - Navigate to: <http://localhost:3000/admin/login>
   - Login with credentials from `.env` file

---

## Verification

Check that everything worked:

```bash
# Open database viewer
npx prisma studio

# You should see:
# - 9 dogs in the Dog table
# - 1 admin user in the Admin table
```

---

**Recommendation:** Use **Supabase** for the best experience. It's free, managed, and works perfectly for production deployment later.
