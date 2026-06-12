import { SavedHeader } from "@/components/features/saved/SavedHeader";
import { SavedItem } from "@/components/features/saved/SavedItem";

export default function SavedPage() {
  return (
    <div className="flex flex-col min-h-full bg-surface">
      <SavedHeader />

      <div className="flex-1 flex flex-col">
        <div className="max-w-[1200px] w-full mx-auto">
          <div className="px-7 pt-4">
            <h3 className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em]">
              This Week
            </h3>
          </div>

          <SavedItem
            id="s1"
            source="Smashing Magazine"
            sourceColor="bg-red-500"
            timestamp="2h ago"
            savedAt="1h ago"
            title="Practical Guide To Designing For Colorblind Users"
            excerpt="Color blindness affects roughly 8% of men and 0.5% of women worldwide. Yet most interfaces rely heavily on color to convey meaning, status, and hierarchy."
            category="Design"
            categoryVariant="design"
          />

          <SavedItem
            id="s2"
            source="Simon Willison"
            sourceColor="bg-gray-800"
            timestamp="4h ago"
            savedAt="3h ago"
            title="Building Effective RAG Systems: What Actually Works in Production"
            excerpt="After months of experimenting with retrieval-augmented generation in real applications, here's what I've learned about chunking strategies, embedding models, and the surprising importance of metadata filtering."
            category="AI & ML"
            categoryVariant="aiml"
          />

          <SavedItem
            id="s3"
            source="Josh Comeau"
            sourceColor="bg-indigo-600"
            timestamp="5h ago"
            savedAt="4h ago"
            title="The Surprising Truth About CSS Container Queries"
            excerpt="Container queries have been available for a while now, but most developers are still using them like media queries with a different syntax."
            category="Frontend"
            categoryVariant="frontend"
            url="https://www.joshwcomeau.com/css/container-queries/"
          />

          <div className="px-7 pt-6">
            <h3 className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em]">
              Earlier
            </h3>
          </div>

          <SavedItem
            id="s4"
            source="Cloudflare Blog"
            sourceColor="bg-orange-500"
            timestamp="2d ago"
            savedAt="2d ago"
            title="How We Reduced P99 Latency by 60% with Edge-First Caching"
            excerpt="Our engineering team spent the last quarter rethinking how we cache at the edge. The result: dramatically lower tail latency for our most demanding customers."
            category="Backend & DevOps"
            categoryVariant="backend"
          />

          <SavedItem
            id="s5"
            source="CSS-Tricks"
            sourceColor="bg-[#ff7a2d]"
            timestamp="3d ago"
            savedAt="3d ago"
            title="A Complete Guide to CSS Cascade Layers"
            excerpt="Cascade layers give authors more control over the cascade. Learn how @layer works, when to use it, and how it interacts with specificity and importance."
            category="Frontend"
            categoryVariant="frontend"
          />

          <SavedItem
            id="s6"
            source="NN Group"
            sourceColor="bg-[#2f855a]"
            timestamp="4d ago"
            savedAt="3d ago"
            title="The Paradox of Choice in User Interface Design"
            excerpt="Offering too many options can paradoxically lead to decision paralysis and lower user satisfaction. Here's how to strike the right balance."
            category="Design"
            categoryVariant="design"
          />

          <SavedItem
            id="s7"
            source="Kent C. Dodds"
            sourceColor="bg-[#3182ce]"
            timestamp="5d ago"
            savedAt="4d ago"
            title="Full Stack Components: The Future of React"
            excerpt="Server Components, Server Actions, and the evolution of React into a truly full-stack framework. Here's what it means for your architecture."
            category="Frontend"
            categoryVariant="frontend"
          />

          <SavedItem
            id="s8"
            source="Figma Blog"
            sourceColor="bg-black"
            timestamp="1w ago"
            savedAt="6d ago"
            title="Design Systems at Scale: Lessons from Enterprise Teams"
            excerpt="How large organizations manage design systems with hundreds of components and thousands of consumers. The organizational challenges are harder than the technical ones."
            category="Design"
            categoryVariant="design"
          />

          <SavedItem
            id="s9"
            source="Sidebar.io"
            sourceColor="bg-[#7048e8]"
            timestamp="1w ago"
            savedAt="1w ago"
            title="Typography Trends That Actually Improve Readability"
            excerpt="Variable fonts, responsive type scales, and the return of serif typefaces. A curated look at typography choices that serve readers first."
            category="Design"
            categoryVariant="design"
          />

          <SavedItem
            id="s10"
            source="web.dev"
            sourceColor="bg-[#00a3af]"
            timestamp="1w ago"
            savedAt="1w ago"
            title="Core Web Vitals: A Developer's Field Guide for 2025"
            excerpt="INP replaced FID, and the goalposts continue to shift. Here's a practical, no-nonsense guide to meeting all three Core Web Vitals thresholds."
            category="Frontend"
            categoryVariant="frontend"
          />

          <SavedItem
            id="s11"
            source="UX Collective"
            sourceColor="bg-[#2c5282]"
            timestamp="2w ago"
            savedAt="2w ago"
            title="Micro-interactions That Users Actually Notice"
            excerpt="Not all micro-interactions are created equal. Research shows these specific patterns consistently improve perceived quality and user satisfaction."
            category="Design"
            categoryVariant="design"
          />

          <SavedItem
            id="s12"
            source="Smashing Magazine"
            sourceColor="bg-red-500"
            timestamp="2w ago"
            savedAt="2w ago"
            title="Progressive Enhancement in the Age of SPAs"
            excerpt="Single-page applications don't have to be all-or-nothing. Here's how to build resilient web applications that work even when JavaScript fails."
            category="Frontend"
            categoryVariant="frontend"
          />
        </div>
      </div>
    </div>
  );
}
