"use client";

import {
  ArrowDownUp,
  RotateCcw,
  LayoutList,
  LayoutGrid,
  List,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useRefreshFeeds } from "@/hooks/useRefreshFeeds";

interface FeedHeaderProps {
  sort: "newest" | "oldest";
  onSortChange: (value: "newest" | "oldest") => void;
  viewMode: "list" | "compact" | "grid";
  onViewModeChange: (mode: "list" | "compact" | "grid") => void;
  unreadCount: number;
  onMarkAllRead: () => void;
  isMarkingRead: boolean;
}

const viewModes = [
  { mode: "list" as const, icon: LayoutList, label: "List view" },
  { mode: "grid" as const, icon: LayoutGrid, label: "Grid view" },
  { mode: "compact" as const, icon: List, label: "Compact view" },
];

export function FeedHeader({
  sort, onSortChange,
  viewMode, onViewModeChange,
  unreadCount,
  onMarkAllRead, isMarkingRead,
}: FeedHeaderProps) {
  const { mutate: refreshFeeds, isPending } = useRefreshFeeds();

  return (
    <div className="flex flex-col sm:flex-row text-sm sm:items-center justify-between px-4 sm:px-8 py-3 sm:py-4 gap-3 sm:gap-0 border-b border-border bg-surface sticky top-0 z-40">
      <div className="flex items-baseline gap-3 shrink-0">
        <h1 className="font-semibold text-base tracking-tight">All Items</h1>
        {unreadCount > 0 && (
          <span className="text-text-tertiary font-medium">{unreadCount} unread</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium text-text-tertiary">
        {/* View Toggles */}
        <div className="flex items-center bg-bg-secondary p-0.5 rounded-md border border-border">
          {viewModes.map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              title={label}
              className={cn(
                "p-1.5 transition-colors cursor-pointer rounded-sm",
                viewMode === mode
                  ? "bg-surface text-text-primary shadow-sm border border-border"
                  : "text-text-tertiary hover:text-text-primary"
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="gap-2 px-3"
          onClick={() => onSortChange(sort === "newest" ? "oldest" : "newest")}
        >
          <ArrowDownUp className="w-4 h-4 text-text-tertiary" />
          {sort === "newest" ? "Newest" : "Oldest"}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          className="gap-2 px-3"
          onClick={() => refreshFeeds(undefined)}
          disabled={isPending}
        >
          <RotateCcw className={cn("w-4 h-4 text-text-tertiary", isPending && "animate-spin")} />
          {isPending ? "Refreshing..." : "Refresh"}
        </Button>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 px-3"
            onClick={onMarkAllRead}
            disabled={isMarkingRead}
          >
            <CheckCheck className="w-4 h-4 text-text-tertiary" />
            Mark all read
          </Button>
        )}
      </div>
    </div>
  );
}
