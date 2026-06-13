"use client";

import { useFeedItems } from "@/hooks/useFeeds";
import { FeedItem } from "@/components/features/feed/FeedItem";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDistanceToNow } from "date-fns";

export function FeedList() {
  const { data: items, isLoading, isError } = useFeedItems();

  if (isLoading) {
    return (
      <div className="flex flex-col">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-4 py-4 border-b border-border">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-error">
        <p>Failed to load feed items.</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="p-12 text-center text-text-tertiary">
        <p className="font-semibold mb-2">No articles yet.</p>
        <p className="text-sm">Add some feeds to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-7 pt-4">
        <h3 className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em]">
          Latest
        </h3>
      </div>
      
      {items.map((item) => {
        const publishedDate = item.publishedAt ? new Date(item.publishedAt) : new Date();
        const timestamp = formatDistanceToNow(publishedDate, { addSuffix: true });
        
        return (
          <FeedItem
            key={item.id}
            id={item.id}
            source={item.feedTitle || "Unknown Source"}
            sourceColor="bg-blue-500" // You could hash the title to a color
            timestamp={timestamp}
            title={item.title}
            excerpt={item.excerpt || item.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..." || ""}
            category={item.categoryName || "Uncategorized"}
            categoryVariant="default"
            isRead={item.isRead}
          />
        );
      })}
    </div>
  );
}
