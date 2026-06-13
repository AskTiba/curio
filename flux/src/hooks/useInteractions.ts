import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleItemRead, markAllAsRead } from "@/actions/interactions";
import { FEED_ITEMS_QUERY_KEY } from "@/hooks/useFeeds";

export function useToggleRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, isRead }: { itemId: string; isRead: boolean }) => toggleItemRead(itemId, isRead),
    onMutate: async ({ itemId, isRead }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: FEED_ITEMS_QUERY_KEY });

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData(FEED_ITEMS_QUERY_KEY);

      // Optimistically update to the new value
      queryClient.setQueryData(FEED_ITEMS_QUERY_KEY, (old: any) => {
        if (!old) return old;
        return old.map((item: any) => {
          if (item.id === itemId) {
            return { ...item, isRead };
          }
          return item;
        });
      });

      return { previousItems };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousItems) {
        queryClient.setQueryData(FEED_ITEMS_QUERY_KEY, context.previousItems);
      }
    },
    onSettled: () => {
      // We don't necessarily need to invalidate to prevent aggressive jumping,
      // but if we want to ensure sync, we can invalidate. 
      // Let's leave it to optimistic updates for a snapper feel.
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
