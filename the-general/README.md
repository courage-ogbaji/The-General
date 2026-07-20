# The General

A birthday celebration web app. Friends and loved ones ("wishers") create accounts, post photo/video/text wishes, and the celebrant gets a private dashboard to browse everything. The site also tells her story, showcases achievements, and hosts a private gift page.

## Tech stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- PostgreSQL + Prisma ORM 7
- NextAuth.js v5 (Auth.js) — credentials login, optional Google OAuth
- Tailwind CSS v4 + shadcn/ui
- Framer Motion for animation
- Cloudinary for image/video uploads and delivery

> **Next.js 16 note:** this project uses `proxy.ts` (not `middleware.ts`) for route protection, and dynamic `params`/`searchParams` are async — see the Next.js 16 upgrade guide in `node_modules/next/dist/docs` if something looks unfamiliar.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

- `DATABASE_URL` — a PostgreSQL connection string.
- `AUTH_SECRET` — generate with `npx auth secret`.
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — optional; leave blank to hide the Google sign-in button.
- `CLOUDINARY_*` / `NEXT_PUBLIC_CLOUDINARY_*` — from your Cloudinary dashboard.
- `CELEBRANT_EMAIL` / `CELEBRANT_PASSWORD` / `CELEBRANT_NAME` — used by the seed script to create the one celebrant account.

### 3. Get a database

Any PostgreSQL 14+ database works (Neon, Supabase, Railway, a local install, or Docker). For a quick local database with no extra install, Prisma can run one for you:

```bash
npx prisma dev
```

This prints a `DATABASE_URL` — copy it into `.env`.

### 4. Push the schema and seed the celebrant account

```bash
npm run db:push
npm run db:seed
```

`db:seed` creates (or promotes) the one `CELEBRANT` user from the `CELEBRANT_*` env vars — that's the account with access to `/dashboard`.

For a production database, apply the committed migration instead of `db:push`:

```bash
npx prisma migrate deploy
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `app/` — routes (App Router)
- `components/ui/` — shadcn/ui primitives
- `lib/prisma.ts` — Prisma client singleton (uses the `pg` driver adapter, required by Prisma 7)
- `prisma/schema.prisma` — data model
- `prisma/seed.ts` — seeds the celebrant account and placeholder content

## Content placeholders

Biography, achievement, and gallery content is seeded as clearly-marked placeholder text/images — replace it with real content via the seed script or directly in the database once the celebrant's story is ready.
