"use client";

import { formatDistanceToNow, subDays } from "date-fns";
import { SavedHeader } from "@/components/features/saved/SavedHeader";
import { SavedItem } from "@/components/features/saved/SavedItem";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBookmarkedItems } from "@/hooks/useInteractions";

export default function SavedPage() {
  const { data: items, isLoading } = useBookmarkedItems();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-full bg-surface">
        <SavedHeader />
        <div className="flex flex-col max-w-[1200px] w-full mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="px-4 py-4 border-b border-border">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const thisWeek: typeof items = [];
  const earlier: typeof items = [];

  const sevenDaysAgo = subDays(new Date(), 7);

  for (const item of items ?? []) {
    const bookmarkedAt = item.bookmarkedAt ? new Date(item.bookmarkedAt) : new Date();
    if (bookmarkedAt >= sevenDaysAgo) {
      thisWeek.push(item);
    } else {
      earlier.push(item);
    }
  }

  const totalCount = items?.length ?? 0;

  return (
    <div className="flex flex-col min-h-full bg-surface">
      <SavedHeader count={totalCount} />

      <div className="flex-1 flex flex-col">
        <div className="max-w-[1200px] w-full mx-auto pb-12">
          {totalCount === 0 ? (
            <div className="p-12 text-center text-text-tertiary">
              <p className="font-semibold mb-2">No saved articles yet.</p>
              <p className="text-sm">Bookmark articles from your feed to see them here.</p>
            </div>
          ) : (
            <>
              {thisWeek.length > 0 && (
                <>
                  <div className="px-7 pt-4">
                    <h3 className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em]">
                      This Week
                    </h3>
                  </div>
                  {thisWeek.map((item) => (
                    <SavedItem
                      key={item.id}
                      id={item.id}
                      source={item.feedTitle || "Unknown Source"}
                      timestamp={item.publishedAt ? formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true }) : ""}
                      savedAt={item.bookmarkedAt ? formatDistanceToNow(new Date(item.bookmarkedAt), { addSuffix: true }) : ""}
                      title={item.title}
                      excerpt={item.excerpt || ""}
                      category={item.categoryName}
                      url={item.url}
                    />
                  ))}
                </>
              )}

              {earlier.length > 0 && (
                <>
                  <div className="px-7 pt-6">
                    <h3 className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em]">
                      Earlier
                    </h3>
                  </div>
                  {earlier.map((item) => (
                    <SavedItem
                      key={item.id}
                      id={item.id}
                      source={item.feedTitle || "Unknown Source"}
                      timestamp={item.publishedAt ? formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true }) : ""}
                      savedAt={item.bookmarkedAt ? formatDistanceToNow(new Date(item.bookmarkedAt), { addSuffix: true }) : ""}
                      title={item.title}
                      excerpt={item.excerpt || ""}
                      category={item.categoryName}
                      url={item.url}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
