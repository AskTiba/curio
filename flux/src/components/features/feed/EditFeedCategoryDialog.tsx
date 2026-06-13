"use client";

import { useState, useEffect } from "react";
import { Folder } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useUpdateFeedCategory } from "@/hooks/useFeeds";
import { useCategories } from "@/hooks/useCategories";

interface EditFeedCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  feed: { id: string; title: string | null; categoryId: string | null } | null;
}

export function EditFeedCategoryDialog({ isOpen, onClose, feed }: EditFeedCategoryDialogProps) {
  const [categoryId, setCategoryId] = useState("");
  const { mutateAsync, isPending } = useUpdateFeedCategory();
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    if (feed) {
      setCategoryId(feed.categoryId || "");
    }
  }, [feed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feed) return;
    
    try {
      await mutateAsync({ feedId: feed.id, categoryId: categoryId || null });
      onClose();
    } catch {
      // Error is handled by TanStack Query
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Move Feed"
      description={`Choose a new category for "${feed?.title || 'this feed'}".`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Category Selection */}
        <div className="flex flex-col gap-2">
          <label htmlFor="edit-feed-category" className="text-xs font-semibold text-text-primary">
            Category
          </label>
          <div className="relative">
            <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
            <select
              id="edit-feed-category"
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
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isPending}
            disabled={isPending}
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
