import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-radius-sm px-1.5 py-0.5 text-[10px] font-bold tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-bg-tertiary text-text-secondary",
        primary: "bg-accent/10 text-accent",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        error: "bg-error/10 text-error",
        // Category Specifics (Preview Match)
        design: "bg-pink-100 text-pink-600",
        backend: "bg-orange-100 text-orange-600",
        aiml: "bg-purple-100 text-purple-600",
        frontend: "bg-blue-100 text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Atomic Badge component for Flux.
 * Used for tagging categories, status indicators, and unread marks.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
