# Frontpage — Tibamwenda Anthony

A customizable content aggregator that pulls RSS and Atom feeds into one well-designed reading dashboard. Built with a focus on typography, information density, and a calm, content-first user experience.

![Screenshot of your solution](./preview.jpg)

---

## Overview

Frontpage is a modern RSS reader designed to cut through the noise of the modern web. It provides a clean, fast, and organized interface for tracking blogs, news, and newsletters. Users can securely log in, subscribe to any valid RSS/Atom feed, automatically discover feeds from standard blog URLs, and categorize their reading list to suit their workflow.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Database | PostgreSQL (via Supabase) + Drizzle ORM |
| Authentication | Supabase SSR Auth |
| Hosting | Vercel (Recommended) |
| Styling | Tailwind CSS v4 + Lucide Icons |
| RSS Parsing | `rss-parser` + Custom Auto-Discovery Logic |
| Data Fetching| TanStack Query (React Query) |

---

## Design Decisions

These are the product and design choices I made where the spec left room for interpretation.

### Content Discovery & Onboarding

**The problem I was solving:** Getting users to successfully add feeds quickly without needing to hunt down raw `.xml` URLs themselves.

**My approach:** I built a custom Feed Auto-Discovery pipeline. Users can simply paste a normal blog URL (e.g. `https://expo.dev/blog`), and the server automatically fetches the page HTML, parses the `<link rel="alternate" type="application/rss+xml">` tags, and resolves the real feed URL.

**Why I chose this approach:** Most non-technical users don't know what an RSS feed is or how to find the exact `.xml` link. Dropping a standard URL is the modern expected behavior for any feed reader.

### Layout Customization

**The problem I was solving:** Allowing users to organize their feeds dynamically without confusing UI clutter.

**My approach:** Implemented an intuitive sidebar with categorized grouping. Users can create custom categories (complete with color coding) and easily re-assign feeds to different categories via a sleek hover-based dropdown menu.

**Why I chose this approach:** It keeps the sidebar incredibly clean while still offering power-user organization capabilities right where the user expects them.

---

## Development Journey

### Initial Approach vs. Final

Initially, I planned to handle all database fetching directly within Server Components to leverage Next.js 15's React Server Components. However, because feed reading requires highly interactive, client-side state (like marking items as read or dynamically moving them between categories), I pivoted to using **TanStack Query** alongside Next.js Server Actions. This provided the perfect blend of secure server-side database access with snappy, optimistic client-side UI updates.

### Decisions Reconsidered

Next.js aggressive caching for Server Actions caused issues where the UI wouldn't reflect newly categorized feeds even after a refresh. I had to explicitly implement `revalidatePath` inside my Server Actions to purge the Next.js router cache, ensuring that the client always receives the absolute latest data from the database.

---

## AI Collaboration Reflection

### How I Used AI

I utilized an AI coding assistant to rapidly scaffold complex infrastructure like the Supabase SSR authentication middleware, the Drizzle ORM schemas, and the tricky RSS parsing logic. 

### What Worked Well

Iterating on the UI polish was incredibly fast. By instructing the AI on the exact aesthetic I wanted (e.g., specific gradients, shadow layers, and hover micro-interactions), I was able to rapidly craft a premium-feeling application without manually tweaking Tailwind classes for hours.

### Where I Pushed Back

When dealing with data synchronization bugs between the client and server, the AI initially assumed the database update failed. I had to push back and guide the AI to realize it was actually a Next.js Server Action caching issue.

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/yourusername/frontpage-feed-reader.git
cd frontpage-feed-reader/flux

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

You will need a Supabase project set up for this application.

| Variable | Description |
|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase public anonymous key |
| `DATABASE_URL` | Your Supabase PostgreSQL connection string (Transaction Pooler recommended) |

```bash
# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Acknowledgments

Built as a [Frontend Mentor Product Challenge](https://www.frontendmentor.io).
