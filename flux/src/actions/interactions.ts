"use server";

import { db } from "@/db";
import { userInteractions, feedItems, userFeeds } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getUserId() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  return user.id;
}

export async function toggleItemRead(itemId: string, isRead: boolean) {
  const userId = await getUserId();
  
  await db.insert(userInteractions).values({
    userId,
    itemId,
    isRead,
    readAt: isRead ? new Date() : null,
  }).onConflictDoUpdate({
    target: [userInteractions.userId, userInteractions.itemId],
    set: { 
      isRead, 
      readAt: isRead ? new Date() : null,
      updatedAt: new Date()
    }
  });
}

export async function markAllAsRead() {
  const userId = await getUserId();

  const userFeedRecords = await db
    .select({ feedId: userFeeds.feedId })
    .from(userFeeds)
    .where(eq(userFeeds.userId, userId));
    
  if (userFeedRecords.length === 0) return;
  const feedIds = userFeedRecords.map(r => r.feedId);

  const items = await db
    .select({ id: feedItems.id })
    .from(feedItems)
    .where(inArray(feedItems.feedId, feedIds));

  if (items.length === 0) return;

  const now = new Date();
  
  const batch = items.map(item => ({
    userId,
    itemId: item.id,
    isRead: true,
    readAt: now,
    updatedAt: now
  }));

  // Chunk array to avoid postgres parameter limits
  const chunkSize = 1000;
  for (let i = 0; i < batch.length; i += chunkSize) {
    const chunk = batch.slice(i, i + chunkSize);
    await db.insert(userInteractions)
      .values(chunk)
      .onConflictDoUpdate({
        target: [userInteractions.userId, userInteractions.itemId],
        set: {
          isRead: true,
          readAt: now,
          updatedAt: now
        }
      });
  }

  revalidatePath("/", "layout");
}
