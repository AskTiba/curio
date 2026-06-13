"use client";

import { Badge, badgeVariants } from "@/components/ui/Badge";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useToggleRead } from "@/hooks/useInteractions";

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
  onOpenArticle?: () => void;
}

/**
 * Feed Item from preview.jpg
 * - Grid-based layout for precision
 * - Gutter for unread dot at the absolute start
 * - Metadata, Title, and Excerpt in the primary column
 */
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
  onOpenArticle,
}: FeedItemProps) {
  const { mutate } = useToggleRead();

  const handleClick = () => {
    if (!isRead) {
      mutate({ itemId: id, isRead: true });
    }
    onOpenArticle?.();
  };

  return (
    <article 
      className={cn(
        "group grid grid-cols-[2.5rem_1fr] text-sm px-4 py-4 border-b border-border hover:bg-bg-secondary/50 transition-colors cursor-pointer relative",
        isRead && "opacity-75"
      )}
      onClick={handleClick}
    >
      {/* Column 1: Unread Indicator (At the start) */}
      <div className="flex justify-center pt-1">
        {!isRead && (
          <div className="w-1.5 h-1.5 mt-1 bg-accent rounded-full shadow-[0_0_0_2px_rgba(37,99,235,0.1)]" />
        )}
      </div>

      {/* Column 2: Content Container */}
      <div className="flex flex-col gap-2">
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
    </article>
  );
}

