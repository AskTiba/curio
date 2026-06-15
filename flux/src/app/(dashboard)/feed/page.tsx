import { Suspense } from "react";
import { FeedContent } from "@/components/features/feed/FeedContent";

export default function FeedPage() {
  return (
    <div className="flex flex-col min-h-full bg-surface">
      <Suspense fallback={null}>
        <FeedContent />
      </Suspense>
    </div>
  );
}
