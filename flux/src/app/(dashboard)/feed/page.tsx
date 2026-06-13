import { FeedHeader } from "@/components/features/feed/FeedHeader";
import { FeedList } from "@/components/features/feed/FeedList";

export default function FeedPage() {
  return (
    <div className="flex flex-col min-h-full bg-surface">
      <FeedHeader />

      <div className="flex-1 flex flex-col">
        <div className="py-2 bg-accent-subtle text-accent text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-100 transition-colors border-b border-border-subtle">
          <span>↑</span>
          <span>Check for new items</span>
        </div>

        <div className="max-w-[1200px] w-full mx-auto pb-12">
          <FeedList />
        </div>
      </div>
    </div>
  );
}
