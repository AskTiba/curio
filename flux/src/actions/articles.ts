"use server";

import { db } from "@/db";
import { feedItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const SUMMARY_THRESHOLD = 500;

export async function getFullArticleContent(
  articleId: string,
  url: string
): Promise<{ content: string; fetched: boolean }> {
  const existing = await db
    .select({ content: feedItems.content })
    .from(feedItems)
    .where(eq(feedItems.id, articleId))
    .limit(1);

  const stored = existing[0]?.content ?? "";

  if (stored.length > SUMMARY_THRESHOLD) {
    return { content: stored, fetched: false };
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Curio/1.0 (RSS Feed Reader)",
        Accept: "text/html, */*",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return { content: stored || "", fetched: false };
    }

    const html = await res.text();
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    const extracted = article?.content?.trim() ?? "";

    if (extracted.length > SUMMARY_THRESHOLD) {
      await db
        .update(feedItems)
        .set({ content: extracted })
        .where(eq(feedItems.id, articleId));

      return { content: extracted, fetched: true };
    }

    return { content: stored || "", fetched: false };
  } catch {
    return { content: stored || "", fetched: false };
  }
}
