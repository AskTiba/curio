"use client";

import { Sparkles, ArrowUpRight, TrendingUp, Hash } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { VariantProps } from "class-variance-authority";
import type { badgeVariants } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface DigestSectionProps {
  category: string;
  categoryVariant?: VariantProps<typeof badgeVariants>["variant"];
  dotColor?: string;
  articleCount: number;
  summary: string;
  topStories: Array<{
    title: string;
    source: string;
    sourceColor: string;
  }>;
  keyTakeaways: string[];
}

/**
 * DigestSection — A single category summary card in the AI Digest view.
 * Contains: category badge, AI-generated summary, top stories list, and key takeaways.
 */
export function DigestSection({
  category,
  categoryVariant,
  dotColor = "bg-blue-500",
  articleCount,
  summary,
  topStories,
  keyTakeaways,
}: DigestSectionProps) {
  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden hover:border-border/80 transition-colors">
      {/* Section Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle bg-bg-secondary/50">
        <div className="flex items-center gap-2.5">
          <div className={cn("w-2 h-2 rounded-full", dotColor)} />
          <Badge variant={categoryVariant} className="text-[10px]">{category}</Badge>
          <span className="text-[10px] text-text-tertiary font-medium">
            {articleCount} articles
          </span>
        </div>
        <Sparkles className="w-3.5 h-3.5 text-warning" />
      </div>

      {/* AI Summary */}
      <div className="px-5 py-4">
        <p className="text-sm text-text-secondary leading-relaxed">
          {summary}
        </p>
      </div>

      {/* Top Stories */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-text-tertiary" />
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
            Top Stories
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {topStories.map((story, i) => (
            <button
              key={i}
              className="flex items-start gap-2 text-left group px-2 py-1.5 -mx-2 rounded-md hover:bg-bg-secondary transition-colors"
            >
              <div className={cn("w-3.5 h-3.5 mt-0.5 rounded-sm shrink-0 flex items-center justify-center text-[7px] font-bold text-white", story.sourceColor)}>
                {story.source.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors leading-snug line-clamp-1">
                  {story.title}
                </span>
                <span className="text-[10px] text-text-tertiary ml-1.5 font-medium">
                  — {story.source}
                </span>
              </div>
              <ArrowUpRight className="w-3 h-3 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Key Takeaways */}
      {keyTakeaways.length > 0 && (
        <div className="px-5 pb-4 border-t border-border-subtle pt-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Hash className="w-3.5 h-3.5 text-text-tertiary" />
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
              Key Takeaways
            </span>
          </div>
          <ul className="flex flex-col gap-1">
            {keyTakeaways.map((takeaway, i) => (
              <li key={i} className="text-xs text-text-secondary leading-relaxed flex gap-2">
                <span className="text-accent font-bold shrink-0">•</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
