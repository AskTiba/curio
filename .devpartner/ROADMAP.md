# Roadmap

> Current goals, future work, tech debt, and risk register.

## Active Phase: Phase 4 — Core UI Features

| Step | Status |
|------|--------|
| .devpartner/ state system | Completed |
| Scaffold folder structure | Completed |
| Install dependencies | Completed |
| Supabase project + Drizzle config | Completed |
| Database schema + Auth (Supabase, Drizzle) | Completed |
| Feed parsing engine (rss-parser, API routes) | Completed |
| Build article Reader View UI | In progress |
| Design Saved, Digest, and Discover UI | Pending |
| Design Add Feed & Category Dialog UI | Pending |

## Planned Phases

| Phase | Description | Target |
|-------|-------------|--------|
| 3 | TanStack Query data layer (hooks, optimistic updates, wire up UI) | Deferred (Logic) |
| 4 | Core logic features (feed management CRUD, categories, read tracking) | Deferred (Logic) |
| 5 | Guest experience database seeding | Deferred (Logic) |
| 6 | AI Summarization differentiator | Pending |
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
