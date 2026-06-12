# Roadmap

> Current goals, future work, tech debt, and risk register.

## Active Phase: Phase 0 — Bootstrap & Setup

| Step | Status |
|------|--------|
| .devpartner/ state system | In progress |
| Scaffold folder structure | Pending |
| Install dependencies | Pending |
| Supabase project + Drizzle config | Pending |

## Planned Phases

| Phase | Description | Target |
|-------|-------------|--------|
| 1 | Database schema + Auth (Supabase, Drizzle, sign-up/sign-in/guest) | Next |
| 2 | Feed parsing engine (rss-parser, API routes, normalization) | After Phase 1 |
| 3 | TanStack Query data layer (hooks, optimistic updates, wire up UI) | After Phase 2 |
| 4 | Core features (feed management, categories, read tracking, reader view, search) | After Phase 3 |
| 5 | Landing page + Guest experience | After Phase 4 |
| 6 | AI Summarization differentiator | After Phase 5 |
| 7 | Polish (dark mode, keyboard nav, performance, a11y, deploy) | Final |

## Stretch / Backlog

- OPML import/export
- Email newsletter integration (differentiator)
- Reading analytics (differentiator)
- PWA offline support (differentiator)

## Tech Debt & Risk Register

| Item | Type | Impact | Mitigation |
|---|---|---|---|
| Feed sources may change URLs | Risk | Broken feeds | Feed health monitoring, error states in UI |
| OpenAI API costs for summarization | Risk | Unexpected expense | Cache summaries, rate-limit, configurable per-user |
| Supabase free tier limits | Risk | Row limits, auth users | Monitor usage, optimize queries for row efficiency |
