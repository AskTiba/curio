"use server";

import { db } from "@/db";
import { feedItems } from "@/db/schema";
import { sql } from "drizzle-orm";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const SUMMARY_THRESHOLD = 500;

const BAD_CONTENT_PATTERNS = [
  /page\s+not\s+found/i,
  /\b404\b/,
  /enable\s+(javascript|js|cookies)/i,
];

function hasBadContent(text: string): boolean {
  return BAD_CONTENT_PATTERNS.some((p) => p.test(text));
}

function isLinkDense(html: string): boolean {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const allText = doc.body.textContent || "";
  if (allText.length < 100) return true;
  const links = [...doc.body.querySelectorAll("a")];
  const linkText = links.reduce((s, a) => s + (a.textContent || ""), "");
  return linkText.length / allText.length > 0.5;
}

function hasCoherentContent(text: string): boolean {
  const sentences = text.split(/[.!?]+\s/).filter((s) => s.trim().split(/\s+/).length >= 5);
  return sentences.length >= 2;
}

async function fetchWithTimeout(url: string, ms: number): Promise<{ html: string; ok: boolean }> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; Curio/1.0; +https://curio.app)",
      Accept: "text/html, application/xhtml+xml",
    },
    signal: AbortSignal.timeout(ms),
  });
  if (!res.ok) return { html: "", ok: false };
  return { html: await res.text(), ok: true };
}

function extractViaReadability(html: string, url: string): string | null {
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  return article?.content?.trim() ?? null;
}

function extractViaArticleTag(html: string): string | null {
  const dom = new JSDOM(html);
  const el = dom.window.document.querySelector("article");
  return el && el.innerHTML.trim().length > SUMMARY_THRESHOLD ? el.innerHTML.trim() : null;
}

function isValidContent(html: string): boolean {
  if (html.length <= SUMMARY_THRESHOLD) return false;
  const dom = new JSDOM(html);
  const text = dom.window.document.body.textContent || "";
  if (!text.trim()) return false;
  if (hasBadContent(text)) return false;
  if (isLinkDense(html)) return false;
  if (!hasCoherentContent(text)) return false;
  return true;
}

export async function getFullArticleContent(
  articleId: string,
  url: string
): Promise<{ content: string; fetched: boolean; invalid?: boolean }> {
  try {
    const existing = await db
      .select({ content: feedItems.content })
      .from(feedItems)
      .where(sql`${feedItems.id}::text = ${articleId}`)
      .limit(1);

    const stored = existing[0]?.content ?? "";
    const storedIsGood = stored.length > SUMMARY_THRESHOLD && isValidContent(stored);

    if (storedIsGood) {
      return { content: stored, fetched: false };
    }

    const { html, ok } = await fetchWithTimeout(url, 8000);
    if (!ok) {
      return { content: "", fetched: false, invalid: !storedIsGood && stored.length > SUMMARY_THRESHOLD };
    }

    const extracted = extractViaReadability(html, url) ?? extractViaArticleTag(html);

    if (extracted && isValidContent(extracted)) {
      await db
        .update(feedItems)
        .set({ content: extracted })
        .where(sql`${feedItems.id}::text = ${articleId}`);
      return { content: extracted, fetched: true };
    }

    return { content: "", fetched: false, invalid: !storedIsGood && stored.length > SUMMARY_THRESHOLD };
  } catch (error) {
    console.error("[getFullArticleContent] Failed:", error);
    return { content: "", fetched: false, invalid: false };
  }
}
