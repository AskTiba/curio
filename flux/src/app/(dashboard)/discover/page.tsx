import { DiscoverHeader } from "@/components/features/discover/DiscoverHeader";
import { DiscoverFeedCard } from "@/components/features/discover/DiscoverFeedCard";

export default function DiscoverPage() {
  return (
    <div className="flex flex-col min-h-full bg-surface">
      <DiscoverHeader />

      <div className="flex-1">
        <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-8 py-6">
          {/* Popular / Recommended */}
          <div className="mb-6">
            <h2 className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-3">
              Popular in Frontend
            </h2>
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
              <DiscoverFeedCard
                name="CSS-Tricks"
                description="Daily articles about CSS, HTML, JavaScript, and all things web design and development. Founded by Chris Coyier."
                url="css-tricks.com"
                iconLetter="C"
                iconColor="bg-[#ff7a2d]"
                subscriberCount="42K"
                category="Frontend"
                isSubscribed
              />
              <DiscoverFeedCard
                name="Smashing Magazine"
                description="For professional web designers and developers. Techniques, tools, and best practices for modern web development."
                url="smashingmagazine.com"
                iconLetter="S"
                iconColor="bg-red-500"
                subscriberCount="38K"
                category="Frontend"
                isSubscribed
              />
              <DiscoverFeedCard
                name="Josh Comeau"
                description="In-depth tutorials about CSS, React, and web development. Known for interactive, visual explanations."
                url="joshwcomeau.com"
                iconLetter="J"
                iconColor="bg-indigo-600"
                subscriberCount="15K"
                category="Frontend"
                isSubscribed
              />
              <DiscoverFeedCard
                name="web.dev"
                description="Google's resource for modern web development. Guidance on performance, accessibility, and best practices."
                url="web.dev"
                iconLetter="w"
                iconColor="bg-[#00a3af]"
                subscriberCount="29K"
                category="Frontend"
                isSubscribed
              />
            </div>
          </div>

          {/* Design Category */}
          <div className="mb-6">
            <h2 className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-3">
              Popular in Design
            </h2>
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
              <DiscoverFeedCard
                name="Sidebar.io"
                description="The 5 best design links, every day. Curated by Sacha Greif, focused on UI design, UX, and creative inspiration."
                url="sidebar.io"
                iconLetter="S"
                iconColor="bg-[#7048e8]"
                subscriberCount="22K"
                category="Design"
                isSubscribed
              />
              <DiscoverFeedCard
                name="Nielsen Norman Group"
                description="World leaders in research-based user experience. Evidence-based articles on UX, usability, and design strategy."
                url="nngroup.com"
                iconLetter="N"
                iconColor="bg-[#2f855a]"
                subscriberCount="31K"
                category="Design"
                isSubscribed
              />
              <DiscoverFeedCard
                name="Figma Blog"
                description="Design tips, product updates, and community stories from the team at Figma."
                url="figma.com/blog"
                iconLetter="F"
                iconColor="bg-[#1a202c]"
                subscriberCount="19K"
                category="Design"
                isSubscribed
              />
              <DiscoverFeedCard
                name="Dribbble Blog"
                description="Design trends, inspiration, and creative insights from the Dribbble community and team."
                url="dribbble.com/blog"
                iconLetter="D"
                iconColor="bg-pink-500"
                subscriberCount="25K"
                category="Design"
              />
            </div>
          </div>

          {/* Suggested / New */}
          <div className="mb-6">
            <h2 className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-3">
              Suggested for You
            </h2>
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
              <DiscoverFeedCard
                name="Latent Space"
                description="The podcast and blog about the rapidly evolving AI engineering landscape. Technical deep dives and industry analysis."
                url="latent.space"
                iconLetter="L"
                iconColor="bg-violet-600"
                subscriberCount="18K"
                category="AI & ML"
              />
              <DiscoverFeedCard
                name="The Pragmatic Engineer"
                description="Gergely Orosz's newsletter on software engineering culture, big tech, and startup insights."
                url="pragmaticengineer.com"
                iconLetter="P"
                iconColor="bg-emerald-600"
                subscriberCount="52K"
                category="General Tech"
              />
              <DiscoverFeedCard
                name="Tailwind Blog"
                description="Official blog from the Tailwind CSS team. Framework updates, design philosophy, and utility-first CSS patterns."
                url="tailwindcss.com/blog"
                iconLetter="T"
                iconColor="bg-sky-500"
                subscriberCount="35K"
                category="Frontend"
              />
              <DiscoverFeedCard
                name="ByteByteGo"
                description="Alex Xu's system design newsletter. Visual explanations of complex distributed systems concepts."
                url="blog.bytebytego.com"
                iconLetter="B"
                iconColor="bg-yellow-500"
                subscriberCount="41K"
                category="Backend & DevOps"
              />
              <DiscoverFeedCard
                name="Hacker News"
                description="Y Combinator's social news website focusing on computer science and entrepreneurship."
                url="news.ycombinator.com"
                iconLetter="Y"
                iconColor="bg-orange-600"
                subscriberCount="120K+"
                category="General Tech"
              />
              <DiscoverFeedCard
                name="A List Apart"
                description="For people who make websites. Explores the design, development, and meaning of web content."
                url="alistapart.com"
                iconLetter="A"
                iconColor="bg-rose-600"
                subscriberCount="14K"
                category="Design"
              />
            </div>
          </div>

          {/* Add Custom Feed */}
          <div className="border border-dashed border-border rounded-lg p-6 text-center bg-bg-secondary/30">
            <p className="text-sm font-semibold text-text-secondary mb-1">
              Can&apos;t find what you&apos;re looking for?
            </p>
            <p className="text-xs text-text-tertiary mb-3">
              Add any RSS or Atom feed URL directly from the + button in the top navigation.
            </p>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-md text-xs font-bold hover:bg-accent-hover transition-colors shadow-sm">
              Add custom feed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
