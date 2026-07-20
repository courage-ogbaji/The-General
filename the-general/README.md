# The General

A birthday celebration web app. Friends and loved ones ("wishers") create accounts, post photo/video/text wishes, and the celebrant gets a private dashboard to browse everything. The site also tells her story, showcases her achievements, and hosts a private gift page.

## Tech stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- PostgreSQL + Prisma ORM 7 (`pg` driver adapter)
- NextAuth.js v5 (Auth.js) — credentials login, optional Google OAuth
- Tailwind CSS v4 + shadcn/ui (Base UI primitives)
- Framer Motion for scroll reveals and page transitions
- Cloudinary for image/video uploads and delivery

> **Next.js 16 note:** this project uses `proxy.ts` (not `middleware.ts`) for route protection — proxy always runs in the Node.js runtime, not edge — and dynamic `params`/`searchParams` are async. See the Next.js 16 upgrade guide in `node_modules/next/dist/docs` if something looks unfamiliar.
>
> **shadcn/ui note:** this project's shadcn preset is built on [Base UI](https://base-ui.com), not Radix. Polymorphic composition uses a `render` prop (`<Button render={<Link href="/x" />}>`), not `asChild`. When composing `Button` with a non-`<button>` element, also pass `nativeButton={false}` to avoid a console warning.

## Pages

| Route | Description | Access |
| --- | --- | --- |
| `/` | Hero + scrapbook-style photo/note collage | Public |
| `/biography` | Chapter-style story, alternating image/text | Public |
| `/achievements` | Card-grid of milestones | Public |
| `/gallery` | Masonry photo/video grid with lightbox | Public |
| `/wishes` | Public wall of wishes, filterable by wisher | Public |
| `/wishes/new` | Post a wish (photos/video + message) | Logged in |
| `/signup`, `/login` | Account creation and sign-in (credentials + optional Google) | Public |
| `/profile` | Edit your name/photo/bio, manage your own wishes | Logged in |
| `/gift` | Bank/crypto/delivery details, copy-to-clipboard, `noindex` | Logged in |
| `/dashboard` | Stats + searchable wisher list | Celebrant only |
| `/dashboard/[wisherId]` | One wisher's wishes, with seen/favorite toggles | Celebrant only |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

- `DATABASE_URL` — a PostgreSQL connection string (see step 3).
- `AUTH_SECRET` — generate with `npx auth secret`.
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — optional. Create an OAuth client in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) with authorized redirect URI `{your origin}/api/auth/callback/google`. Leave blank to hide the Google sign-in button entirely.
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard (not currently used server-side, but documented for future signed-upload use).
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — your Cloudinary cloud name, exposed to the browser.
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` — an **unsigned** upload preset (Cloudinary dashboard → Settings → Upload → Upload presets → Add upload preset → Signing Mode: Unsigned). Required for the photo/video upload widgets on `/signup`, `/profile`, and `/wishes/new` — without it, those upload buttons simply don't render (the rest of each form still works).
- `CELEBRANT_EMAIL` / `CELEBRANT_PASSWORD` / `CELEBRANT_NAME` — used by the seed script to create the one celebrant account.

### 3. Get a database

Any PostgreSQL 14+ database works (Neon, Supabase, Railway, a local install, or Docker). For a quick local database with no extra install, Prisma can run one for you:

```bash
npx prisma dev
```

This prints connection strings — use the `DATABASE_URL` value shown under `TCP` in `.env`.

### 4. Push the schema and seed the celebrant account

```bash
npm run db:push
npm run db:seed
```

`db:seed` creates (or promotes) the one `CELEBRANT` user from the `CELEBRANT_*` env vars — that's the account with access to `/dashboard`. It also seeds placeholder Biography/Achievement/Gallery content the first time it runs (it won't overwrite real content on later runs).

For a production database, apply the committed migrations instead of `db:push`:

```bash
npx prisma migrate deploy
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log in at `/login` with your `CELEBRANT_*` credentials to see the dashboard, or sign up a normal account at `/signup` to try the wisher flow.

## Content placeholders

Biography, achievement, and gallery content is seeded as clearly-marked (`[Placeholder]`) text via `prisma/seed.ts`, with photo tiles rendered as labeled gradient placeholders wherever `imageUrl`/`mediaUrl` is empty. To add real content:

- Edit the arrays in `prisma/seed.ts` and re-run `npm run db:seed` (only fills empty tables, safe to re-run), **or**
- Edit the `BiographySection` / `Achievement` / `GalleryItem` rows directly in the database.

`GiftInfo` is different — it's a single editable row, and the celebrant account can edit it directly from `/gift` (an edit form appears below the display when logged in as the celebrant).

## Project structure

- `app/` — routes (App Router); most routes ship an `actions.ts` (Server Actions) alongside `page.tsx`
- `components/ui/` — shadcn/ui primitives (Base UI-based)
- `components/` — shared app components (site header/footer, page transitions, scroll reveal, placeholder photo, copy button)
- `auth.ts` — NextAuth v5 config
- `proxy.ts` — route protection (Next.js 16's replacement for middleware)
- `lib/prisma.ts` — Prisma client singleton (uses the `pg` driver adapter, required by Prisma 7)
- `lib/validations/` — zod schemas per feature
- `prisma/schema.prisma` — data model
- `prisma/seed.ts` — seeds the celebrant account and placeholder content

## Verifying changes

```bash
npm run lint
npm run build
```

Both are run clean before every commit in this project's history — keep it that way.
