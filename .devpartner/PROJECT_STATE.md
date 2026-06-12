# Project State: Frontpage

## Current Status

Auth system built. Users can sign up, sign in, reset passwords, or browse as guest. Middleware refreshes sessions. Landing page with dual CTAs routes to feed dashboard or auth pages.

## What Currently Works

- **Auth**: Sign-up, sign-in, password-reset, anonymous guest mode via Supabase
- **Session**: Cookie-based session refresh via SSR middleware
- **Landing page**: Hero with "Create Account" and "Try as Guest" CTAs
- **Dashboard**: Full UI shell matching `preview.jpg`
- **Database**: 7 tables migrated to Supabase (profiles, feeds, feed_items, categories, user_feeds, user_interactions, user_preferences)
- **UI components**: TopNav, Sidebar, FeedHeader, FeedItem, Badge, Button, Card, Skeleton
- **Git**: Clean, 2 commits in history

## In Progress

| Item | Owner | Next Step | Status |
|------|-------|-----------|--------|
| **Phase 2: Feed Parsing** | Backend Eng | Build rss-parser service + API routes | **Ready to start** |
| Phase 3: TanStack Query | Frontend Arch | Hooks, wire data to UI | Pending Phase 2 |
| Phase 4: Core features | Full-stack | Feed CRUD, categories, reader, search | Pending Phase 3 |
| Phase 5: Guest seeding | Full-stack | Seed guest with 19 feeds | Pending Phase 2 |
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
