import type { Article } from "@/types";

interface RawFeedItem {
  title?: string | null;
  link?: string | null;
  guid?: string | null;
  pubDate?: string | null;
  isoDate?: string | null;
  content?: string | null;
  contentSnippet?: string | null;
  summary?: string | null;
  creator?: string | null;
  "dc:creator"?: string | null;
  enclosure?: { url?: string } | null;
  media?: { content?: { url?: string }[]; thumbnail?: { url?: string }[] } | null;
}

interface RawFeedOutput {
  title?: string | null;
  description?: string | null;
  link?: string | null;
  image?: { url?: string } | null;
  items?: RawFeedItem[];
}

function normalizeDate(dateStr: string | null | undefined): Date | undefined {
  if (!dateStr) return undefined;

  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
  } catch {
    // fall through
  }

  return undefined;
}

function stripHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code)));
}

function extractText(raw: string | null | undefined): string {
  if (!raw) return "";
  return stripHtmlEntities(raw).trim();
}

export function normalizeFeed(
  feed: RawFeedOutput,
  sourceFeedId: string
): Article[] {
  if (!feed.items || feed.items.length === 0) return [];

  const seenGuids = new Set<string>();

  const results: Article[] = [];

  for (const item of feed.items) {
    const url = extractText(item.link) || extractText(item.guid);
    const title = extractText(item.title) || "Untitled";
    const guid = extractText(item.guid) || url;

    if (seenGuids.has(guid)) continue;
    seenGuids.add(guid);

    const excerpt =
      extractText(item.contentSnippet) ||
      extractText(item.summary) ||
      (item.content ? stripHtmlEntities(item.content).substring(0, 300).trim() : "") ||
      "";

    const author =
      extractText(item.creator) || extractText(item["dc:creator"]) || undefined;

    const thumbnailUrl =
      item.enclosure?.url ??
      item.media?.content?.[0]?.url ??
      item.media?.thumbnail?.[0]?.url ??
      undefined;

    const publishedAt = normalizeDate(item.isoDate ?? item.pubDate);

    results.push({
      id: guid,
      title,
      excerpt: excerpt.substring(0, 500),
      content: item.content ?? item.summary ?? undefined,
      author,
      publishedAt,
      sourceFeedId,
      url,
      thumbnailUrl,
      isRead: false,
      isBookmarked: false,
    });
  }

  return results;
}

export function extractFeedMetadata(feed: RawFeedOutput) {
  return {
    title: extractText(feed.title) || "Unknown Feed",
    description: extractText(feed.description) || undefined,
    siteUrl: extractText(feed.link) || undefined,
    iconUrl: feed.image?.url || undefined,
  };
}
