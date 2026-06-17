"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Compass, Plus, LogOut, User, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddFeedDialog } from "@/components/features/feed/AddFeedDialog";
import { SearchBar } from "@/components/features/feed/SearchBar";
import { useAuth } from "@/components/features/auth/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

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

  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const getInitials = (email?: string | null): string | null => {
    if (!email) return null;
    const localPart = email.split("@")[0];
    const parts = localPart.split(/[.\-_]/);
    const initials = parts.map(p => p[0]).filter(Boolean).join("").toUpperCase().slice(0, 2);
    return initials || null;
  };

  const initials = getInitials(user?.email);

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

  useEffect(() => {
    if (!showMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        avatarRef.current && !avatarRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showMenu]);

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
            <span className="text-[15px] font-extrabold text-text-primary tracking-tight">Curio</span>
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
                      : "text-text-tertiary hover:text-text-hover hover:bg-bg-secondary/50"
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
            className="p-1.5 hover:bg-bg-tertiary border border-accent rounded-md transition-colors cursor-pointer"
            onClick={() => setIsAddFeedOpen(true)}
            aria-label="Add new feed"
          >
            <Plus className="size-4 text-text-secondary" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-1.5 hover:bg-bg-tertiary rounded-md transition-colors cursor-pointer text-text-tertiary hover:text-text-hover"
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </button>

          <div className="relative">
            <div
              ref={avatarRef}
              onClick={() => setShowMenu(prev => !prev)}
              className="size-8 bg-[#7C3AED] rounded-full flex items-center justify-center text-[11px] font-bold text-white tracking-wider cursor-pointer shadow-sm"
            >
              {initials ? (
                <span>{initials}</span>
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            {showMenu && (
              <div
                ref={menuRef}
                className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-lg shadow-md py-1 z-50"
              >
                <div className="px-3 py-2 text-xs text-text-tertiary border-b border-border truncate">
                  {user?.email}
                </div>
                <button
                  onClick={() => { signOut(); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-secondary hover:bg-bg-tertiary hover:text-text-hover transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
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
