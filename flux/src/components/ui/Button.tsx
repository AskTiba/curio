import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-radius-md text-text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white hover:bg-accent-hover shadow-sm",
        secondary: "bg-bg-tertiary text-text-primary hover:bg-border border border-border-subtle",
        outline: "border border-border bg-surface text-text-primary hover:bg-bg-secondary hover:border-text-tertiary",
        ghost: "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary",
        destructive: "bg-error text-white hover:opacity-90 shadow-sm",
      },
      size: {
        sm: "h-8 px-spacing-3 text-text-xs",
        md: "h-10 px-spacing-6 py-spacing-2",
        lg: "h-12 px-spacing-8 text-text-base",
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
          <div className="flex items-center gap-spacing-2">
            <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
            {children}
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
