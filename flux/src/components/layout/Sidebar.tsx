"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Bookmark, CheckCircle2, Circle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddCategoryDialog } from "@/components/features/categories/AddCategoryDialog";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  count?: number;
  isActive?: boolean;
  dotColor?: string;
  href?: string;
}

function NavItem({
  icon: Icon,
  label,
  count,
  isActive,
  dotColor,
  href,
}: NavItemProps) {
  const content = (
    <>
      <div className="flex items-center gap-1.5">
        {dotColor ? (
          <div className={cn("w-1 h-1 rounded-full shrink-0", dotColor)} />
        ) : (
          <Icon
            className={cn(
              "w-4 h-4 shrink-0",
              isActive ? "text-accent" : "text-text-tertiary"
            )}
          />
        )}
        <span className={isActive ? "font-bold" : "font-medium"}>{label}</span>
      </div>
      {count !== undefined && (
        <span
          className={cn(
            "text-[10px] font-bold",
            isActive ? "text-accent" : "text-text-tertiary"
          )}
        >
          {count}
        </span>
      )}
    </>
  );

  const classes = cn(
    "flex items-center justify-between w-full px-2 py-1 rounded-md transition-all text-xs font-medium group",
    isActive
      ? "bg-accent-subtle text-accent"
      : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes}>
      {content}
    </button>
  );
}

interface SubNavItemProps {
  label: string;
  count: number;
  letter: string;
  color: string;
}

function SubNavItem({ label, count, letter, color }: SubNavItemProps) {
  return (
    <button className="flex items-center text-xs justify-between w-full py-1 pl-3 pr-2 rounded-md transition-all  group hover:bg-bg-tertiary">
      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            "size-3.5 rounded-sm flex items-center justify-center text-[8px] text-white shrink-0",
            color
          )}
        >
          {letter}
        </div>
        <span className="text-text-secondary group-hover:text-text-primary font-medium">
          {label}
        </span>
      </div>
      <span className="text-text-tertiary">{count}</span>
    </button>
  );
}

/**
 * Sidebar for Flux — Precisely matches preview.jpg
 * - Uses light gray background (bg-bg-secondary)
 * - Tighter padding
 * - Detailed category list with specific dot colors
 * - Active route highlighting via `usePathname()`
 */
export function Sidebar() {
  const pathname = usePathname();
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  return (
    <>
      <aside className="w-48 min-w-48 border-r border-border bg-bg-secondary h-[calc(100vh-4rem)] flex flex-col sticky top-16 overflow-y-auto">
        <div className="p-2 flex flex-col gap-6">
          {/* Main Feed Sections */}
          <nav className="flex flex-col gap-1">
            <NavItem
              icon={FileText}
              label="All Items"
              count={47}
              isActive={pathname === "/feed"}
              href="/feed"
            />
            <NavItem
              icon={Bookmark}
              label="Saved"
              count={12}
              isActive={pathname === "/saved"}
              href="/saved"
            />
          </nav>

          {/* Categories Section */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-2 py-2">
              <span className="text-[10px] font-bold text-text-tertiary uppercase">Categories</span>
              <button 
                onClick={() => setIsAddCategoryOpen(true)}
                className="text-text-tertiary hover:text-accent transition-colors"
                aria-label="Add category"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-col gap-0.5">
              <NavItem
                icon={Circle}
                label="Frontend"
                count={14}
                dotColor="bg-blue-500"
              />
              {/* Frontend Sub-items */}
              <div className="flex flex-col gap-0.5 mb-2">
                <SubNavItem
                  label="CSS-Tricks"
                  count={3}
                  letter="C"
                  color="bg-[#ff7a2d]"
                />
                <SubNavItem
                  label="Smashing Mag"
                  count={4}
                  letter="S"
                  color="bg-[#e93d2b]"
                />
                <SubNavItem
                  label="Josh Comeau"
                  count={2}
                  letter="J"
                  color="bg-[#6b46c1]"
                />
                <SubNavItem
                  label="Kent C. Dodds"
                  count={2}
                  letter="K"
                  color="bg-[#3182ce]"
                />
                <SubNavItem
                  label="web.dev"
                  count={3}
                  letter="w"
                  color="bg-[#00a3af]"
                />
              </div>

              <NavItem
                icon={Circle}
                label="Design"
                count={11}
                dotColor="bg-pink-500"
              />
              {/* Design Sub-items */}
              <div className="flex flex-col gap-0.5 mb-2">
                <SubNavItem
                  label="Sidebar.io"
                  count={5}
                  letter="S"
                  color="bg-[#7048e8]"
                />
                <SubNavItem
                  label="NN Group"
                  count={2}
                  letter="N"
                  color="bg-[#2f855a]"
                />
                <SubNavItem
                  label="Figma Blog"
                  count={2}
                  letter="F"
                  color="bg-[#1a202c]"
                />
                <SubNavItem
                  label="UX Collective"
                  count={2}
                  letter="U"
                  color="bg-[#2c5282]"
                />
              </div>

              <NavItem
                icon={Circle}
                label="Backend & DevOps"
                count={8}
                dotColor="bg-orange-500"
              />
              <NavItem
                icon={Circle}
                label="General Tech"
                count={6}
                dotColor="bg-indigo-500"
              />
              <NavItem
                icon={Circle}
                label="AI & ML"
                count={8}
                dotColor="bg-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <div className="mt-auto p-4 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-xs text-text-tertiary font-semibold">
            <div className="w-4 h-4 rounded-full border border-success flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-success" />
            </div>
            <span>All feeds healthy</span>
          </div>
        </div>
      </aside>

      <AddCategoryDialog 
        isOpen={isAddCategoryOpen} 
        onClose={() => setIsAddCategoryOpen(false)} 
      />
    </>
  );
}
