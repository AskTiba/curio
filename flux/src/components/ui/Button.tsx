import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97] cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-accent to-accent-hover text-white shadow-sm hover:from-accent-hover hover:to-accent",
        secondary:
          "bg-surface text-text-primary shadow-sm border border-border hover:bg-bg-tertiary hover:border-border",
        outline:
          "border border-border bg-transparent text-text-primary hover:bg-bg-tertiary hover:border-border",
        ghost:
          "text-text-secondary hover:bg-bg-tertiary hover:text-text-hover",
        destructive:
          "bg-gradient-to-b from-[#ef4444] to-[#dc2626] text-white shadow-sm hover:from-[#dc2626] hover:to-[#b91c1c] hover:shadow-[0_2px_6px_rgba(239,68,68,0.3)]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

/**
 * Highly polished, multi-variant Button component for Flux.
 * Uses CVA for type-safe variants and handles standard states.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            <span>{children}</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
