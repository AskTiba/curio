"use client";

import { Bookmark, ChevronDown, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SavedHeaderProps {
  count?: number;
}

/**
 * SavedHeader — Header bar for the Saved/Bookmarks page.
 * Shows the bookmark count, sort control, search filter, and bulk clear.
 */
export function SavedHeader({ count = 0 }: SavedHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row text-sm sm:items-center justify-between px-4 sm:px-8 py-3 sm:py-4 gap-3 sm:gap-0 border-b border-border bg-surface sticky top-0 z-40">
      <div className="flex items-baseline gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-accent" />
          <h1 className="font-semibold text-base tracking-tight">Saved</h1>
        </div>
        <span className="text-text-tertiary font-medium">{count} {count === 1 ? "article" : "articles"}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium text-text-tertiary">
        {/* Search within saved */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Filter saved..."
            className="w-40 pl-8 pr-3 py-1.5 bg-bg-secondary border border-border-subtle rounded-md text-xs focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-border transition-all outline-none placeholder:text-text-tertiary"
          />
        </div>

        {/* Sort control */}
        <Button variant="secondary" size="sm" className="gap-2 px-3">
          <ChevronDown className="w-4 h-4 text-text-tertiary" />
          Date saved
        </Button>

        {/* Clear all */}
        <Button variant="secondary" size="sm" className="gap-2 px-3 text-text-tertiary hover:text-error">
          <Trash2 className="w-3.5 h-3.5" />
          Clear all
        </Button>
      </div>
    </div>
  );
}
