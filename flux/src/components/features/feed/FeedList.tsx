"use client";

import { useState } from "react";
import { useFeedItems } from "@/hooks/useFeeds";
import { FeedItem } from "@/components/features/feed/FeedItem";
import { ArticleReaderModal } from "@/components/features/feed/ArticleReaderModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDistanceToNow } from "date-fns";

import { useMarkAllAsRead } from "@/hooks/useInteractions";
import { CheckCheck } from "lucide-react";

interface SelectedArticle {
  title: string;
  content: string;
  url?: string | null;
  author?: string | null;
  publishedAt?: Date | null;
  source: string;
}

export function FeedList() {
  const { data: items, isLoading, isError } = useFeedItems();
  const { mutate: markAllAsRead, isPending: isMarkingRead } = useMarkAllAsRead();
  const [selectedArticle, setSelectedArticle] = useState<SelectedArticle | null>(null);

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

  const unreadCount = items.filter(i => !i.isRead).length;

  return (
    <>
      <div className="flex flex-col">
        <div className="px-7 pt-4 pb-2 flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em]">
            Latest
          </h3>
          {unreadCount > 0 && (
            <button 
              onClick={() => markAllAsRead()}
              disabled={isMarkingRead}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          )}
        </div>
        
        {items.map((item) => {
          const publishedDate = item.publishedAt ? new Date(item.publishedAt) : new Date();
          const timestamp = formatDistanceToNow(publishedDate, { addSuffix: true });
          
          return (
            <FeedItem
              key={item.id}
              id={item.id}
              source={item.feedTitle || "Unknown Source"}
              sourceColor="bg-blue-500"
              timestamp={timestamp}
              title={item.title}
              excerpt={item.excerpt || item.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..." || ""}
              category={item.categoryName || "Uncategorized"}
              categoryVariant="default"
              isRead={item.isRead}
              isBookmarked={item.isBookmarked}
              onOpenArticle={() => setSelectedArticle({
                title: item.title,
                content: item.content || item.excerpt || "",
                url: item.url,
                author: item.author,
                publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
                source: item.feedTitle || "Unknown Source",
              })}
            />
          );
        })}
      </div>

      <ArticleReaderModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
      />
    </>
  );
}
