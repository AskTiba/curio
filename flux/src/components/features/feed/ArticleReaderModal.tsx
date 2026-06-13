"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, Calendar, User } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { format } from "date-fns";

interface ArticleReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    title: string;
    content: string;
    url?: string | null;
    author?: string | null;
    publishedAt?: Date | null;
    source: string;
  } | null;
}

export function ArticleReaderModal({ isOpen, onClose, article }: ArticleReaderModalProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    if (article?.content) {
      // Clean HTML from malicious scripts, and also strip typical ads/junk if possible.
      // isomorphic-dompurify handles basic sanitation
      setSanitizedHtml(DOMPurify.sanitize(article.content, {
        FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed'],
        FORBID_ATTR: ['style', 'class', 'id']
      }));
    }
  }, [article]);

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

          <div 
            className="prose prose-blue prose-lg max-w-none text-text-primary leading-relaxed
              prose-headings:font-bold prose-headings:text-text-primary prose-headings:tracking-tight
              prose-a:text-accent hover:prose-a:text-accent-hover prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl
              prose-p:mb-6 prose-li:mb-2"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml || (article.content ? "Content could not be parsed." : "This feed does not provide full content.") }}
          />
        </article>
      </div>
    </div>
  );
}
