"use client";

import { Bookmark, ExternalLink } from "lucide-react";
import { Badge, badgeVariants } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useToggleBookmark } from "@/hooks/useInteractions";
import type { VariantProps } from "class-variance-authority";

const SOURCE_COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500",
  "bg-orange-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
  "bg-gray-700", "bg-cyan-500",
];

function getSourceColor(source: string): string {
  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    hash = source.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SOURCE_COLORS[Math.abs(hash) % SOURCE_COLORS.length];
}

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

function getCategoryVariant(category: string | null): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    "Design": "design",
    "Frontend": "frontend",
    "Backend & DevOps": "backend",
    "AI & ML": "aiml",
  };
  return map[category ?? ""] || "default";
}

interface SavedItemProps {
  id: string;
  source: string;
  timestamp: string;
  savedAt: string;
  title: string;
  excerpt: string;
  category: string | null;
  url?: string;
  thumbnailUrl?: string | null;
}

export function SavedItem({
  id,
  source,
  timestamp,
  savedAt,
  title,
  excerpt,
  category,
  url = "#",
  thumbnailUrl,
}: SavedItemProps) {
  const { mutate: toggleBookmark } = useToggleBookmark();
  const sourceColor = getSourceColor(source);
  const categoryVariant = getCategoryVariant(category);

  return (
    <article className="group grid grid-cols-[2.5rem_1fr] text-sm px-4 py-4 border-b border-border hover:bg-bg-secondary/50 transition-colors relative">
      {/* Column 1: Bookmark Icon */}
      <div className="flex justify-center pt-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark({ itemId: id, isBookmarked: false });
          }}
          className="p-0.5 rounded hover:bg-accent/10 transition-colors cursor-pointer"
          title="Remove bookmark"
        >
          <Bookmark className="w-3.5 h-3.5 text-accent fill-accent" />
        </button>
      </div>

      {/* Column 2: Content */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          {/* Source Meta Row */}
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className={cn("w-4 h-4 rounded-sm shadow-sm flex items-center justify-center text-[9px] font-bold text-white shrink-0", sourceColor)}>
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
            {category && (
              <Badge variant={categoryVariant}>{category}</Badge>
            )}
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
