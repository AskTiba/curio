# Decisions Log

> Architecture, technology, and process decisions for Frontpage.

## Decision Records

| Date | Decision | Persona | Reasoning | Alternatives Considered | User Override? |
|---|---|---|---|---|---|
| 2026-06-12 | Supabase over Neon for database + auth | Staff Backend Engineer | Supabase provides built-in Auth (including anonymous/guest mode), RLS, and Postgres in one service. Guest mode is a core feature — anonymous auth maps directly to "Try as Guest." Neon would require a separate auth provider, adding complexity. | Neon (serverless Postgres only, no auth), Firebase (NoSQL, less type-safe with Drizzle) | No |
| 2026-06-12 | Feature-colocated component structure | Staff Frontend Architect | Each feature (feed, auth, categories, reader) owns its components under `components/features/`. Keeps related UI close without deep nesting. UI primitives stay in `components/ui/` for reuse. | Flat components/ directory (too many files at one level), domain-driven modules (heavier than needed) | No |
| 2026-06-12 | Route groups for auth vs dashboard | Staff Frontend Architect | `(auth)` and `(dashboard)` route groups keep auth pages (sign-in, sign-up, password-reset) cleanly separated from the main app without affecting URL structure. Standard Next.js App Router pattern. | Single flat pages/ directory (URL conflicts), nested under `app/` without groups (cluttered) | No |
| 2026-06-12 | AI Summarization as chosen differentiator | Staff Product Engineer | Pairs naturally with a feed reader — surfacing signal from volume. Strongest portfolio impact: demonstrates AI integration, API design, caching, and UX for latency-sensitive features. | Offline/PWA (complex service worker, less visible), Reading Analytics (good but additive, not transformative) | No |

## Git Conventions

| Aspect | Convention |
|---|---|
| Commit message format | Conventional Commits — `type: description`, ≤12 words, imperative |
| Commit types in use | feat, fix, refactor, docs, test, chore, build, perf, style, wip |
| Scopes used? | Yes — scopes from feature domains: `auth`, `db`, `feed`, `ui`, `api`, `ai` |
| Default branch | main |
| Branch naming convention | TBD — default to working on main for now |
| Force-push allowed on | Never without per-instance confirmation |
| Amend policy | Only for unpushed commits that are direct continuations/corrections |

## Dependencies Added

| Date | Package | Version | Reason | Vetted By |
|---|---|---|---|---|
| (pending) | @supabase/supabase-js | latest | Supabase client for browser + server | Staff Backend Engineer |
| (pending) | drizzle-orm, drizzle-kit | latest | Type-safe ORM for Postgres schema + migrations | Staff Backend Engineer |
| (pending) | postgres | latest | Postgres driver for Drizzle | Staff Backend Engineer |
| (pending) | rss-parser | latest | RSS/Atom feed parsing and normalization | Staff Backend Engineer |
| (pending) | @tanstack/react-query | latest | Client-side data fetching, caching, optimistic updates | Staff Frontend Architect |
| (pending) | openai | latest | AI summarization differentiator | Staff Backend Engineer |
| (pending) | sanitize-html | latest | Safe HTML rendering of feed content | Staff Security Engineer |
