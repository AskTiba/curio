import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserFeeds, getFeedItems, getFeedItemCount, addFeed, updateFeedCategory } from "@/actions/feeds";
import type { FeedQueryParams } from "@/actions/feeds";

export const FEEDS_QUERY_KEY = ["feeds"];
export const FEED_ITEMS_QUERY_KEY = ["feedItems"];
export const FEED_ITEM_COUNT_KEY = ["feedItemCount"];

export function useFeeds() {
  return useQuery({
    queryKey: FEEDS_QUERY_KEY,
    queryFn: () => getUserFeeds(),
  });
}

export function useFeedItems(params?: FeedQueryParams) {
  return useQuery({
    queryKey: [...FEED_ITEMS_QUERY_KEY, params],
    queryFn: () => getFeedItems(params).then(r => r.items),
    refetchInterval: 120_000,
  });
}

export function useFeedItemCount(params?: Omit<FeedQueryParams, "limit" | "cursor" | "sort">) {
  return useQuery({
    queryKey: [...FEED_ITEM_COUNT_KEY, params],
    queryFn: () => getFeedItemCount(params),
    refetchInterval: 120_000,
  });
}

export function useFeedItemsInfinite(params?: Omit<FeedQueryParams, "cursor">) {
  return useInfiniteQuery({
    queryKey: [...FEED_ITEMS_QUERY_KEY, "infinite", params],
    queryFn: ({ pageParam }) => getFeedItems({ ...params, cursor: pageParam }).then(r => r),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
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
