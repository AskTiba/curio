"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { FeedHeader } from "./FeedHeader";
import { FeedFilterBar } from "./FeedFilterBar";
import type { ReadFilter } from "./FeedFilterBar";
import { FeedList } from "./FeedList";
import { useFeedItems, useFeedItemCount } from "@/hooks/useFeeds";
import { useMarkAllAsRead } from "@/hooks/useInteractions";
import { useRefreshFeeds } from "@/hooks/useRefreshFeeds";

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
    limit: 50,
  }), [search, sort, readFilter, showBookmarked, categoryId, feedId]);

  const countParams = useMemo(() => ({
    search: search || undefined,
    isRead: readFilter === "all" ? undefined : readFilter === "read" ? true : false,
    isBookmarked: showBookmarked ? true : undefined,
    categoryId,
    feedId,
  }), [search, readFilter, showBookmarked, categoryId, feedId]);

  const { data: countData } = useFeedItemCount(countParams);
  const totalCount = countData?.total ?? 0;
  const unreadCount = countData?.unread ?? 0;

  const { mutate: markAllAsRead, isPending: isMarkingRead } = useMarkAllAsRead();
  const { mutate: refreshFeeds, isPending: isRefreshing } = useRefreshFeeds();

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
        <button
          onClick={() => refreshFeeds(undefined)}
          disabled={isRefreshing}
          className="w-full py-2 bg-accent-subtle text-text-primary text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-bg-tertiary transition-colors border-b border-border-subtle disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className={cn(isRefreshing && "animate-spin")}>↑</span>
          <span>{isRefreshing ? "Refreshing..." : "Check for new items"}</span>
        </button>

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
