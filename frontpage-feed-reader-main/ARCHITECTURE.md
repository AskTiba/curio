# Project Architecture: Frontpage

This document outlines the technical stack and architectural decisions for the Frontpage RSS aggregator. These choices prioritize type safety, developer velocity, and a high-performance "Guest Experience."

## 1. Core Framework & Language
- **Next.js 14/15 (App Router)**: Utilizes Server Components (RSC) for initial data fetching and SEO, and Client Components for interactivity (bookmarks, search, layout toggles).
- **TypeScript**: Strict mode enabled. Standardizes data shapes for RSS/Atom feeds across the entire application.

## 2. Backend & Persistence (BaaS)
- **Supabase**: 
  - **PostgreSQL**: Relational storage for `Users`, `Feeds`, `Articles`, and `Bookmarks`.
  - **Auth**: Email/Password and Anonymous sign-ins for "Guest Mode."
  - **RLS (Row Level Security)**: Protects user-specific data (read/unread states) at the database level.
- **Drizzle ORM**: A lightweight, TypeScript-first ORM for type-safe database migrations and queries.

## 3. Data Layer & Fetching
- **Server-Side Feed Parsing**: 
  - **`rss-parser`**: Handles the heavy lifting of normalizing disparate RSS/Atom XML formats into a unified JSON structure.
  - **Next.js Route Handlers**: Act as a CORS proxy for client-side feed refreshes.
- **TanStack Query (React Query)**: 
  - Manages client-side state for feed items.
  - Handles background synchronization and caching.
  - Implements **Optimistic Updates** for UI actions (e.g., marking as read).

## 4. Design & Styling
- **Tailwind CSS v4**: Leveraging the new native CSS variable support to integrate the provided `tokens.css`.
- **Lucide React**: Icon library for a clean, consistent UI.
- **Inter & Georgia Fonts**: Per the brand kit, Inter for UI/Headings and Georgia for the "Reader View."

## 5. Architectural Patterns

### Feed Normalization
All incoming data from `rss-parser` is mapped to a strictly typed `Article` interface before reaching the UI:
```typescript
interface Article {
  id: string; // Hash of link/title for deduplication
  title: string;
  excerpt: string;
  content?: string;
  author?: string;
  publishedAt: Date;
  sourceFeedId: string;
  url: string;
  thumbnailUrl?: string;
}
```

### Guest Mode Strategy
- Guests are assigned a Supabase Anonymous session.
- A "curated" set of Feed IDs (from `data/sample-feeds.json`) is automatically associated with their session upon clicking "Try as Guest."
- Guest data (read states, bookmarks) is stored in the real DB but scoped to their temporary UID.

### Performance Optimizations
- **Edge Caching**: Parsed feed results are cached at the Edge (using `stale-while-revalidate`) to minimize external network requests.
- **Virtualized Lists**: Essential for the "100+ items" smooth scrolling requirement.
- **Optimistic UI**: Interactions like "Bookmark" or "Mark as Read" trigger immediate UI updates while the background request is in flight.
