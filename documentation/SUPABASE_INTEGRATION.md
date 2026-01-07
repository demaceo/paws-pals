# Supabase Integration Documentation

## Overview

This project uses **Supabase** as the PostgreSQL database hosting provider. Supabase provides a managed PostgreSQL database with a generous free tier, making it ideal for both development and production environments.

## Why Supabase?

- **Managed PostgreSQL**: No server maintenance required
- **Free tier**: 500MB database, up to 2GB bandwidth per month
- **Built-in features**: Real-time subscriptions, authentication, storage (not currently used)
- **Developer-friendly**: Excellent dashboard and SQL editor
- **Production-ready**: Automatic backups, SSL, connection pooling
- **Easy deployment**: Works seamlessly with Vercel and other platforms

---

## Architecture

### Database Connection Flow

```
Next.js App → Prisma ORM → Connection Pool → Supabase PostgreSQL
   (Server)     (Client)      (Pooler)         (Database)
```

### Data Access Pattern

```
API Route → Prisma Query → Supabase → PostgreSQL → Return Data
  (Auth)      (Type-safe)    (Network)   (Storage)
```

---

## Configuration

### Environment Variables

Located in `.env`:

```env
# Direct connection (for migrations)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.bdcpvpizdnftcjabllri.supabase.co:5432/postgres"

# Pooled connection (for production - recommended)
DATABASE_URL="postgresql://postgres.bdcpvpizdnftcjabllri:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"

# Optional: Supabase client credentials (not currently used)
NEXT_PUBLIC_SUPABASE_URL=https://bdcpvpizdnftcjabllri.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### Connection String Format

**Direct Connection** (for migrations, seed scripts):

```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Pooled Connection** (for app runtime - higher concurrency):

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

---

## Database Schema

### Prisma Configuration

**File**: [prisma/schema.prisma](prisma/schema.prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### Database Models

#### Dog Model

```prisma
model Dog {
  id          String    @id @default(cuid())
  name        String
  breed       String
  age         String
  sex         String
  size        String
  status      DogStatus @default(Available)
  location    String
  description String
  image       String    // Cloudinary URL
  gallery     String?   // JSON array of Cloudinary URLs
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([name])
}

enum DogStatus {
  Available
  Pending
  Adopted
}
```

**Features**:

- CUID primary keys (collision-resistant)
- Status enum for type safety
- Timestamps for audit trail
- Indexed name field for fast searches
- JSON storage for gallery images

#### Admin Model

```prisma
model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Bcrypt hashed
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Features**:

- Unique email constraint
- Bcrypt password hashing
- Creation/update timestamps

---

## Database Operations

### Prisma Client

**File**: [lib/prisma.ts](lib/prisma.ts)

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Singleton pattern**: Prevents multiple Prisma instances in development (hot reload).

### Database Queries

#### Get All Dogs

**File**: [lib/dogs.ts](lib/dogs.ts)

```typescript
export async function getDogs(): Promise<Dog[]> {
  const dogs = await prisma.dog.findMany({
    orderBy: { name: "asc" },
  });
  
  return dogs.map((dog) => ({
    ...dog,
    gallery: dog.gallery ? JSON.parse(dog.gallery) : undefined,
  }));
}
```

#### Get Single Dog

```typescript
export async function getDog(id: string): Promise<Dog | null> {
  const dog = await prisma.dog.findUnique({
    where: { id },
  });
  
  if (!dog) return null;
  
  return {
    ...dog,
    gallery: dog.gallery ? JSON.parse(dog.gallery) : undefined,
  };
}
```

#### Create Dog

**File**: [app/api/dogs/route.ts](app/api/dogs/route.ts)

```typescript
const dog = await prisma.dog.create({
  data: {
    ...validatedData,
    gallery: validatedData.gallery 
      ? JSON.stringify(validatedData.gallery) 
      : undefined,
  },
});
```

#### Update Dog

**File**: [app/api/dogs/[id]/route.ts](app/api/dogs/[id]/route.ts)

```typescript
const dog = await prisma.dog.update({
  where: { id },
  data: {
    ...validatedData,
    gallery: validatedData.gallery 
      ? JSON.stringify(validatedData.gallery) 
      : undefined,
  },
});
```

#### Delete Dog

```typescript
await prisma.dog.delete({
  where: { id },
});
```

---

## Migrations

### Creating Migrations

Migrations track schema changes over time.

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy
```

### Existing Migrations

**File**: [prisma/migrations/20260107204302_init/migration.sql](prisma/migrations/20260107204302_init/migration.sql)

Initial migration creates:

- Dog table with all fields
- Admin table with authentication fields
- DogStatus enum
- Indexes and constraints

### Migration Strategy

**Development**:

```bash
npx prisma migrate dev
```

- Creates migration file
- Applies to database
- Regenerates Prisma Client

**Production**:

```bash
npx prisma migrate deploy
```

- Only applies migrations
- No prompts
- Safe for CI/CD

---

## Seeding

### Seed Script

**File**: [prisma/seed.ts](prisma/seed.ts)

Seeds the database with:

- Default admin user
- Sample dog data (9 dogs)

**Run seeding**:

```bash
npx prisma db seed
```

**Configuration** (package.json):

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### Admin Credentials

Default seeded admin:

- **Email**: From `ADMIN_EMAIL` env var
- **Password**: From `ADMIN_PASSWORD` env var (hashed)
- **Name**: From `ADMIN_NAME` env var

**Security**: Change these in production!

---

## Connection Management

### Connection Pooling

Supabase provides two connection modes:

#### Direct Connection

- **Use for**: Migrations, seed scripts, one-off queries
- **Limit**: ~60 connections
- **Best for**: Development, tooling

#### Pooled Connection (Recommended)

- **Use for**: Application runtime
- **Limit**: 10,000+ connections
- **Best for**: Production, serverless functions
- **Mode**: Transaction mode (default)

### Environment-Specific Configuration

**Development** (local):

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

**Production** (Vercel):

```env
DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

---

## Supabase Dashboard Features

### 1. Table Editor

**Location**: Dashboard → Table Editor

**Features**:

- Visual table editing
- Add/edit/delete rows
- View relationships
- Manage indexes

**Use cases**:

- Quick data inspection
- Manual data updates
- Testing queries

### 2. SQL Editor

**Location**: Dashboard → SQL Editor

**Features**:

- Run custom SQL queries
- Save queries for reuse
- View query execution plans
- Export results as CSV

**Example queries**:

```sql
-- View all available dogs
SELECT * FROM "Dog" WHERE status = 'Available';

-- Count dogs by status
SELECT status, COUNT(*) FROM "Dog" GROUP BY status;

-- Find dogs without gallery images
SELECT * FROM "Dog" WHERE gallery IS NULL;
```

### 3. Database Settings

**Location**: Dashboard → Settings → Database

**Important settings**:

- **Connection string**: Copy your DATABASE_URL
- **Connection pooling**: Enable for production
- **SSL enforcement**: Always enabled
- **Database password**: Reset if needed

### 4. Logs

**Location**: Dashboard → Logs

**Features**:

- Query logs
- Error logs
- Connection logs

**Use cases**:

- Debug slow queries
- Monitor errors
- Track connection issues

---

## Performance Optimization

### Indexing Strategy

**Current indexes**:

```prisma
@@index([name])  // Dog name for fast searches
```

**Potential indexes for future**:

```prisma
@@index([status])              // Filter by availability
@@index([createdAt])           // Sort by newest
@@index([breed])               // Filter by breed
@@index([status, createdAt])   // Composite for filtering + sorting
```

### Query Optimization

**Good**:

```typescript
// Only select needed fields
const dogs = await prisma.dog.findMany({
  select: { id: true, name: true, image: true }
});
```

**Bad**:

```typescript
// Selects all fields (including large gallery JSON)
const dogs = await prisma.dog.findMany();
```

### Connection Best Practices

1. **Use pooled connection** in production
2. **Limit concurrent queries** in serverless
3. **Close connections** in long-running scripts
4. **Use transactions** for related operations

---

## Backup & Recovery

### Automatic Backups

Supabase automatically backs up your database:

- **Frequency**: Daily
- **Retention**: 7 days (free tier)
- **Location**: Same region as database

### Manual Backup

**Using Supabase Dashboard**:

1. Go to Settings → Database
2. Click "Download backup"
3. Save SQL file

**Using pg_dump**:

```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres" > backup.sql
```

### Restore from Backup

**Using SQL Editor**:

1. Open SQL Editor in dashboard
2. Paste backup SQL
3. Execute

**Using psql**:

```bash
psql "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres" < backup.sql
```

---

## Monitoring & Alerts

### Database Metrics

**Dashboard → Reports**

Monitor:

- **Database size**: Track toward free tier limit (500MB)
- **Active connections**: Ensure not hitting limits
- **Query performance**: Identify slow queries
- **Error rate**: Track failed queries

### Setting Up Alerts

1. Go to Settings → Email alerts
2. Enable:
   - Database size warnings (80%, 90%)
   - Connection limit warnings
   - Error rate alerts

---

## Troubleshooting

### Connection Issues

**Error**: "Can't reach database server"

**Solutions**:

1. Check DATABASE_URL is correct
2. Verify network connectivity
3. Check Supabase status page
4. Try direct connection URL

### Migration Errors

**Error**: "Migration failed"

**Solutions**:

1. Check for syntax errors in migration
2. Ensure database is accessible
3. Try `npx prisma migrate reset` (dev only)
4. Check migration history in `_prisma_migrations` table

### Prisma Client Issues

**Error**: "PrismaClient is unable to connect"

**Solutions**:

1. Run `npx prisma generate`
2. Restart dev server
3. Check DATABASE_URL format
4. Verify SSL mode: `?sslmode=require`

### Performance Issues

**Error**: Slow queries

**Solutions**:

1. Add indexes to frequently queried fields
2. Use `select` to fetch only needed fields
3. Use connection pooling
4. Check query in SQL Editor with EXPLAIN

---

## Security

### SSL/TLS

- ✅ All connections encrypted with SSL
- ✅ Certificate verification enabled
- ✅ Enforced by Supabase

### Access Control

- ✅ Database password in `.env` (gitignored)
- ✅ IP restrictions available (paid plans)
- ✅ Row Level Security (RLS) available (not used)
- ✅ Admin-only write operations

### Best Practices

1. **Rotate passwords** regularly
2. **Use environment variables** for credentials
3. **Never commit** `.env` file
4. **Limit admin accounts** to necessary users
5. **Monitor access logs** in dashboard

---

## Cost Management

### Free Tier Limits

- **Database size**: 500MB
- **Bandwidth**: 2GB/month
- **Concurrent connections**: 60 direct, 200 pooled
- **Backups**: 7 days retention

### Monitoring Usage

**Dashboard → Settings → Billing**

Track:

- Current database size
- Bandwidth used
- Active connections
- Backup storage

### Upgrade Triggers

Consider upgrading when:

- Database > 400MB (80% of limit)
- Bandwidth consistently high
- Need more backups (30 days)
- Need point-in-time recovery

---

## Alternative Database Options

While this project uses Supabase, it's designed to work with any PostgreSQL provider:

| Provider | Pros | Cons |
|----------|------|------|
| **Supabase** | Free tier, managed, easy setup | 500MB limit on free |
| **Railway** | Simple setup, generous free tier | Higher latency |
| **Neon** | Serverless, branching | Limited free tier |
| **AWS RDS** | Enterprise-grade, scalable | Complex setup, expensive |
| **Local Docker** | Full control, no limits | Manual management |

### Switching Providers

To switch from Supabase:

1. Update `DATABASE_URL` in `.env`
2. Run `npx prisma migrate deploy`
3. Run `npx prisma db seed`
4. No code changes needed!

---

## Development Workflow

### Typical Development Cycle

1. **Make schema changes** in `prisma/schema.prisma`
2. **Create migration**: `npx prisma migrate dev --name description`
3. **Test locally**: Verify changes in app
4. **Commit**: Add migration files to git
5. **Deploy**: Run `npx prisma migrate deploy` in production

### Multi-Environment Setup

**Local Development**:

```env
DATABASE_URL="postgresql://localhost:5432/pawspals_dev"
```

**Staging**:

```env
DATABASE_URL="postgresql://...supabase.co.../postgres?schema=staging"
```

**Production**:

```env
DATABASE_URL="postgresql://...pooler.supabase.com/postgres"
```

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Status](https://status.supabase.com/)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

## Support

For Supabase-specific issues:

- [Supabase Support](https://supabase.com/support)
- [Discord Community](https://discord.supabase.com/)
- [GitHub Discussions](https://github.com/supabase/supabase/discussions)

For Prisma-specific issues:

- [Prisma Discord](https://pris.ly/discord)
- [Prisma GitHub](https://github.com/prisma/prisma)
