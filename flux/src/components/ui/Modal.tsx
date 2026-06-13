"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Reusable Modal component for dialogs (Add Feed, Add Category, etc.)
 */
export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  // Prevent body scroll when modal is open
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

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 transition-opacity cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md pointer-events-auto flex flex-col overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold text-text-primary tracking-tight">{title}</h2>
              {description && (
                <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="h-7 w-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer -mr-1 -mt-0.5"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
