import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleItemRead, markAllAsRead, toggleBookmark, getBookmarkedItems } from "@/actions/interactions";
import { FEED_ITEMS_QUERY_KEY } from "@/hooks/useFeeds";

export function useToggleRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, isRead }: { itemId: string; isRead: boolean }) => toggleItemRead(itemId, isRead),
    onMutate: async ({ itemId, isRead }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: FEED_ITEMS_QUERY_KEY });

      // Optimistically update to the new value across all query key variations (like limits)
      queryClient.setQueriesData({ queryKey: FEED_ITEMS_QUERY_KEY }, (old: any) => {
        if (!old) return old;
        return old.map((item: any) => {
          if (item.id === itemId) {
            return { ...item, isRead };
          }
          return item;
        });
      });

      return {}; // We aren't doing strict rollback per key here to save complexity, but could via context
    },
    onSettled: () => {
      // Invalidate to ensure the server and client are perfectly in sync
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

      // Optimistically update isBookmarked in the feed items cache
      queryClient.setQueriesData({ queryKey: FEED_ITEMS_QUERY_KEY }, (old: any) => {
        if (!old) return old;
        return old.map((item: any) => {
          if (item.id === itemId) {
            return { ...item, isBookmarked };
          }
          return item;
        });
      });

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
