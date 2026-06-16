import Link from "next/link";
import { Compass } from "lucide-react";
import { GuestSignInButton } from "@/components/features/auth/GuestSignInButton";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-text-primary rounded flex items-center justify-center">
            <Compass className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[15px] font-extrabold text-text-primary tracking-tight">Curio</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm font-semibold text-text-secondary hover:text-text-hover transition-colors px-3 py-1.5"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-semibold bg-accent text-white px-4 py-1.5 rounded-md hover:bg-accent-hover transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text-primary tracking-tight max-w-2xl leading-[1.1] mb-4">
            Read what matters to you with <span className="text-accent">Curio</span>.
          </h1>
          <p className="text-lg text-text-secondary mb-8 max-w-lg mx-auto">
            Pull RSS and Atom feeds from dev blogs, newsletters, and publications into one clean, calm reading dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/sign-up"
              className="bg-accent text-white px-6 py-2.5 rounded-md font-semibold hover:bg-accent-hover transition-colors text-sm cursor-pointer"
            >
              Create Account
            </Link>
            <GuestSignInButton />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl">
          <div className="text-center">
            <div className="w-10 h-10 bg-accent-subtle rounded-lg flex items-center justify-center mx-auto mb-3">
              <div className="w-5 h-5 text-accent font-bold text-sm">+</div>
            </div>
            <h3 className="font-semibold text-sm text-text-primary mb-1">Add Any Feed</h3>
            <p className="text-xs text-text-tertiary">RSS, Atom — add blogs, newsletters, changelogs from any source</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-accent-subtle rounded-lg flex items-center justify-center mx-auto mb-3">
              <div className="w-5 h-5 text-accent font-bold text-sm">B</div>
            </div>
            <h3 className="font-semibold text-sm text-text-primary mb-1">Organize by Category</h3>
            <p className="text-xs text-text-tertiary">Group feeds into custom categories. See unread counts at a glance</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-accent-subtle rounded-lg flex items-center justify-center mx-auto mb-3">
              <div className="w-5 h-5 text-accent font-bold text-sm">R</div>
            </div>
            <h3 className="font-semibold text-sm text-text-primary mb-1">Bookmark & Search</h3>
            <p className="text-xs text-text-tertiary">Save articles for later. Full-text search across all your feeds</p>
          </div>
        </div>
      </main>
    </div>
  );
}
