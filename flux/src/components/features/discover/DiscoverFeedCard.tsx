"use client";

import { Plus, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiscoverFeedCardProps {
  name: string;
  description: string;
  url: string;
  iconLetter: string;
  iconColor: string;
  subscriberCount?: string;
  category: string;
  isSubscribed?: boolean;
}

/**
 * DiscoverFeedCard — A card representing a discoverable RSS feed.
 * Shows feed metadata, a subscribe/unsubscribe toggle, and external link.
 */
export function DiscoverFeedCard({
  name,
  description,
  url,
  iconLetter,
  iconColor,
  subscriberCount,
  category,
  isSubscribed = false,
}: DiscoverFeedCardProps) {
  return (
    <div className="border border-border rounded-lg bg-surface p-4 flex gap-3.5 group hover:border-accent/30 hover:shadow-sm transition-all">
      {/* Feed Icon */}
      <div className={cn(
        "w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold text-white shadow-sm",
        iconColor
      )}>
        {iconLetter}
      </div>

      {/* Feed Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <h3 className="text-sm font-bold text-text-primary leading-snug truncate">
              {name}
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-text-tertiary font-medium">
              <span className="truncate">{url}</span>
              {subscriberCount && (
                <>
                  <span>•</span>
                  <span className="shrink-0">{subscriberCount} subscribers</span>
                </>
              )}
            </div>
          </div>

          {/* Subscribe Button */}
          <button
            className={cn(
              "shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all",
              isSubscribed
                ? "bg-success/10 text-success border border-success/20"
                : "bg-accent text-white hover:bg-accent-hover shadow-sm"
            )}
          >
            {isSubscribed ? (
              <>
                <Check className="w-3 h-3" />
                Following
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                Follow
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-text-tertiary bg-bg-secondary px-1.5 py-0.5 rounded">
            {category}
          </span>
          <a
            href={`https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-[10px] text-text-tertiary hover:text-accent font-medium"
          >
            Visit site
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
