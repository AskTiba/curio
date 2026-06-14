import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserFeeds, getFeedItems, addFeed, updateFeedCategory } from "@/actions/feeds";

export const FEEDS_QUERY_KEY = ["feeds"];
export const FEED_ITEMS_QUERY_KEY = ["feedItems"];

/**
 * Hook to fetch all user subscriptions
 */
export function useFeeds() {
  return useQuery({
    queryKey: FEEDS_QUERY_KEY,
    queryFn: () => getUserFeeds(),
  });
}

/**
 * Hook to fetch feed items (articles)
 * @param limit Optional limit for the number of items
 */
export function useFeedItems(limit = 50) {
  return useQuery({
    queryKey: [...FEED_ITEMS_QUERY_KEY, limit],
    queryFn: () => getFeedItems(limit),
    refetchInterval: 120_000,
  });
}

/**
 * Hook to add a new feed subscription
 */
export function useAddFeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ url, categoryId }: { url: string; categoryId?: string }) => addFeed(url, categoryId),
    onSuccess: () => {
      // Invalidate both feeds and feedItems so the UI refreshes
      queryClient.invalidateQueries({ queryKey: FEEDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: FEED_ITEMS_QUERY_KEY });
    },
  });
}

/**
 * Hook to update a feed's category
 */
export function useUpdateFeedCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ feedId, categoryId }: { feedId: string; categoryId: string | null }) => updateFeedCategory(feedId, categoryId),
    onSuccess: () => {
      // Invalidate feeds so the sidebar updates
      queryClient.invalidateQueries({ queryKey: FEEDS_QUERY_KEY });
    },
  });
}
