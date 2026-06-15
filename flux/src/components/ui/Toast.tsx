"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: "border-success/20 bg-success/5 text-success",
  error: "border-error/20 bg-error/5 text-error",
  info: "border-accent/20 bg-accent/5 text-accent",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const Icon = icons[toast.type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-lg border shadow-md text-sm font-medium animate-in slide-in-from-right-full transition-all",
        colors[toast.type]
      )}
    >
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 rounded hover:opacity-70 transition-opacity cursor-pointer shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    const timer = setTimeout(() => dismiss(id), 4000);
    timers.current.set(id, timer);
  }, [dismiss]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
