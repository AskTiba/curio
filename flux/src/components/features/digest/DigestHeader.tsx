"use client";

import { Sparkles, ChevronDown, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * DigestHeader — Header bar for the AI Digest page.
 * Shows the digest date, period selector, and regenerate control.
 */
export function DigestHeader() {
  return (
    <div className="flex flex-col sm:flex-row text-sm sm:items-center justify-between px-4 sm:px-8 py-3 sm:py-4 gap-3 sm:gap-0 border-b border-border bg-surface sticky top-0 z-40">
      <div className="flex items-baseline gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h1 className="font-semibold text-base tracking-tight">Digest</h1>
        </div>
        <span className="text-text-tertiary font-medium">Today&apos;s Summary</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium text-text-tertiary">
        {/* Period selector */}
        <Button variant="secondary" size="sm" className="gap-2 px-3">
          <Calendar className="w-4 h-4 text-text-tertiary" />
          Today
          <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" />
        </Button>

        {/* Regenerate */}
        <Button variant="secondary" size="sm" className="gap-2 px-3">
          <RefreshCw className="w-4 h-4 text-text-tertiary" />
          Regenerate
        </Button>
      </div>
    </div>
  );
}
