"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-50 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md pointer-events-auto flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b border-border">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-text-primary tracking-tight">{title}</h2>
              {description && (
                <p className="text-xs text-text-secondary">{description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-md -mr-2"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Body */}
          <div className="p-6 flex flex-col gap-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
