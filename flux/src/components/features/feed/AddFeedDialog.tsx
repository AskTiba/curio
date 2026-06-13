"use client";

import { useState } from "react";
import { Link2, Rss, AlertCircle, Folder } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAddFeed } from "@/hooks/useFeeds";
import { useCategories } from "@/hooks/useCategories";

interface AddFeedDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFeedDialog({ isOpen, onClose }: AddFeedDialogProps) {
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const { mutateAsync, isPending, error, reset } = useAddFeed();
  const { data: categories = [] } = useCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({ url, categoryId: categoryId || undefined });
      onClose();
      setUrl("");
      setCategoryId("");
      reset();
    } catch {
      // Error is handled by TanStack Query and exposed via the `error` object
    }
  };

  const handleClose = () => {
    onClose();
    setUrl("");
    setCategoryId("");
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Feed"
      description="Subscribe to an RSS or Atom feed URL to get updates."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* URL Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="feed-url" className="text-xs font-semibold text-text-primary">
            Feed URL
          </label>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
            <input
              id="feed-url"
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); if (error) reset(); }}
              placeholder="https://example.com/feed.xml"
              required
              disabled={isPending}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-text-primary placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50 disabled:bg-gray-50"
            />
          </div>
          {error && (
            <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-md p-2.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error instanceof Error ? error.message : "Failed to add feed"}</span>
            </div>
          )}
        </div>

        {/* Category Selection */}
        <div className="flex flex-col gap-2">
          <label htmlFor="feed-category" className="text-xs font-semibold text-text-primary">
            Category (Optional)
          </label>
          <div className="relative">
            <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
            <select
              id="feed-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isPending}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50 disabled:bg-gray-50 appearance-none"
            >
              <option value="">Uncategorized</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/70 border border-blue-100">
          <Rss className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            Frontpage will automatically parse the feed and extract its title, description, and icon.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isPending}
            disabled={!url || isPending}
          >
            Add Feed
          </Button>
        </div>
      </form>
    </Modal>
  );
}
