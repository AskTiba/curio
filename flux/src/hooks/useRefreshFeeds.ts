"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FEED_ITEMS_QUERY_KEY, FEEDS_QUERY_KEY } from "@/hooks/useFeeds";

interface FeedResult {
  feedId: string;
  title: string;
  newItems: number;
  error?: string;
}

interface RefreshResponse {
  results: FeedResult[];
}

export function useRefreshFeeds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedId?: string) => {
      const response = await fetch("/api/feeds/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedId }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Refresh failed" }));
        throw new Error(err.error || "Refresh failed");
      }
      return response.json() as Promise<RefreshResponse>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: FEEDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: FEED_ITEMS_QUERY_KEY });
    },
    onError: () => {},
  });
}
