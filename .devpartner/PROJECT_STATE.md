# Project State: Frontpage

## Current Status

Auth system built. Full UI shell and secondary pages matching `preview.jpg` are implemented. Ready to wire up real data via TanStack Query.

## What Currently Works

- **Auth**: Sign-up, sign-in, password-reset, anonymous guest mode via Supabase
- **Session**: Cookie-based session refresh via SSR middleware
- **Landing page**: Hero with "Create Account" and "Try as Guest" CTAs
- **Dashboard UI**: Full UI shell matching `preview.jpg` (Sidebar, TopNav, ReaderView, Feed layout).
- **Secondary UI Pages**: Saved, Digest, and Discover views implemented with components. Add Feed and Add Category dialogs ready.
- **Database**: 7 tables migrated to Supabase (profiles, feeds, feed_items, categories, user_feeds, user_interactions, user_preferences)
- **Feed Parsing**: RSS/Atom parsing service and fetch/refresh/validate API routes implemented

## In Progress

| Item | Owner | Next Step | Status |
|------|-------|-----------|--------|
| **Phase 3: TanStack Query** | Full-stack | Wire up hooks & real data to UI | **Active** |
| Phase 4: Core logic features | Full-stack | Feed CRUD, categories sync, bookmarks | Pending |
| Phase 5: Guest seeding | Full-stack | Seed guest with 19 feeds | Pending |
| Phase 6: AI Summarization | Backend Eng | OpenAI integration | Pending |
| Phase 7: Polish | Full-stack | Dark mode, keyboard nav, deploy | Final phase |

## Key Architectural Facts

- **Stack**: Next.js 16 (App Router), React 19, Tailwind v4, TypeScript strict
- **Database**: Supabase Postgres via Drizzle ORM
- **Auth**: Supabase SSR (email/password + anonymous guest mode)
- **Data fetching**: TanStack Query for client state (provider ready)
- **AI Differentiator**: OpenAI summarization (deferred)

## Environment

See `.env.example` for required variables. Real secrets in `.env` (gitignored).
