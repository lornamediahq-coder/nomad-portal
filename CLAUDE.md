# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # run ESLint
```

No test suite is configured yet.

## Architecture

Single-page marketing site (Next.js 16 App Router) with a waitlist feature backed by Supabase.

**Key files:**
- `src/app/page.tsx` — entire landing page: hero, four-pillars grid, waitlist section, footer. The `pillars` array drives the feature cards.
- `src/components/WaitlistForm.tsx` — client component; posts to `/api/waitlist` and manages `idle | loading | success | error` state locally.
- `src/app/api/waitlist/route.ts` — POST handler; validates email, inserts into Supabase `waitlist` table, handles duplicate (error code `23505`) as a 409.
- `src/lib/supabase.ts` — singleton Supabase client using **service role key** (server-only; never import in client components).

## Environment variables

Copy `.env.local.example` to `.env.local`:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Both variables are server-side only. The Supabase client in `src/lib/supabase.ts` is intentionally not a browser client — only import it from API routes or Server Components.

## Styling

Tailwind CSS v4 with the stone colour palette as the primary design system. Font is Geist Sans loaded via `next/font/google`.
