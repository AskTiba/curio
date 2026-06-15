import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleItemRead, markAllAsRead, toggleBookmark, getBookmarkedItems } from "@/actions/interactions";
import { FEED_ITEMS_QUERY_KEY } from "@/hooks/useFeeds";

function updateItemInCache(old: unknown, itemId: string, updates: Record<string, unknown>) {
  if (!old) return old;
  // Infinite query shape: { pages: Array<{ items: Item[] }>, pageParams: [...] }
  if (typeof old === "object" && old !== null && "pages" in old) {
    const infinite = old as { pages: Array<{ items: unknown[] }>; pageParams: unknown[] };
    return {
      ...infinite,
      pages: infinite.pages.map((page) => ({
        ...page,
        items: (page.items ?? []).map((item: any) =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      })),
    };
  }
  // Regular query shape: Item[]
  if (Array.isArray(old)) {
    return old.map((item: any) =>
      item.id === itemId ? { ...item, ...updates } : item
    );
  }
  return old;
}

export function useToggleRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, isRead }: { itemId: string; isRead: boolean }) => toggleItemRead(itemId, isRead),
    onMutate: async ({ itemId, isRead }) => {
      await queryClient.cancelQueries({ queryKey: FEED_ITEMS_QUERY_KEY });

      queryClient.setQueriesData({ queryKey: FEED_ITEMS_QUERY_KEY }, (old: any) =>
        updateItemInCache(old, itemId, { isRead })
      );

      return {};
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FEED_ITEMS_QUERY_KEY });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEED_ITEMS_QUERY_KEY });
    },
  });
}

export const BOOKMARKS_QUERY_KEY = ["bookmarks"];

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, isBookmarked }: { itemId: string; isBookmarked: boolean }) => toggleBookmark(itemId, isBookmarked),
    onMutate: async ({ itemId, isBookmarked }) => {
      await queryClient.cancelQueries({ queryKey: FEED_ITEMS_QUERY_KEY });

      queryClient.setQueriesData({ queryKey: FEED_ITEMS_QUERY_KEY }, (old: any) =>
        updateItemInCache(old, itemId, { isBookmarked })
      );

      return {};
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FEED_ITEMS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BOOKMARKS_QUERY_KEY });
    },
  });
}

export function useBookmarkedItems() {
  return useQuery({
    queryKey: BOOKMARKS_QUERY_KEY,
    queryFn: () => getBookmarkedItems(),
  });
}
