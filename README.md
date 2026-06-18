# Curio — RSS Feed Reader

A modern feed reader with dark mode, bookmarking, full-text search, and an AI-powered daily digest. Built for readers who want a calm, organized, content-first experience.

## Features

- **Feed auto-discovery** — subscribe using any blog URL; Curio automatically resolves the RSS/Atom feed
- **Dark & light themes** — midnight dark palette with system preference detection and localStorage persistence, zero flash on reload
- **Full-text search** — debounced search across article titles, excerpts, and authors
- **Bookmarking** — optimistic updates with a dedicated `/saved` page grouped by This Week / Earlier
- **Read/unread tracking** — accurate sidebar counts using real `COUNT(*)` queries, per-feed and per-category
- **Multiple view modes** — list, compact, and grid layouts with thumbnail support
- **Categorization** — custom categories with color coding; drag-free feed assignment via hover menu
- **AI Digest** — daily AI-generated summary of top stories across your categories
- **Feed discovery** — browse and discover new feeds to follow

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | PostgreSQL (Supabase) + Drizzle ORM |
| Authentication | Supabase SSR Auth |
| Hosting | Vercel (Hobby) |
| Styling | Tailwind CSS v4 + Lucide Icons |
| State Management | TanStack Query (React Query) |
| RSS Parsing | `rss-parser` + custom auto-discovery |

## Architecture Highlights

- **Server Actions + TanStack Query** — secure server-side DB access with optimistic client-side UI updates and cache invalidation
- **Custom feed auto-discovery** — fetches page HTML, parses `<link rel="alternate">`, resolves the real feed URL
- **Type-safe SQL** — Drizzle ORM with explicit `sql` templates to avoid type-coercion bugs on UUID and boolean columns
- **Dark mode** — CSS custom properties with a single `.dark` class override on `<html>`; inline blocking script prevents flash
- **Performance** — cursor-based pagination, batch feed refresh with client-side dedup, debounced search

## Getting Started

```bash
# Clone the repo
git clone https://github.com/AskTiba/curio.git
cd curio/flux

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your Supabase public anonymous key |
| `DATABASE_URL` | Your Supabase PostgreSQL connection string |

```bash
# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Deploy to Vercel with the environment variables above. The `vercel-build` script automatically runs `drizzle-kit push` when `DATABASE_URL` is present, so schema migrations are applied during build.

## Acknowledgments

Built as a [Frontend Mentor Product Challenge](https://www.frontendmentor.io).
