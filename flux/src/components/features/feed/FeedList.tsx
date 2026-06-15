"use client";

import { useState } from "react";
import { useFeedItemsInfinite } from "@/hooks/useFeeds";
import { FeedItem } from "@/components/features/feed/FeedItem";
import { ArticleReaderModal } from "@/components/features/feed/ArticleReaderModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface FeedListProps {
  search?: string;
  sort?: "newest" | "oldest";
  isRead?: boolean;
  isBookmarked?: boolean;
  categoryId?: string;
  feedId?: string;
  viewMode?: "list" | "compact" | "grid";
}

interface SelectedArticle {
  title: string;
  content: string;
  url?: string | null;
  author?: string | null;
  publishedAt?: Date | null;
  source: string;
}

export function FeedList({ search, sort, isRead, isBookmarked, categoryId, feedId, viewMode = "list" }: FeedListProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeedItemsInfinite({ search, sort, isRead, isBookmarked, categoryId, feedId, limit: 30 });

  const [selectedArticle, setSelectedArticle] = useState<SelectedArticle | null>(null);

  const items = data?.pages.flatMap((page) => page.items) ?? [];

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

  if (items.length === 0) {
    const hasFilters = search || isRead !== undefined || isBookmarked || categoryId || feedId;
    return (
      <div className="p-12 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-bg-tertiary flex items-center justify-center">
          <ChevronDown className="w-5 h-5 text-text-tertiary" />
        </div>
        <p className="font-semibold text-text-primary mb-1">
          {hasFilters ? "No articles match your filters" : "No articles yet"}
        </p>
        <p className="text-sm text-text-tertiary">
          {hasFilters
            ? "Try adjusting your search or filter criteria."
            : "Add some feeds to get started."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="px-7 pt-4 pb-2">
        <h3 className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em]">
          {sort === "oldest" ? "Oldest" : "Latest"}
        </h3>
      </div>

      <div className={cn(viewMode === "grid" && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-7 pt-2 pb-4")}>
        {items.map((item) => {
          const publishedDate = item.publishedAt ? new Date(item.publishedAt) : new Date();
          return (
            <FeedItem
              key={`${item.id}-${item.isRead}-${item.isBookmarked}`}
              id={item.id}
              source={item.feedTitle || "Unknown Source"}
              timestamp={formatDistanceToNow(publishedDate, { addSuffix: true })}
              title={item.title}
              excerpt={item.excerpt || item.content?.replace(/<[^>]*>?/gm, "").substring(0, 150) + "..." || ""}
              category={item.categoryName || "Uncategorized"}
              isRead={item.isRead}
              isBookmarked={item.isBookmarked}
              viewMode={viewMode}
              onOpenArticle={() =>
                setSelectedArticle({
                  title: item.title,
                  content: item.content || item.excerpt || "",
                  url: item.url,
                  author: item.author,
                  publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
                  source: item.feedTitle || "Unknown Source",
                })
              }
            />
          );
        })}
      </div>

      {hasNextPage && (
        <div className="px-7 pt-4 pb-8 flex justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          >
            <ChevronDown className="w-4 h-4" />
            Load older articles
          </Button>
        </div>
      )}

      {!hasNextPage && items.length > 30 && (
        <div className="px-7 pt-4 pb-8 text-center">
          <p className="text-xs text-text-tertiary font-medium">All articles loaded</p>
        </div>
      )}

      <ArticleReaderModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
      />
    </>
  );
}
