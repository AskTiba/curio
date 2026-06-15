"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FileText, Bookmark, CheckCircle2, Circle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddCategoryDialog } from "@/components/features/categories/AddCategoryDialog";
import { useFeeds, useFeedItems } from "@/hooks/useFeeds";
import { useCategories } from "@/hooks/useCategories";

import { EditFeedCategoryDialog } from "@/components/features/feed/EditFeedCategoryDialog";
import { MoreHorizontal } from "lucide-react";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  count?: number;
  isActive?: boolean;
  dotColor?: string;
  href?: string;
}

function NavItem({
  icon: Icon,
  label,
  count,
  isActive,
  dotColor,
  href,
}: NavItemProps) {
  const content = (
    <>
      <div className="flex items-center gap-1.5">
        {dotColor ? (
          <div className={cn("w-1 h-1 rounded-full shrink-0", dotColor)} />
        ) : (
          <Icon
            className={cn(
              "w-4 h-4 shrink-0",
              isActive ? "text-accent" : "text-text-tertiary"
            )}
          />
        )}
        <span className={isActive ? "font-bold" : "font-medium"}>{label}</span>
      </div>
      {count !== undefined && (
        <span
          className={cn(
            "text-[10px] font-bold",
            isActive ? "text-accent" : "text-text-tertiary"
          )}
        >
          {count}
        </span>
      )}
    </>
  );

  const classes = cn(
    "flex items-center justify-between w-full px-2 py-1 rounded-md transition-all text-xs font-medium group cursor-pointer",
    isActive
      ? "bg-accent-subtle text-accent"
      : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes}>
      {content}
    </button>
  );
}

interface SubNavItemProps {
  label: string;
  count: number;
  letter: string;
  color: string;
  href?: string;
  onEdit?: () => void;
}

function SubNavItem({ label, count, letter, color, href, onEdit }: SubNavItemProps) {
  const content = (
    <>
      <div
        className={cn(
          "size-3.5 rounded-sm flex items-center justify-center text-[8px] text-white shrink-0",
          color
        )}
      >
        {letter}
      </div>
      <span className="text-text-secondary group-hover:text-text-primary font-medium truncate">
        {label}
      </span>
    </>
  );

  return (
    <div className="flex items-center text-xs justify-between w-full py-1 pl-3 pr-2 rounded-md transition-all group hover:bg-bg-tertiary">
      {href ? (
        <Link href={href} className="flex items-center gap-1.5 flex-1 min-w-0 pr-2 no-underline">
          {content}
        </Link>
      ) : (
        <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
          {content}
        </div>
      )}
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-text-tertiary group-hover:hidden">{count}</span>
        {onEdit && (
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="hidden group-hover:flex items-center justify-center size-5 rounded hover:bg-bg-secondary text-text-tertiary hover:text-text-primary"
            title="Move feed"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Sidebar for Flux — Precisely matches preview.jpg
 * - Uses light gray background (bg-bg-secondary)
 * - Tighter padding
 * - Detailed category list with specific dot colors
 * - Active route highlighting via `usePathname()`
 */
export function Sidebar() {
  const pathname = usePathname();
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState<{ id: string; title: string | null; categoryId: string | null } | null>(null);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  const { data: feeds = [] } = useFeeds();
  const { data: categories = [] } = useCategories();
  const { data: items = [] } = useFeedItems();

  const unreadItemsCount = items.filter(i => !i.isRead).length;
  const savedItemsCount = items.filter(i => i.isBookmarked).length;

  const toggleCategory = (id: string) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Group feeds by category
  const feedsByCategory: Record<string, typeof feeds> = {};
  const uncategorizedFeeds: typeof feeds = [];

  feeds.forEach(feed => {
    if (feed.categoryId) {
      if (!feedsByCategory[feed.categoryId]) feedsByCategory[feed.categoryId] = [];
      feedsByCategory[feed.categoryId].push(feed);
    } else {
      uncategorizedFeeds.push(feed);
    }
  });

  const getFeedUnreadCount = (feedId: string) => {
    return items.filter(i => i.feedId === feedId && !i.isRead).length;
  };

  const getCategoryUnreadCount = (categoryId: string) => {
    const catFeeds = feedsByCategory[categoryId] || [];
    return catFeeds.reduce((acc, feed) => acc + getFeedUnreadCount(feed.id), 0);
  };

  const getColorClasses = (index: number) => {
    const colors = [
      "bg-blue-500", "bg-pink-500", "bg-orange-500", "bg-indigo-500", 
      "bg-purple-500", "bg-green-500", "bg-teal-500", "bg-red-500"
    ];
    return colors[index % colors.length];
  };

  console.log("[Sidebar Debug] Feeds fetched:", feeds.map(f => ({ id: f.id, title: f.title, categoryId: f.categoryId })));
  console.log("[Sidebar Debug] Categories fetched:", categories.map(c => ({ id: c.id, name: c.name })));
  console.log("[Sidebar Debug] Uncategorized Feeds:", uncategorizedFeeds.map(f => f.id));

  return (
    <>
      <aside className="w-48 min-w-48 border-r border-border bg-bg-secondary h-[calc(100vh-4rem)] flex flex-col sticky top-16 overflow-y-auto">
        <div className="p-2 flex flex-col gap-6">
          {/* Main Feed Sections */}
          <nav className="flex flex-col gap-1">
            <NavItem
              icon={FileText}
              label="All Items"
              count={unreadItemsCount}
              isActive={pathname === "/feed"}
              href="/feed"
            />
            <NavItem
              icon={Bookmark}
              label="Saved"
              count={savedItemsCount}
              isActive={pathname === "/saved"}
              href="/saved"
            />
          </nav>

          {/* Categories Section */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-2 py-2">
              <span className="text-[10px] font-bold text-text-tertiary uppercase">Categories</span>
              <button 
                onClick={() => setIsAddCategoryOpen(true)}
                className="text-text-tertiary hover:text-accent transition-colors cursor-pointer"
                aria-label="Add category"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-col gap-0.5">
              {categories.map((category, index) => {
                const isExpanded = expandedCats[category.id] !== false; // default true
                const catFeeds = feedsByCategory[category.id] || [];
                const dotColor = getColorClasses(index);

                return (
                  <div key={category.id}>
                    <div onClick={() => toggleCategory(category.id)}>
                      <NavItem
                        icon={Circle}
                        label={category.name}
                        count={getCategoryUnreadCount(category.id)}
                        dotColor={dotColor}
                      />
                    </div>
                    {isExpanded && catFeeds.length > 0 && (
                      <div className="flex flex-col gap-0.5 mb-2">
                        {catFeeds.map(feed => (
                          <SubNavItem
                            key={feed.id}
                            label={feed.title || "Unknown Feed"}
                            count={getFeedUnreadCount(feed.id)}
                            letter={(feed.title || "U")[0].toUpperCase()}
                            color={dotColor}
                            href={`/feed?feed=${feed.id}`}
                            onEdit={() => setEditingFeed(feed)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Uncategorized Feeds */}
              {uncategorizedFeeds.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between px-2 py-2">
                    <span className="text-[10px] font-bold text-text-tertiary uppercase">Uncategorized</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {uncategorizedFeeds.map(feed => (
                      <SubNavItem
                        key={feed.id}
                        label={feed.title || "Unknown Feed"}
                        count={getFeedUnreadCount(feed.id)}
                        letter={(feed.title || "U")[0].toUpperCase()}
                        color="bg-gray-500"
                        href={`/feed?feed=${feed.id}`}
                        onEdit={() => setEditingFeed(feed)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <div className="mt-auto p-4 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-xs text-text-tertiary font-semibold">
            <div className="w-4 h-4 rounded-full border border-success flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-success" />
            </div>
            <span>All feeds healthy</span>
          </div>
        </div>
      </aside>

      <AddCategoryDialog 
        isOpen={isAddCategoryOpen} 
        onClose={() => setIsAddCategoryOpen(false)} 
      />

      <EditFeedCategoryDialog
        isOpen={!!editingFeed}
        onClose={() => setEditingFeed(null)}
        feed={editingFeed}
      />
    </>
  );
}
