# Backend Implementation Plan: Frontpage RSS Aggregator

Based on the official `ARCHITECTURE.md` and project specifics, here is the robust, full-stack, scalable strategy to implement the backend for Frontpage.

## User Review Required

> [!IMPORTANT]  
> Please review this backend architecture plan. Let me know if you are comfortable proceeding with Supabase + Drizzle ORM, and if you have an existing Supabase project ready to connect, or if we should start by scaffolding the schemas and Next.js API routes locally first.

## Proposed Strategy & Architecture

The backend will strictly leverage the approved tech stack: **Next.js 14/15 App Router**, **Supabase** (Postgres + Auth), and **Drizzle ORM** for type-safe interactions. 

### 1. Database Layer (Supabase + PostgreSQL via Drizzle)

We need to persist the core entities cleanly, keeping long-term scalability in mind (like handling hundreds of feeds out-of-the-box).

*   **`users`**: We leverage Supabase's native Auth for users, pairing it with a `profiles` table to store application-level preferences (theme, layout preference).
*   **`feeds`**: Stores core feed definition such as `rss_url`, `title`, `description`, `health_status`, and `last_fetched_at`.
*   **`user_feeds` (Subscriptions/Categories)**: Junction mapping which user is subscribed to which feed, and uniquely assigning custom categories.
*   **`feed_items` (Articles)**: The actual parsed entries. We will store `guid`/`url` hashes to prevent duplicates.
*   **`user_interactions` (Reads & Bookmarks)**: Stores `is_read` and `is_bookmarked` explicitly tied to a `user_id` and `item_id`.

**Access Control**: Row-Level Security (RLS) on Supabase will prevent unauthorized users from seeing other people's feeds, bookmarks, or read states.

### 2. Authentication (Supabase Auth)

*   **Standard Users**: Email & password authentication.
*   **Guest Mode Users**: Utilize Supabase Anonymous logins. When a session starts, we assign default curated feeds (from `data/sample-feeds.json`) to their temporary user ID. If they later choose to sign up, Supabase permits upgrading an anonymous session to a permanent one without losing data.

### 3. Server-Side Fetching & CORS Handling

Browsers reject cross-origin RSS requests, so our Next.js backend serves as the proxy and normalization engine.

*   **Cron / Background Refreshes**: A Next.js API route (`/api/feeds/refresh`) will iterate over staled feeds, using `rss-parser`.
*   **Feed Normalization**: Incoming dirty XML/Atom payloads will be normalized into the strict `Article` TS interface before dumping into our Postgres DB.
*   **Edge Caching**: Proxied endpoints and parsed data will use `stale-while-revalidate` caching behaviors.

### 4. Client-Side Data State (TanStack Query)

While Technically frontend, this is deeply coupled to our API.

*   React Query will hydrate our UI.
*   *Crucial Feature*: **Optimistic Updates** — When a user marks a 1,000-word article as read or bookmarked, the UI updates instantly, while TanStack Query asynchronously validates the change with our Supabase/Next.js API.

## Implementation Phases (Execution Strategy)

If approved, we can organize our build into these logical phases (following your phased execution workflow rule):

1.  **Phase 1: DB & Auth Scaffolding** 
    *   Set up Drizzle ORM config and write the schemas.
    *   Initialize Supabase Auth components and Guest login flow.
2.  **Phase 2: The Parsing Engine**
    *   Implement `rss-parser` utility and API proxies capable of transforming varied XML feeds into the standardized `Article` format.
3.  **Phase 3: Client Sync & State** 
    *   Setup TanStack provider natively into the Next.js layouts, build the hooks for interactions (mark read, bookmark, paginate items).

## Open Questions

> [!WARNING]  
> 1. Do you already have a Supabase account and project provisioned for this? If yes, please provide the local environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
> 2. Are you ready for me to begin Phase 1 (writing the schema and auth initialization logic), or do you want to adjust any database fields?

## Verification Plan

### Automated / Syntax Tests
- Run `tsc` and ESLint after setting up the Drizzle schemas to verify perfectly inferred types.

### Manual Verification
1. We will verify Supabase Guest creation hits the DB correctly.
2. We will run an API route fetching one test feed locally, ensuring it bypasses CORS and properly populates local states.
