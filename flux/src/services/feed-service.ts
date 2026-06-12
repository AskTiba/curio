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
        "User-Agent": "Frontpage/1.0 (RSS Feed Reader)",
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
  | { success: true; articles: Article[]; feedTitle: string; feedDescription?: string; siteUrl?: string; iconUrl?: string }
  | { success: false; error: string };

export async function fetchFeed(url: string): Promise<FetchResult> {
  try {
    const feed = await getParser().parseURL(url);

    const metadata = extractFeedMetadata(feed);
    const articles = normalizeFeed(feed, url);

    return {
      success: true,
      articles,
      feedTitle: metadata.title,
      feedDescription: metadata.description,
      siteUrl: metadata.siteUrl,
      iconUrl: metadata.iconUrl,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error parsing feed";

    if (message.includes("status code 404") || message.includes("404")) {
      return { success: false, error: "Feed URL returned 404 — it may have moved or been removed" };
    }
    if (message.includes("ENOTFOUND") || message.includes("getaddrinfo")) {
      return { success: false, error: "Could not reach the feed server — check the URL" };
    }
    if (message.includes("timeout") || message.includes("TIMEOUT")) {
      return { success: false, error: "Feed took too long to respond (10s timeout)" };
    }
    if (message.includes("status code 500") || message.includes("500")) {
      return { success: false, error: "Feed server returned a server error — try again later" };
    }
    if (message.includes("status code") || message.includes("4") || message.includes("5")) {
      return { success: false, error: `Feed returned HTTP error — ${message}` };
    }

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
