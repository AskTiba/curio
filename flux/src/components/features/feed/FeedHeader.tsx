"use client";

import {
  List,
  LayoutGrid,
  LayoutList,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Feed Header from preview.jpg
 * - "All Items" 47 unread
 * - View toggles (List, Compact, Grid)
 * - Sorting & Action buttons
 */
export function FeedHeader() {
  return (
    <div className="flex flex-col sm:flex-row text-sm sm:items-center justify-between px-4 sm:px-8 py-3 sm:py-4 gap-3 sm:gap-0 border-b border-border bg-surface sticky top-0 z-40">
      <div className="flex items-baseline gap-3 shrink-0">
        <h1 className=" font-semibold text-base tracking-tight">All Items</h1>
        <span className=" text-text-tertiary font-medium">47 unread</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium text-text-tertiary">
        {/* View Toggles */}
        <div className="flex items-center bg-bg-secondary p-0.5 rounded-md border border-border">
          <button className="p-1.5 text-text-tertiary hover:text-text-primary transition-colors">
            <LayoutList className="w-4 h-4" />
          </button>
          <button className="p-1.5 bg-surface text-text-primary shadow-sm rounded-sm border border-border">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-text-tertiary hover:text-text-primary transition-colors">
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <Button variant="secondary" size="sm" className="gap-2 px-3">
          <ChevronDown className="w-4 h-4 text-text-tertiary" />
          Newest
        </Button>

        <Button variant="secondary" size="sm" className="gap-2 px-3">
          <RotateCcw className="w-4 h-4 text-text-tertiary" />
          Refresh
        </Button>

        <Button variant="secondary" size="sm" className="px-3">
          Mark all read
        </Button>
      </div>
    </div>
  );
}
