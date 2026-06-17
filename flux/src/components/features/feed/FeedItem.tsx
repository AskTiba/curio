"use client";

import { Bookmark } from "lucide-react";
import { Badge, badgeVariants } from "@/components/ui/Badge";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useToggleRead, useToggleBookmark } from "@/hooks/useInteractions";

interface FeedItemProps {
  id: string;
  source: string;
  sourceColor?: string;
  timestamp: string;
  title: string;
  excerpt: string;
  category: string;
  categoryVariant?: VariantProps<typeof badgeVariants>["variant"];
  isRead?: boolean;
  isBookmarked?: boolean;
  viewMode?: "list" | "compact" | "grid";
  thumbnailUrl?: string | null;
  onOpenArticle?: () => void;
}

export function FeedItem({
  id,
  source,
  sourceColor = "bg-red-500",
  timestamp,
  title,
  excerpt,
  category,
  categoryVariant,
  isRead,
  isBookmarked,
  viewMode = "list",
  thumbnailUrl,
  onOpenArticle,
}: FeedItemProps) {
  const { mutate: toggleRead } = useToggleRead();
  const { mutate: toggleBookmark } = useToggleBookmark();

  const handleClick = () => {
    if (!isRead) {
      toggleRead({ itemId: id, isRead: true });
    }
    onOpenArticle?.();
  };

  if (viewMode === "compact") {
    return (
      <article
        className={cn(
          "flex items-center gap-2 px-4 sm:px-7 py-2 border-b border-border hover:bg-bg-secondary/50 transition-colors cursor-pointer",
          isRead && "opacity-60"
        )}
        onClick={handleClick}
      >
        {!isRead && (
          <div className="w-1.5 h-1.5 shrink-0 bg-accent rounded-full ring-2 ring-accent/10" />
        )}
        {isRead && <div className="w-1.5 h-1.5 shrink-0" />}
        <div className={cn("w-4 h-4 rounded-sm shadow-sm flex items-center justify-center text-[9px] font-bold text-white shrink-0", sourceColor, isRead && "grayscale opacity-80")}>
          {source.charAt(0)}
        </div>
        <span className="text-text-secondary text-xs font-medium truncate max-w-[120px] shrink-0">{source}</span>
        <span className="text-text-primary text-sm truncate font-medium">{title}</span>
        <span className="text-text-tertiary text-xs shrink-0 ml-auto">{timestamp}</span>
      </article>
    );
  }

  if (viewMode === "grid") {
    return (
      <article
        className={cn(
          "group flex flex-col border border-border rounded-lg p-4 hover:shadow-md hover:border-accent/30 transition-all cursor-pointer bg-surface",
          isRead && "opacity-70"
        )}
        onClick={handleClick}
      >
        {thumbnailUrl && (
          <div className="relative -mx-4 -mt-4 mb-3 overflow-hidden rounded-t-lg h-40 bg-bg-tertiary">
            <img
              src={thumbnailUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}
        <div className="flex items-center gap-2 text-xs font-medium mb-2">
          <div className={cn("w-4 h-4 rounded-sm shadow-sm flex items-center justify-center text-[9px] font-bold text-white", sourceColor, isRead && "grayscale opacity-80")}>
            {source.charAt(0)}
          </div>
          <span className="text-text-secondary truncate">{source}</span>
          <span className="text-text-tertiary">•</span>
          <span className="text-text-tertiary shrink-0">{timestamp}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark({ itemId: id, isBookmarked: !isBookmarked });
            }}
            className="ml-auto p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-accent/10 transition-all cursor-pointer"
            title={isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark
              className={cn(
                "w-3 h-3",
                isBookmarked
                  ? "text-accent fill-accent opacity-100"
                  : "text-text-tertiary"
              )}
            />
          </button>
        </div>
        <h2 className={cn("text-sm leading-tight mb-1.5 group-hover:text-accent transition-colors line-clamp-2", isRead ? "font-semibold text-text-secondary" : "font-bold text-text-primary")}>
          {title}
        </h2>
        <p className="text-text-secondary text-xs leading-normal line-clamp-3 flex-1">
          {excerpt}
        </p>
        <div className="mt-2">
          <Badge variant={categoryVariant}>{category}</Badge>
        </div>
      </article>
    );
  }

  return (
    <article 
      className={cn(
        "group grid grid-cols-[2.5rem_1fr] text-sm px-4 py-4 border-b border-border hover:bg-bg-secondary/50 transition-colors cursor-pointer relative",
        isRead && "opacity-75"
      )}
      onClick={handleClick}
    >
      {/* Column 1: Unread Indicator + Bookmark */}
      <div className="flex flex-col items-center gap-1.5 pt-1">
        {!isRead && (
          <div className="w-1.5 h-1.5 mt-1 bg-accent rounded-full ring-2 ring-accent/10" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark({ itemId: id, isBookmarked: !isBookmarked });
          }}
          className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-accent/10 transition-all cursor-pointer"
          title={isBookmarked ? "Remove bookmark" : "Bookmark"}
        >
          <Bookmark
            className={cn(
              "w-3 h-3",
              isBookmarked
                ? "text-accent fill-accent opacity-100"
                : "text-text-tertiary"
            )}
          />
        </button>
      </div>

      {/* Column 2: Content Container */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          {/* Source Meta Row (Aligned with dot) */}
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className={cn("w-4 h-4 rounded-sm shadow-sm flex items-center justify-center text-[9px] font-bold text-white", sourceColor, isRead && "grayscale opacity-80")}>
              {source.charAt(0)}
            </div>
            <span className="text-text-secondary">{source}</span>
            <span className="text-text-tertiary">•</span>
            <span className="text-text-tertiary">{timestamp}</span>
          </div>

          {/* Title */}
          <h2 className={cn("text-[15px] leading-tight group-hover:text-accent transition-colors", isRead ? "font-semibold text-text-secondary" : "font-bold text-text-primary")}>
            {title}
          </h2>

          {/* Excerpt */}
          <p className="text-text-secondary leading-normal line-clamp-2 max-w-3xl">
            {excerpt}
          </p>

          {/* Category Badge */}
          <div className="mt-1">
            <Badge variant={categoryVariant}>{category}</Badge>
          </div>
        </div>

        {thumbnailUrl && (
          <div className="shrink-0 w-28 h-20 rounded-lg overflow-hidden bg-bg-tertiary">
            <img
              src={thumbnailUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}
      </div>
    </article>
  );
}

