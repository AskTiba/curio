"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Compass, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddFeedDialog } from "@/components/features/feed/AddFeedDialog";
import { SearchBar } from "@/components/features/feed/SearchBar";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAddFeedOpen, setIsAddFeedOpen] = useState(false);
  const [search, setSearch] = useState(pathname === "/feed" ? searchParams.get("search") ?? "" : "");

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (pathname === "/feed") {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      router.push(value ? `/feed?search=${encodeURIComponent(value)}` : "/feed");
    }
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const urlSearch = pathname === "/feed" ? searchParams.get("search") ?? "" : "";
    setSearch(urlSearch);
  }, [pathname, searchParams]);

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
          <div className="w-36 md:w-48 lg:w-64">
            <SearchBar value={search} onChange={handleSearchChange} />
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
