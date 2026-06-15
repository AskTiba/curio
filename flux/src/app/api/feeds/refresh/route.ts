import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { fetchFeed } from "@/services/feed-service";
import { db } from "@/db";
import { feeds, feedItems, userFeeds } from "@/db/schema";
import { eq, and, inArray, sql } from "drizzle-orm";

export const maxDuration = 60;

type FeedRow = { feed: typeof feeds.$inferSelect };

async function refreshSingleFeed(feed: typeof feeds.$inferSelect) {
  const result = await fetchFeed(feed.url);
  const status = result.success ? "healthy" : "error";

  await db
    .update(feeds)
    .set({
      status,
      lastFetchedAt: new Date(),
      errorMessage: result.success ? null : result.error,
      title: result.success ? result.feedTitle : feed.title,
      description: result.success ? (result.feedDescription ?? feed.description) : feed.description,
      updatedAt: new Date(),
    })
    .where(eq(feeds.id, feed.id));

  if (!result.success) {
    return { feedId: feed.id, title: feed.title ?? "Unknown", newItems: 0, error: result.error };
  }

  const articleUrls = result.articles.map(a => a.url);

  const existingItems = articleUrls.length > 0
    ? await db
        .select({ url: feedItems.url })
        .from(feedItems)
        .where(
          and(
            eq(feedItems.feedId, feed.id),
            inArray(feedItems.url, articleUrls)
          )
        )
    : [];

  const existingUrls = new Set(existingItems.map(i => i.url));
  const newArticles = result.articles.filter(a => !existingUrls.has(a.url));

  if (newArticles.length > 0) {
    await db.insert(feedItems).values(
      newArticles.map((article) => ({
        feedId: feed.id,
        guid: article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        url: article.url,
        thumbnailUrl: article.thumbnailUrl,
        publishedAt: article.publishedAt ?? null,
      }))
    );
  }

  return {
    feedId: feed.id,
    title: result.feedTitle,
    newItems: newArticles.length,
    error: undefined as string | undefined,
  };
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { feedId } = await request.json();

  const conditions = [eq(userFeeds.userId, user.id)];
  if (feedId) {
    conditions.push(eq(feeds.id, feedId));
  }

  const userFeed: FeedRow[] = await db
    .select({ feed: feeds })
    .from(userFeeds)
    .innerJoin(feeds, eq(userFeeds.feedId, feeds.id))
    .where(and(...conditions));

  if (userFeed.length === 0) {
    return NextResponse.json({ error: "No feeds found" }, { status: 404 });
  }

  const settled = await Promise.allSettled(
    userFeed.map(({ feed }) => refreshSingleFeed(feed))
  );

  const results = settled.map((s) => {
    if (s.status === "fulfilled") return s.value;
    const reason = s.reason instanceof Error ? s.reason.message : "Unknown error";
    return { feedId: "", title: "Unknown", newItems: 0, error: reason };
  });

  return NextResponse.json({ results });
}
