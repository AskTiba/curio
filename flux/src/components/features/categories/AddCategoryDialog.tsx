"use client";

import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  "bg-blue-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-yellow-500",
];

export function AddCategoryDialog({ isOpen, onClose }: AddCategoryDialogProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      setName("");
      setSelectedColor(COLORS[0]);
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Category"
      description="Group related feeds together to organize your reading experience."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Category Name Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category-name" className="text-xs font-semibold text-text-primary">
            Category Name
          </label>
          <div className="relative">
            <FolderPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Technology, News, Newsletters..."
              required
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-md text-sm focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none"
            />
          </div>
        </div>

        {/* Color Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-primary">
            Badge Color
          </label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${color} ${
                  selectedColor === color ? "ring-2 ring-offset-2 ring-text-primary" : ""
                }`}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t border-border-subtle">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={!name}>
            Create Category
          </Button>
        </div>
      </form>
    </Modal>
  );
}
