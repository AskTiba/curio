import { DigestHeader } from "@/components/features/digest/DigestHeader";
import { DigestSection } from "@/components/features/digest/DigestSection";

export default function DigestPage() {
  return (
    <div className="flex flex-col min-h-full bg-surface">
      <DigestHeader />

      <div className="flex-1">
        <div className="max-w-[900px] w-full mx-auto px-4 sm:px-8 py-6">
          {/* Digest Introduction */}
          <div className="mb-6 p-4 bg-gradient-to-r from-accent-subtle to-bg-secondary border border-accent/20 rounded-lg">
            <p className="text-xs text-text-primary font-medium leading-relaxed">
              <span className="font-bold">AI-generated summary</span> — Your personalized digest
              covers <span className="font-bold">47 articles</span> across{" "}
              <span className="font-bold">5 categories</span> from the last 24 hours.
              Powered by AI to surface what matters most.
            </p>
          </div>

          {/* Digest Sections Grid */}
          <div className="flex flex-col gap-4">
            <DigestSection
              category="Frontend"
              categoryVariant="frontend"
              dotColor="bg-blue-500"
              articleCount={14}
              summary="CSS container queries are gaining traction as developers discover use cases beyond responsive layout. Josh Comeau argues the real power lies in a component-driven mental model. Meanwhile, Core Web Vitals updates continue to shift optimization priorities, with INP becoming the dominant pain point for complex SPAs."
              topStories={[
                {
                  title: "The Surprising Truth About CSS Container Queries",
                  source: "Josh Comeau",
                  sourceColor: "bg-indigo-600",
                },
                {
                  title: "Core Web Vitals: A Developer's Field Guide for 2025",
                  source: "web.dev",
                  sourceColor: "bg-[#00a3af]",
                },
                {
                  title: "A Complete Guide to CSS Cascade Layers",
                  source: "CSS-Tricks",
                  sourceColor: "bg-[#ff7a2d]",
                },
              ]}
              keyTakeaways={[
                "Container queries enable truly portable component-level responsive design",
                "INP optimization requires rethinking event handler architecture, not just bundle size",
                "Cascade layers provide specificity control without !important or deep nesting",
              ]}
            />

            <DigestSection
              category="Design"
              categoryVariant="design"
              dotColor="bg-pink-500"
              articleCount={11}
              summary="Accessibility in color design is getting renewed attention, with Smashing Magazine publishing a practical guide for colorblind users. Figma's Variables 2.0 introduces conditional logic to design tokens, potentially bridging the gap between design systems and code. Typography trends favor readability over novelty."
              topStories={[
                {
                  title: "Practical Guide To Designing For Colorblind Users",
                  source: "Smashing Magazine",
                  sourceColor: "bg-red-500",
                },
                {
                  title: "Introducing Variables 2.0: Design Tokens Meet Real Logic",
                  source: "Figma Blog",
                  sourceColor: "bg-black",
                },
                {
                  title: "Typography Trends That Actually Improve Readability",
                  source: "Sidebar.io",
                  sourceColor: "bg-[#7048e8]",
                },
              ]}
              keyTakeaways={[
                "8% of men have some form of color vision deficiency — never rely on color alone",
                "Figma Variables 2.0 supports math expressions and cross-file references",
                "Variable fonts and responsive type scales are becoming the industry standard",
              ]}
            />

            <DigestSection
              category="Backend & DevOps"
              categoryVariant="backend"
              dotColor="bg-orange-500"
              articleCount={8}
              summary="Edge computing continues to dominate infrastructure conversations. Cloudflare reports a 60% reduction in P99 latency through edge-first caching strategies. The trend suggests a shift away from centralized caching toward distributed, locality-aware patterns that optimize for tail latency rather than average response times."
              topStories={[
                {
                  title: "How We Reduced P99 Latency by 60% with Edge-First Caching",
                  source: "Cloudflare Blog",
                  sourceColor: "bg-orange-500",
                },
                {
                  title: "Observability Beyond Logs: Distributed Tracing in Practice",
                  source: "Honeycomb",
                  sourceColor: "bg-amber-600",
                },
              ]}
              keyTakeaways={[
                "Edge-first caching dramatically reduces tail latency for geographically distributed users",
                "Distributed tracing reveals performance bottlenecks that traditional logging misses",
              ]}
            />

            <DigestSection
              category="AI & ML"
              categoryVariant="aiml"
              dotColor="bg-purple-500"
              articleCount={8}
              summary="RAG systems are moving from experimentation to production deployment. Simon Willison highlights that chunking strategy and metadata filtering are more impactful than embedding model choice. The practical challenges of production RAG — stale indices, hallucination detection, and cost management — are becoming the primary focus."
              topStories={[
                {
                  title: "Building Effective RAG Systems: What Actually Works in Production",
                  source: "Simon Willison",
                  sourceColor: "bg-gray-800",
                },
                {
                  title: "The Hidden Cost of Fine-Tuning: When RAG Is Actually Better",
                  source: "Latent Space",
                  sourceColor: "bg-violet-600",
                },
              ]}
              keyTakeaways={[
                "Metadata filtering improves retrieval accuracy more than switching embedding models",
                "RAG is often more cost-effective than fine-tuning for knowledge-intensive applications",
                "Production RAG requires ongoing index maintenance and staleness detection",
              ]}
            />

            <DigestSection
              category="General Tech"
              categoryVariant="default"
              dotColor="bg-indigo-500"
              articleCount={6}
              summary="Industry discussions are centered on developer experience and tooling maturity. The TypeScript ecosystem continues to expand with new type-level programming patterns, while the debate around build tool fragmentation shows signs of consolidation around Vite and its ecosystem."
              topStories={[
                {
                  title: "The State of TypeScript: Advanced Patterns in 2025",
                  source: "Matt Pocock",
                  sourceColor: "bg-blue-600",
                },
                {
                  title: "Build Tools Are Converging, and That's a Good Thing",
                  source: "Evan You",
                  sourceColor: "bg-emerald-600",
                },
              ]}
              keyTakeaways={[
                "Discriminated unions and branded types are becoming mainstream TypeScript patterns",
                "Vite's plugin ecosystem is becoming the de facto standard for build tool interoperability",
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
