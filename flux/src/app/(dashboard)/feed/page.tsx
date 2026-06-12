import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FeedHeader } from "@/components/features/feed/FeedHeader";
import { FeedItem } from "@/components/features/feed/FeedItem";

export default function FeedPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-full bg-surface">
        <FeedHeader />

        <div className="flex-1 flex flex-col">
          <div className="py-2 bg-accent-subtle text-accent text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-100 transition-colors border-b border-border-subtle">
            <span>↑</span>
            <span>5 new items since your last visit</span>
          </div>

          <div className="max-w-[1200px] w-full mx-auto">
            <div className="px-7 pt-4">
              <h3 className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em]">
                Today
              </h3>
            </div>

            <FeedItem
              id="1"
              source="Smashing Magazine"
              sourceColor="bg-red-500"
              timestamp="2h ago"
              title="Practical Guide To Designing For Colorblind Users"
              excerpt="Color blindness affects roughly 8% of men and 0.5% of women worldwide. Yet most interfaces rely heavily on color to convey meaning, status, and hierarchy. Here's how to design interfaces that work for everyone without sacrificing visual richness."
              category="Design"
              categoryVariant="design"
            />

            <FeedItem
              id="2"
              source="Cloudflare Blog"
              sourceColor="bg-orange-500"
              timestamp="3h ago"
              title="How We Reduced P99 Latency by 60% with Edge-First Caching"
              excerpt="Our engineering team spent the last quarter rethinking how we cache at the edge. The result: dramatically lower tail latency for our most demanding customers, and lessons applicable to any distributed system."
              category="Backend & DevOps"
              categoryVariant="backend"
            />

            <FeedItem
              id="3"
              source="Simon Willison"
              sourceColor="bg-gray-800"
              timestamp="4h ago"
              title="Building Effective RAG Systems: What Actually Works in Production"
              excerpt="After months of experimenting with retrieval-augmented generation in real applications, here's what I've learned about chunking strategies, embedding models, and the surprising importance of metadata filtering."
              category="AI & ML"
              categoryVariant="aiml"
            />

            <FeedItem
              id="4"
              source="Josh Comeau"
              sourceColor="bg-indigo-600"
              timestamp="5h ago"
              title="The Surprising Truth About CSS Container Queries"
              excerpt="Container queries have been available for a while now, but most developers are still using them like media queries with a different syntax. There's a much more powerful mental model that unlocks truly reusable components."
              category="Frontend"
              categoryVariant="frontend"
            />

            <FeedItem
              id="5"
              source="Figma Blog"
              sourceColor="bg-black"
              timestamp="6h ago"
              title="Introducing Variables 2.0: Design Tokens Meet Real Logic"
              excerpt="Variables in Figma now support conditional logic, mathematical expressions, and cross-file references. This unlocks design system workflows that were previously only possible in code."
              category="Design"
              categoryVariant="design"
              isRead
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
