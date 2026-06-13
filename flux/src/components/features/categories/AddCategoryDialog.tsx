"use client";

import { useState } from "react";
import { FolderPlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAddCategory } from "@/hooks/useCategories";

interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  { name: "Blue", value: "bg-blue-500", ring: "ring-blue-500" },
  { name: "Pink", value: "bg-pink-500", ring: "ring-pink-500" },
  { name: "Orange", value: "bg-orange-500", ring: "ring-orange-500" },
  { name: "Indigo", value: "bg-indigo-500", ring: "ring-indigo-500" },
  { name: "Purple", value: "bg-purple-500", ring: "ring-purple-500" },
  { name: "Emerald", value: "bg-emerald-500", ring: "ring-emerald-500" },
  { name: "Rose", value: "bg-rose-500", ring: "ring-rose-500" },
  { name: "Amber", value: "bg-amber-500", ring: "ring-amber-500" },
];

export function AddCategoryDialog({ isOpen, onClose }: AddCategoryDialogProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const { mutateAsync, isPending, error, reset } = useAddCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({ name, color: selectedColor });
      onClose();
      setName("");
      setSelectedColor(COLORS[0].value);
      reset();
    } catch {
      // Error is handled by TanStack query
    }
  };

  const handleClose = () => {
    onClose();
    setName("");
    setSelectedColor(COLORS[0].value);
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Category"
      description="Group related feeds together to organize your reading experience."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Category Name Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="category-name" className="text-xs font-semibold text-text-primary">
            Category Name
          </label>
          <div className="relative">
            <FolderPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); if (error) reset(); }}
              placeholder="e.g. Technology, News, Newsletters..."
              required
              disabled={isPending}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-text-primary placeholder:text-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all outline-none disabled:opacity-50 disabled:bg-gray-50"
            />
          </div>
          {error && (
            <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-md p-2.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error instanceof Error ? error.message : "Failed to create category"}</span>
            </div>
          )}
        </div>

        {/* Color Picker */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-semibold text-text-primary">
            Badge Color
          </label>
          <div className="flex flex-wrap gap-2.5">
            {COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                disabled={isPending}
                className={`w-7 h-7 rounded-full transition-all duration-150 hover:scale-110 flex items-center justify-center disabled:opacity-50 cursor-pointer ${color.value} ${
                  selectedColor === color.value 
                    ? "ring-2 ring-offset-2 ring-gray-900 scale-110" 
                    : "ring-0 hover:ring-1 hover:ring-offset-1 hover:ring-gray-300"
                }`}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <Button type="button" variant="ghost" size="md" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isPending} disabled={!name || isPending}>
            Create Category
          </Button>
        </div>
      </form>
    </Modal>
  );
}
