"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { X, ExternalLink, Calendar, User, Loader2, RefreshCw } from "lucide-react";
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
  const fetchingRef = useRef(false);

  useEffect(() => {
    if (!article) return;
    setSanitizedHtml(DOMPurify.sanitize(article.content, {
      FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed'],
      FORBID_ATTR: ['style', 'class', 'id']
    }));
    setFetchError(false);
  }, [article]);

  useEffect(() => {
    if (!isOpen || !article) {
      setIsFetching(false);
      setFetchError(false);
      fetchingRef.current = false;
    }
  }, [isOpen, article]);

  const fetchFullArticle = useCallback(async (id: string, url: string) => {
    if (fetchingRef.current) return;

    fetchingRef.current = true;
    setIsFetching(true);
    setFetchError(false);

    try {
      const result = await getFullArticleContent(id, url);
      if (result.fetched && result.content) {
        setSanitizedHtml(DOMPurify.sanitize(result.content, {
          FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed'],
          FORBID_ATTR: ['style', 'class', 'id']
        }));
      } else if (!result.content) {
        if (result.invalid) {
          setSanitizedHtml("");
        }
        setFetchError(true);
      }
    } catch {
      setFetchError(true);
    } finally {
      setIsFetching(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !article?.url || !article?.id) return;
    fetchFullArticle(article.id, article.url);
  }, [isOpen, article?.id, article?.url, fetchFullArticle]);

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

  const hostname = article.url ? new URL(article.url).hostname : "";

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div 
        className="w-full md:w-[85%] lg:w-[70%] max-w-4xl h-full bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        {/* Header Strip */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-border z-10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm font-semibold text-text-secondary">
            <span className="text-accent">{article.source}</span>
            {article.url && !isFetching && (
              <a 
                href={article.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                View Original <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {isFetching && (
              <span className="inline-flex items-center gap-1.5 text-xs text-text-tertiary font-medium">
                <Loader2 className="w-3 h-3 animate-spin" />
                Loading full article...
              </span>
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

          {/* Full article content */}
          {sanitizedHtml && (
            <div 
              className="prose prose-blue prose-lg max-w-none text-text-primary leading-relaxed
                prose-headings:font-bold prose-headings:text-text-primary prose-headings:tracking-tight
                prose-a:text-accent hover:prose-a:text-accent-hover prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl
                prose-p:mb-6 prose-li:mb-2"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          )}

          {/* Fallback when no article content could be extracted */}
          {!sanitizedHtml && (
            <div className="text-center py-16">
              <p className="text-text-tertiary mb-6">
                {fetchError
                  ? "This article requires JavaScript to display. Open it in your browser to read."
                  : "This feed does not provide full article content."}
              </p>
              {article.url && (
                <div className="flex items-center justify-center gap-4">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover font-semibold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Read full article on {hostname}
                  </a>
                  {fetchError && (
                    <button
                      onClick={() => article.url && article.id && fetchFullArticle(article.id, article.url)}
                      disabled={isFetching}
                      className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary font-semibold disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                      Retry
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
