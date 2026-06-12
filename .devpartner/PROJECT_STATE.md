# Project State: Frontpage

## Current Status

Phase 0 complete. Full scaffold ready — schema written, deps installed, git history clean. Ready for Phase 1 (Auth).

## What Currently Works

- Next.js 16.2.2 app running in `flux/`
- Static UI shell matching `preview.jpg`:
  - DashboardLayout, TopNav, Sidebar with category nav
  - FeedHeader (view toggles, sort, refresh, mark-all-read)
  - FeedItem component with unread dot, source badge, excerpt
  - UI primitives: Button, Badge, Card, Skeleton
  - Brand kit tokens in `globals.css` (light mode only)
- TypeScript types: `Article`, `Feed`, `UserPreferences`
- `.devpartner/` state system (PROJECT_STATE, DECISIONS, ROADMAP, ERROR_LOG)
- Drizzle ORM schema: `profiles`, `feeds`, `feed_items`, `categories`, `user_feeds`, `user_interactions`, `user_preferences`
- Supabase client config (`lib/supabase.ts`, `lib/supabase-server.ts`)
- `drizzle.config.ts` for migrations
- `.env.example` with required variables
- `sample-feeds.json` copied into `src/data/`
- All dependencies installed (supabase, drizzle, tanstack-query, rss-parser, sanitize-html, openai)
- Git: 6 commits, clean working tree

## In Progress

| Item | Owner | Next Step | Status |
|------|-------|-----------|--------|
| **Phase 1: Auth** | Backend Eng | Configure Supabase project, get keys, build sign-up/sign-in/guest pages | **Ready to start** |
| Phase 2: Feed parsing | Backend Eng | rss-parser wrapper, API routes | Pending Phase 1 |
| Phase 3: TanStack Query | Frontend Arch | Hooks, optimistic updates, wire UI | Pending Phase 2 |
| Phase 4: Core features | Full-stack | Feed management, categories, reader view | Pending Phase 3 |
| Phase 5: Landing page | Frontend | Hero, guest flow, onboarding | Pending Phase 4 |
| Phase 6: AI Summarization | Backend Eng | OpenAI integration | Pending Phase 5 |
| Phase 7: Polish | Full-stack | Dark mode, keyboard nav, perf, deploy | Final phase |

## Known Issues

None yet.

## Key Architectural Facts

- **Stack**: Next.js 16.2.2 (App Router), React 19, Tailwind CSS v4, TypeScript strict
- **Database**: Supabase (Postgres) via Drizzle ORM
- **Auth**: Supabase Auth (email/password + anonymous for guest mode)
- **Data fetching**: Server-side for initial load, TanStack Query for client state
- **Styling**: Tailwind v4 with CSS custom properties from brand kit
- **Project root**: `flux/` directory contains the application code
- **AI Features**: OpenAI-based article summarization, auto-tagging (differentiator)
- **Conventions**: Conventional commits, feature-colocated components, `@/*` path alias

## Environment

See `.env.example` for required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` (for AI summarization)
