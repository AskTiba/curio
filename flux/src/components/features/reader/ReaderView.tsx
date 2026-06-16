"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Bookmark, ExternalLink, Calendar, User } from "lucide-react";
import { Article } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ReaderViewProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  onToggleBookmark?: (id: string) => void;
}

/**
 * Premium Reader View Component
 * - Implements a slide-over panel on the right side of the screen
 * - Restricts max content width to 45rem (typography comfort)
 * - Renders metadata, tags, and clean styled HTML content using Georgia font
 */
export function ReaderView({
  isOpen,
  onClose,
  article,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
  onToggleBookmark,
}: ReaderViewProps) {
  // Prevent body scroll when reader is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!article) return null;

  // Format date helper
  const formatDate = (dateInput?: Date | string) => {
    if (!dateInput) return "";
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-full md:w-[600px] lg:w-[750px] z-50 bg-surface shadow-2xl border-l border-border flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Reader Top Action Bar */}
        <div className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="p-1.5 h-8 w-8 rounded-md"
              onClick={onClose}
              title="Close Reader"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </Button>
            <div className="w-px h-4 bg-border mx-1" />
            
            {/* Prev / Next Pagination */}
            <Button
              variant="secondary"
              size="sm"
              className="p-1.5 h-8 w-8 rounded-md"
              onClick={onPrev}
              disabled={!hasPrev}
              title="Previous Article"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="p-1.5 h-8 w-8 rounded-md"
              onClick={onNext}
              disabled={!hasNext}
              title="Next Article"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark button */}
            <Button
              variant="secondary"
              size="sm"
              className={`gap-1.5 h-8 rounded-md px-3 text-xs font-semibold ${
                article.isBookmarked
                  ? "bg-accent-subtle text-accent border-accent/20 hover:bg-accent/10"
                  : ""
              }`}
              onClick={() => onToggleBookmark?.(article.id)}
            >
              <Bookmark className={`w-3.5 h-3.5 ${article.isBookmarked ? "fill-accent text-accent" : ""}`} />
              <span>{article.isBookmarked ? "Saved" : "Save"}</span>
            </Button>

            {/* Original link button */}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 h-8 rounded-md px-3 bg-bg-tertiary border border-border text-xs font-semibold text-text-secondary hover:text-text-hover hover:bg-border transition-all"
            >
              <span>Visit Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-12 bg-surface">
          <div className="max-w-[45rem] mx-auto flex flex-col gap-6">
            {/* Tag/Category */}
            <div>
              <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider rounded-sm">
                Feed Item
              </Badge>
            </div>

            {/* Title */}
            <h1 className="font-sans font-bold text-2xl md:text-3xl text-text-primary leading-tight">
              {article.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-text-tertiary border-b border-border pb-6 font-medium">
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>By {article.author}</span>
                </div>
              )}
              {article.publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              )}
            </div>

            {/* Article Main Text Content (Serif Typography) */}
            <div
              className="reader-content select-text"
              dangerouslySetInnerHTML={{
                __html: article.content || `<p className="italic">${article.excerpt}</p>`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
