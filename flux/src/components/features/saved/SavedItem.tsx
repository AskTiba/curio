"use client";

import { Bookmark, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import type { badgeVariants } from "@/components/ui/Badge";

interface SavedItemProps {
  id: string;
  source: string;
  sourceColor?: string;
  timestamp: string;
  savedAt: string;
  title: string;
  excerpt: string;
  category: string;
  categoryVariant?: VariantProps<typeof badgeVariants>["variant"];
  url?: string;
}

/**
 * SavedItem — Renders a single bookmarked article.
 * Similar to FeedItem but with a "saved at" timestamp and
 * quick-action buttons (remove bookmark, open original).
 */
export function SavedItem({
  source,
  sourceColor = "bg-blue-500",
  timestamp,
  savedAt,
  title,
  excerpt,
  category,
  categoryVariant,
  url = "#",
}: SavedItemProps) {
  return (
    <article className="group grid grid-cols-[2.5rem_1fr] text-sm px-4 py-4 border-b border-border hover:bg-bg-secondary/50 transition-colors cursor-pointer relative">
      {/* Column 1: Bookmark Icon */}
      <div className="flex justify-center pt-1">
        <Bookmark className="w-3.5 h-3.5 text-accent fill-accent/20" />
      </div>

      {/* Column 2: Content */}
      <div className="flex flex-col gap-2">
        {/* Source Meta Row */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className={cn("w-4 h-4 rounded-sm shadow-sm flex items-center justify-center text-[9px] font-bold text-white", sourceColor)}>
            {source.charAt(0)}
          </div>
          <span className="text-text-secondary">{source}</span>
          <span className="text-text-tertiary">•</span>
          <span className="text-text-tertiary">{timestamp}</span>
        </div>

        {/* Title */}
        <h2 className="font-bold text-[15px] text-text-primary leading-tight group-hover:text-accent transition-colors">
          {title}
        </h2>

        {/* Excerpt */}
        <p className="text-text-secondary leading-normal line-clamp-2 max-w-3xl">
          {excerpt}
        </p>

        {/* Footer Row: Badge + Saved timestamp + Action */}
        <div className="flex items-center gap-3 mt-1">
          <Badge variant={categoryVariant}>{category}</Badge>
          <span className="text-[10px] text-text-tertiary font-medium">
            Saved {savedAt}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-[10px] text-text-tertiary hover:text-accent font-medium"
          >
            Open original
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
