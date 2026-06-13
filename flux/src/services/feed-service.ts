import Parser from "rss-parser";
import { normalizeFeed, extractFeedMetadata } from "@/lib/feed-normalizer";
import type { Article } from "@/types";

type FeedParser = Parser<{
  customFields: {
    item?: string[];
  };
}>;

let parser: FeedParser | null = null;

function getParser(): FeedParser {
  if (!parser) {
    parser = new Parser({
      timeout: 10000,
      headers: {
        "User-Agent": "Curio/1.0 (RSS Feed Reader)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      customFields: {
        item: ["media:content", "media:thumbnail"],
      },
    });
  }
  return parser;
}

export type FetchResult =
  | { success: true; feedUrl: string; articles: Article[]; feedTitle: string; feedDescription?: string; siteUrl?: string; iconUrl?: string }
  | { success: false; error: string };

function discoverFeedUrl(html: string): string | null {
  const patterns = [
    /<link[^>]*?type=["']application\/rss\+xml["'][^>]*?href=["']([^"']+)["']/i,
    /<link[^>]*?href=["']([^"']+)["'][^>]*?type=["']application\/rss\+xml["']/i,
    /<link[^>]*?type=["']application\/atom\+xml["'][^>]*?href=["']([^"']+)["']/i,
    /<link[^>]*?href=["']([^"']+)["'][^>]*?type=["']application\/atom\+xml["']/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function attemptFetch(
  url: string
): Promise<{ feed: Awaited<ReturnType<ReturnType<typeof getParser>["parseURL"]>> | null; error?: string }> {
  try {
    const feed = await getParser().parseURL(url);
    return { feed };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error parsing feed";
    if (message.includes("ENOTFOUND") || message.includes("getaddrinfo")) {
      return { feed: null, error: "Could not reach the feed server — check the URL" };
    }
    if (message.includes("timeout") || message.includes("TIMEOUT")) {
      return { feed: null, error: "Feed took too long to respond (10s timeout)" };
    }
    return { feed: null, error: message };
  }
}

export async function fetchFeed(url: string): Promise<FetchResult> {
  const first = await attemptFetch(url);
  if (first.feed) {
    const metadata = extractFeedMetadata(first.feed);
    const articles = normalizeFeed(first.feed, url);
    return {
      success: true,
      feedUrl: url,
      articles,
      feedTitle: metadata.title,
      feedDescription: metadata.description,
      siteUrl: metadata.siteUrl,
      iconUrl: metadata.iconUrl,
    };
  }

  const errMsg = first.error ?? "";

  // Network-level errors — no point attempting autodiscovery
  if (errMsg.includes("ENOTFOUND") || errMsg.includes("getaddrinfo")) {
    return { success: false, error: "Could not reach the feed server — check the URL" };
  }
  if (errMsg.includes("timeout") || errMsg.includes("TIMEOUT")) {
    return { success: false, error: "Feed took too long to respond (10s timeout)" };
  }

  // Real HTTP status code errors (4xx / 5xx) — match only actual codes, not
  // stray digits in XML parser messages like "Column: 9274"
  if (/status code [45]\d{2}/.test(errMsg)) {
    const statusMatch = errMsg.match(/status code (\d{3})/);
    const code = statusMatch ? statusMatch[1] : "";
    if (code === "404") {
      return { success: false, error: "Feed URL returned 404 — it may have moved or been removed" };
    }
    if (code.startsWith("5")) {
      return { success: false, error: "Feed server returned a server error — try again later" };
    }
    return { success: false, error: `Feed returned HTTP ${code} error — ${errMsg}` };
  }

  // Not valid XML — try autodiscovery: fetch as HTML and look for <link> tags
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Curio/1.0 (RSS Feed Reader)",
        Accept: "text/html, */*",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      return { success: false, error: `Page returned HTTP ${res.status} — check the URL` };
    }
    const html = await res.text();
    const discovered = discoverFeedUrl(html);
    if (!discovered) {
      return {
        success: false,
        error: "Could not find an RSS or Atom feed link on this page. Try pasting the feed URL directly.",
      };
    }
    const resolved = new URL(discovered, url).toString();
    const second = await attemptFetch(resolved);
    if (!second.feed) {
      return {
        success: false,
        error: "Found a feed link on the page but could not parse it. Try pasting the feed URL directly.",
      };
    }
    const metadata = extractFeedMetadata(second.feed);
    const articles = normalizeFeed(second.feed, resolved);
    return {
      success: true,
      feedUrl: resolved,
      articles,
      feedTitle: metadata.title,
      feedDescription: metadata.description,
      siteUrl: metadata.siteUrl,
      iconUrl: metadata.iconUrl,
    };
  } catch {
    return {
      success: false,
      error: "Could not parse this URL as an RSS or Atom feed",
    };
  }
}

export async function validateFeedUrl(url: string): Promise<
  { valid: true; title: string; description?: string } | { valid: false; error: string }
> {
  try {
    new URL(url);
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }

  const result = await fetchFeed(url);
  if (!result.success) {
    return { valid: false, error: result.error };
  }

  return {
    valid: true,
    title: result.feedTitle,
    description: result.feedDescription,
  };
}
