"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { FeedHeader } from "./FeedHeader";
import { FeedFilterBar } from "./FeedFilterBar";
import type { ReadFilter } from "./FeedFilterBar";
import { FeedList } from "./FeedList";
import { useFeedItems } from "@/hooks/useFeeds";
import { useMarkAllAsRead } from "@/hooks/useInteractions";

export function FeedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = searchParams.get("search") ?? "";
  const sort = (searchParams.get("sort") ?? "newest") as "newest" | "oldest";
  const readFilter = (searchParams.get("read") ?? "all") as ReadFilter;
  const showBookmarked = searchParams.get("bookmarked") === "true";
  const categoryId = searchParams.get("category") ?? undefined;
  const feedId = searchParams.get("feed") ?? undefined;
  const viewMode = (searchParams.get("view") ?? "list") as "list" | "compact" | "grid";

  const queryParams = useMemo(() => ({
    search: search || undefined,
    sort,
    isRead: readFilter === "all" ? undefined : readFilter === "read" ? true : false,
    isBookmarked: showBookmarked ? true : undefined,
    categoryId,
    feedId,
    limit: 30,
  }), [search, sort, readFilter, showBookmarked, categoryId, feedId]);

  const { data: items = [] } = useFeedItems(queryParams);
  const totalCount = items.length;
  const unreadCount = items.filter((i) => !i.isRead).length;

  const { mutate: markAllAsRead, isPending: isMarkingRead } = useMarkAllAsRead();

  const setParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  return (
    <>
      <FeedHeader
        sort={sort}
        onSortChange={(v) => setParam("sort", v)}
        viewMode={viewMode}
        onViewModeChange={(v) => setParam("view", v)}
        unreadCount={unreadCount}
        onMarkAllRead={() => markAllAsRead()}
        isMarkingRead={isMarkingRead}
      />

      <div className="flex-1 flex flex-col">
        <div className="py-2 bg-accent-subtle text-accent text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-100 transition-colors border-b border-border-subtle">
          <span>↑</span>
          <span>Check for new items</span>
        </div>

        <FeedFilterBar
          readFilter={readFilter}
          onReadFilterChange={(v) => setParam("read", v === "all" ? null : v)}
          showBookmarked={showBookmarked}
          onBookmarkedChange={(v) => setParam("bookmarked", v ? "true" : null)}
          totalCount={totalCount}
        />

        <div className="max-w-[1200px] w-full mx-auto pb-12">
          <FeedList
            search={search || undefined}
            sort={sort}
            isRead={readFilter === "all" ? undefined : readFilter === "read" ? true : false}
            isBookmarked={showBookmarked ? true : undefined}
            categoryId={categoryId}
            feedId={feedId}
            viewMode={viewMode}
          />
        </div>
      </div>
    </>
  );
}
