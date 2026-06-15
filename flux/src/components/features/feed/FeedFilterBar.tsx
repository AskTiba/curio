"use client";

import { cn } from "@/lib/utils";
import { Bookmark, Eye, EyeOff } from "lucide-react";

export type ReadFilter = "all" | "unread" | "read";

interface FeedFilterBarProps {
  readFilter: ReadFilter;
  onReadFilterChange: (filter: ReadFilter) => void;
  showBookmarked: boolean;
  onBookmarkedChange: (show: boolean) => void;
  totalCount: number;
}

export function FeedFilterBar({
  readFilter,
  onReadFilterChange,
  showBookmarked,
  onBookmarkedChange,
  totalCount,
}: FeedFilterBarProps) {
  return (
    <div className="flex items-center gap-3 px-7 py-3 border-b border-border bg-surface">
      <div className="flex items-center gap-1">
        {(["all", "unread", "read"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => onReadFilterChange(filter)}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer",
              readFilter === filter
                ? "bg-accent text-white shadow-sm"
                : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
            )}
          >
            {filter === "all" && "All"}
            {filter === "unread" && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-3 h-3" />
                Unread
              </span>
            )}
            {filter === "read" && (
              <span className="flex items-center gap-1.5">
                <EyeOff className="w-3 h-3" />
                Read
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-border" />

      <button
        onClick={() => onBookmarkedChange(!showBookmarked)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer",
          showBookmarked
            ? "bg-accent/10 text-accent border border-accent/20"
            : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
        )}
      >
        <Bookmark className={cn("w-3 h-3", showBookmarked && "fill-accent")} />
        Bookmarked
      </button>

      <div className="ml-auto text-[11px] text-text-tertiary font-medium">
        {totalCount} {totalCount === 1 ? "article" : "articles"}
      </div>
    </div>
  );
}
