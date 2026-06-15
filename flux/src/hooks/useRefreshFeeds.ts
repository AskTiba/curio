"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FEED_ITEMS_QUERY_KEY, FEEDS_QUERY_KEY } from "@/hooks/useFeeds";
import { useToast } from "@/components/ui/Toast";

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
  const { showToast } = useToast();

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

      const errors = data.results.filter((r) => r.error);
      const newItems = data.results.filter((r) => r.newItems > 0);

      if (newItems.length > 0) {
        newItems.forEach((r) => {
          showToast(`${r.title}: ${r.newItems} new article${r.newItems > 1 ? "s" : ""}`, "success");
        });
      }

      if (errors.length > 0) {
        errors.forEach((r) => {
          showToast(`${r.title}: ${r.error}`, "error");
        });
      }

      if (data.results.length > 0 && newItems.length === 0 && errors.length === 0) {
        showToast("All feeds up to date", "info");
      }
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : "Refresh failed", "error");
    },
  });
}
