"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddFeedDialog } from "@/components/features/feed/AddFeedDialog";

/** Top-level nav links with their route paths */
const NAV_LINKS = [
  { label: "Feed", href: "/feed" },
  { label: "Digest", href: "/digest" },
  { label: "Discover", href: "/discover" },
] as const;

/**
 * TopNav for Flux — Precisely matches preview.jpg
 * - Uses pure white background
 * - Subtle border-b
 * - Grouped Search & Profile on right
 * - Active-route highlighting via `usePathname()`
 */
export function TopNav() {
  const pathname = usePathname();
  const [isAddFeedOpen, setIsAddFeedOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-4 sticky top-0 z-50">
        {/* Brand & Main Nav */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <Link href="/feed" className="flex items-center gap-2">
            {/* Exact Brand Mark from preview */}
            <div className="w-6 h-6 bg-[#2563EB] rounded-md flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-extrabold text-[#1A1D21] tracking-tight">Curio</span>
          </Link>

          <nav className="hidden sm:flex gap-1 items-center text-xs font-semibold">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href || pathname?.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-2.5 py-1.5 rounded-md transition-all",
                    isActive
                      ? "text-text-primary bg-bg-secondary"
                      : "text-text-tertiary hover:text-text-primary hover:bg-bg-secondary/50"
                  )}
                >
                  {label}
                </Link>
              );
            })}
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
              placeholder="Search articles..."
              className="w-36 md:w-48 lg:w-64 px-8 py-1.5 placeholder:text-text-tertiary bg-[#F3F4F6] border border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-border transition-all outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white border border-border rounded text-[10px] text-text-tertiary font-mono">
              /
            </div>
          </div>

          <button 
            className="p-1.5 hover:bg-bg-tertiary border border-blue-500 rounded-md transition-colors cursor-pointer"
            onClick={() => setIsAddFeedOpen(true)}
            aria-label="Add new feed"
          >
            <Plus className="size-4 text-text-secondary" />
          </button>

          <div className="size-8 bg-[#7C3AED] rounded-full flex items-center justify-center text-[11px] font-bold text-white tracking-wider cursor-pointer shadow-sm">
            MS
          </div>
        </div>
      </header>

      <AddFeedDialog 
        isOpen={isAddFeedOpen} 
        onClose={() => setIsAddFeedOpen(false)} 
      />
    </>
  );
}
