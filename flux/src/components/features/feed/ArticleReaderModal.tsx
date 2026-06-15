"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ExternalLink, Calendar, User, Loader2 } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { format } from "date-fns";
import { getFullArticleContent } from "@/actions/articles";

interface ArticleReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    id: string;
    title: string;
    content: string;
    url?: string | null;
    author?: string | null;
    publishedAt?: Date | null;
    source: string;
    thumbnailUrl?: string | null;
  } | null;
}

export function ArticleReaderModal({ isOpen, onClose, article }: ArticleReaderModalProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (article?.content) {
      setSanitizedHtml(DOMPurify.sanitize(article.content, {
        FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed'],
        FORBID_ATTR: ['style', 'class', 'id']
      }));
    }
  }, [article]);

  useEffect(() => {
    if (!isOpen || !article) {
      setIsFetching(false);
      setFetchError(false);
    }
  }, [isOpen, article]);

  const tryFetchFull = useCallback(async () => {
    if (!article || !article.url || !article.id) return;
    if (article.content.length > 500) return;
    if (isFetching) return;

    setIsFetching(true);
    setFetchError(false);

    try {
      const result = await getFullArticleContent(article.id, article.url);
      if (result.fetched && result.content) {
        setSanitizedHtml(DOMPurify.sanitize(result.content, {
          FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed'],
          FORBID_ATTR: ['style', 'class', 'id']
        }));
      } else {
        setFetchError(true);
      }
    } catch {
      setFetchError(true);
    } finally {
      setIsFetching(false);
    }
  }, [article, isFetching]);

  useEffect(() => {
    if (isOpen && article) {
      tryFetchFull();
    }
  }, [isOpen, article, tryFetchFull]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div 
        className="w-full md:w-[85%] lg:w-[70%] max-w-4xl h-full bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        {/* Header Strip */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-border z-10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm font-semibold text-text-secondary">
            <span className="text-accent">{article.source}</span>
            {article.url && (
              <a 
                href={article.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                View Original <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-text-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article Body */}
        <article className="max-w-2xl mx-auto px-6 py-12 md:py-16">
          {article.thumbnailUrl && (
            <div className="relative -mx-6 -mt-12 mb-8 overflow-hidden h-64 md:h-80 bg-bg-tertiary">
              <img
                src={article.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary leading-tight mb-6 tracking-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              {article.author && (
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="w-4 h-4" />
                  {article.author}
                </div>
              )}
              {article.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(article.publishedAt), "MMMM d, yyyy")}
                </div>
              )}
            </div>
          </header>

          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-6 h-6 text-accent animate-spin" />
              <p className="text-sm text-text-tertiary font-medium">Fetching full article...</p>
            </div>
          ) : (
            <div 
              className="prose prose-blue prose-lg max-w-none text-text-primary leading-relaxed
                prose-headings:font-bold prose-headings:text-text-primary prose-headings:tracking-tight
                prose-a:text-accent hover:prose-a:text-accent-hover prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl
                prose-p:mb-6 prose-li:mb-2"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml || (fetchError && article.content ? "Content could not be parsed." : fetchError ? "Could not fetch full article. Try viewing the original." : "This feed does not provide full content.") }}
            />
          )}
        </article>
      </div>
    </div>
  );
}
