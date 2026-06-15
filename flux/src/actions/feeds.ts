"use server";

import { db } from "@/db";
import { feeds, userFeeds, feedItems, userInteractions, categories } from "@/db/schema";
import { eq, and, or, ilike, lt, gt, desc, asc, inArray, sql } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type FeedQueryParams = {
  limit?: number;
  cursor?: string;
  search?: string;
  feedId?: string;
  categoryId?: string;
  isRead?: boolean;
  isBookmarked?: boolean;
  sort?: "newest" | "oldest";
};

/**
 * Gets the current authenticated user's ID
 */
async function getUserId() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  return user.id;
}

/**
 * Fetches all feeds subscribed to by the current user.
 * Returns an empty array when not authenticated or on DB errors
 * so the UI renders the empty state instead of an error screen.
 */
export async function getUserFeeds() {
  try {
    const userId = await getUserId();
    
    const result = await db
      .select({
        id: feeds.id,
        url: feeds.url,
        title: sql<string>`COALESCE(${userFeeds.customTitle}, ${feeds.title})`,
        description: feeds.description,
        siteUrl: feeds.siteUrl,
        iconUrl: feeds.iconUrl,
        status: feeds.status,
        lastFetchedAt: feeds.lastFetchedAt,
        categoryId: userFeeds.categoryId,
      })
      .from(userFeeds)
      .innerJoin(feeds, eq(userFeeds.feedId, feeds.id))
      .where(eq(userFeeds.userId, userId));
      
    return result;
  } catch (error) {
    console.error("[getUserFeeds] Failed:", error);
    return [];
  }
}

export type FeedItemResult = {
  id: string;
  feedId: string;
  guid: string | null;
  title: string;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  url: string;
  thumbnailUrl: string | null;
  publishedAt: Date | null;
  isRead: boolean;
  isBookmarked: boolean;
  feedTitle: string | null;
  feedIcon: string | null;
  categoryName: string | null;
};

export type GetFeedItemsResult = {
  items: FeedItemResult[];
  nextCursor: string | null;
};

/**
 * Fetches feed items across all the user's subscribed feeds
 * with optional search, filter, sort, and cursor-based pagination.
 */
export async function getFeedItems(params: FeedQueryParams = {}): Promise<GetFeedItemsResult> {
  const { limit = 30, cursor, search, feedId, categoryId, isRead, isBookmarked, sort = "newest" } = params;

  try {
    const userId = await getUserId();

    const userFeedRecords = await db
      .select({ feedId: userFeeds.feedId })
      .from(userFeeds)
      .where(eq(userFeeds.userId, userId));

    if (userFeedRecords.length === 0) return { items: [], nextCursor: null };

    const feedIds = userFeedRecords.map(r => r.feedId);

    const conditions = [
      inArray(feedItems.feedId, feedIds),
    ];

    if (feedId) {
      conditions.push(eq(feedItems.feedId, feedId));
    }

    if (categoryId) {
      conditions.push(eq(userFeeds.categoryId, categoryId));
    }

    if (search) {
      const pattern = `%${search}%`;
      conditions.push(
        sql`(${ilike(feedItems.title, pattern)} OR ${ilike(feedItems.excerpt, pattern)} OR ${ilike(feedItems.author, pattern)})`
      );
    }

    if (isRead === true) {
      conditions.push(sql`COALESCE(${userInteractions.isRead}, false) = true`);
    } else if (isRead === false) {
      conditions.push(sql`COALESCE(${userInteractions.isRead}, false) = false`);
    }

    if (isBookmarked === true) {
      conditions.push(sql`COALESCE(${userInteractions.isBookmarked}, false) = true`);
    } else if (isBookmarked === false) {
      conditions.push(sql`COALESCE(${userInteractions.isBookmarked}, false) = false`);
    }

    if (cursor) {
      const cursorDate = new Date(cursor);
      if (sort === "oldest") {
        conditions.push(gt(feedItems.publishedAt, cursorDate));
      } else {
        conditions.push(lt(feedItems.publishedAt, cursorDate));
      }
    }

    const orderByClause = sort === "oldest"
      ? sql`${feedItems.publishedAt} ASC NULLS LAST`
      : sql`${feedItems.publishedAt} DESC NULLS LAST`;

    const items = await db
      .select({
        id: feedItems.id,
        feedId: feedItems.feedId,
        guid: feedItems.guid,
        title: feedItems.title,
        excerpt: feedItems.excerpt,
        content: feedItems.content,
        author: feedItems.author,
        url: feedItems.url,
        thumbnailUrl: feedItems.thumbnailUrl,
        publishedAt: feedItems.publishedAt,
        isRead: sql<boolean>`COALESCE(${userInteractions.isRead}, false)`,
        isBookmarked: sql<boolean>`COALESCE(${userInteractions.isBookmarked}, false)`,
        feedTitle: feeds.title,
        feedIcon: feeds.iconUrl,
        categoryName: categories.name,
      })
      .from(feedItems)
      .innerJoin(feeds, eq(feedItems.feedId, feeds.id))
      .innerJoin(userFeeds, and(eq(userFeeds.feedId, feeds.id), eq(userFeeds.userId, userId)))
      .leftJoin(categories, eq(userFeeds.categoryId, categories.id))
      .leftJoin(
        userInteractions,
        and(
          eq(userInteractions.itemId, feedItems.id),
          eq(userInteractions.userId, userId)
        )
      )
      .where(and(...conditions))
      .orderBy(orderByClause)
      .limit(limit + 1);

    const hasMore = items.length > limit;
    const pageItems = hasMore ? items.slice(0, limit) : items;
    const lastItem = pageItems[pageItems.length - 1];
    const nextCursor = hasMore && lastItem?.publishedAt
      ? lastItem.publishedAt.toISOString()
      : null;

    return { items: pageItems, nextCursor };
  } catch (error) {
    console.error("[getFeedItems] Failed:", error);
    return { items: [], nextCursor: null };
  }
}

/**
 * Adds a new feed for the user
 */
export async function addFeed(url: string, categoryId?: string) {
  const userId = await getUserId();
  
  // Clean URL
  const trimmedUrl = url.trim();

  // Validate and parse the feed
  // We'll import dynamically to avoid client-side bundling issues if this is ever accidentally imported there
  const { fetchFeed } = await import("@/services/feed-service");
  const result = await fetchFeed(trimmedUrl);
  
  if (!result.success) {
    throw new Error(result.error);
  }

  // Use the resolved feed URL (may differ from input after autodiscovery,
  // e.g. user enters "https://expo.dev/blog" → resolved to "https://expo.dev/blog/rss.xml")
  const resolvedUrl = result.feedUrl;

  // 1. Upsert the Feed into the `feeds` table
  let feedRecord = await db.query.feeds.findFirst({
    where: eq(feeds.url, resolvedUrl),
  });

  if (!feedRecord) {
    const [newFeed] = await db.insert(feeds).values({
      url: resolvedUrl,
      title: result.feedTitle,
      description: result.feedDescription,
      siteUrl: result.siteUrl,
      iconUrl: result.iconUrl,
      status: "healthy",
      lastFetchedAt: new Date(),
    }).returning();
    feedRecord = newFeed;
    
    if (!feedRecord) throw new Error("Failed to insert feed");

    // 1b. Insert initial items for a brand new feed
    if (result.articles.length > 0) {
      await db.insert(feedItems).values(
        result.articles.map((item) => ({
          feedId: feedRecord!.id,
          guid: item.id,
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          author: item.author,
          url: item.url,
          thumbnailUrl: item.thumbnailUrl,
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
        }))
      ).onConflictDoNothing(); // Ignore duplicates by guid
    }
  }

  if (!feedRecord) throw new Error("Feed record is missing");

  // 2. Link feed to the user
  await db.insert(userFeeds).values({
    userId,
    feedId: feedRecord.id,
    categoryId: categoryId || null,
  }).onConflictDoNothing();

  revalidatePath("/", "layout");
  return feedRecord;
}

/**
 * Updates the category of a specific feed for the user
 */
export async function updateFeedCategory(feedId: string, categoryId: string | null) {
  const userId = await getUserId();
  
  await db.update(userFeeds)
    .set({ categoryId })
    .where(
      and(
        eq(userFeeds.userId, userId),
        eq(userFeeds.feedId, feedId)
      )
    );

  revalidatePath("/", "layout");
}
