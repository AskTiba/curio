"use client";

import { Search, Plus } from "lucide-react";

/**
 * TopNav for Flux - Precisely matches preview.jpg
 * - Uses pure white background
 * - Subtle border-b
 * - Grouped Search & Profile on right
 */
export function TopNav() {
  return (
    <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Brand & Main Nav */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <div className="flex items-center gap-2">
          {/* Exact Brand Mark from preview */}
          <div className="w-6 h-6 bg-[#2563EB] rounded-md flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
              <div className="bg-white rounded-[1px]" />
              <div className="bg-white/60 rounded-[1px]" />
              <div className="bg-white/80 rounded-[1px]" />
              <div className="bg-white rounded-[1px]" />
            </div>
          </div>
          <span className="text-[15px] font-extrabold text-[#1A1D21] tracking-tight">Frontpage</span>
        </div>

        <nav className="hidden sm:flex gap-4 items-center text-xs font-semibold">
          <button className="text-text-primary bg-bg-secondary rounded-radius-md transition-all px-2 py-1">
            Feed
          </button>
          <button className="text-text-tertiary hover:text-text-primary transition-colors">
            Digest
          </button>
          <button className="text-text-tertiary hover:text-text-primary transition-colors">
            Discover
          </button>
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-36 md:w-48 lg:w-64 px-8 py-1.5 placeholder:text-text-tertiary bg-[#F3F4F6] border border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-border transition-all outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white border border-border rounded text-[10px] text-text-tertiary font-mono">
            /
          </div>
        </div>

        <button className="p-1.5 hover:bg-bg-tertiary border border-blue-500 rounded-md transition-colors">
          <Plus className="size-4 text-text-secondary" />
        </button>

        <div className="size-8 bg-[#7C3AED] rounded-full flex items-center justify-center text-[11px] font-bold text-white tracking-wider cursor-pointer shadow-sm">
          MS
        </div>
      </div>
    </header>
  );
}
