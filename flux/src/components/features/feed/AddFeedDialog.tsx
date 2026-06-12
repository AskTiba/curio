"use client";

import { useState } from "react";
import { Link, Rss, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface AddFeedDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFeedDialog({ isOpen, onClose }: AddFeedDialogProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      setUrl("");
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Feed"
      description="Subscribe to an RSS or Atom feed URL to get updates."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* URL Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="feed-url" className="text-xs font-semibold text-text-primary">
            Feed URL
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              id="feed-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/feed.xml"
              required
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-md text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none"
            />
          </div>
        </div>

        {/* Info box */}
        <div className="flex items-start gap-2.5 p-3 rounded-md bg-bg-secondary border border-border-subtle">
          <Rss className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            Frontpage will automatically parse the feed and extract its title, description, and icon.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={!url}>
            Add Feed
          </Button>
        </div>
      </form>
    </Modal>
  );
}
