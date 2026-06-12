import { cn } from "@/lib/utils";

/**
 * Loading placeholder skeleton for Flux.
 * Essential for the "Initial load < 3s" performance target.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-radius-md bg-bg-tertiary", className)}
      {...props}
    />
  );
}

export { Skeleton };
