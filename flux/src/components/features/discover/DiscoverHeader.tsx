"use client";

import { Compass, Search } from "lucide-react";

/**
 * DiscoverHeader — Header for the feed discovery page.
 * Features prominent search and a descriptive subtitle.
 */
export function DiscoverHeader() {
  return (
    <div className="flex flex-col px-4 sm:px-8 py-5 gap-4 border-b border-border bg-surface sticky top-0 z-40">
      <div className="flex items-center gap-2.5">
        <Compass className="w-4 h-4 text-accent" />
        <h1 className="font-semibold text-base tracking-tight">Discover</h1>
        <span className="text-text-tertiary text-sm font-medium">Find new feeds to follow</span>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search by topic, publication, or URL..."
          className="w-full pl-9 pr-4 py-2 bg-bg-secondary border border-border-subtle rounded-lg text-sm focus:bg-surface focus:ring-2 focus:ring-accent/20 focus:border-border transition-all outline-none placeholder:text-text-tertiary"
        />
      </div>
    </div>
  );
}
