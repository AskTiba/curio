'use client';

import { Suspense } from 'react';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared application layout for all authenticated/dashboard routes.
 * Coordinates the TopNav, Sidebar, and the flexible Main content area.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Suspense fallback={null}>
        <TopNav />
      </Suspense>
      
      <div className="flex flex-1">
        {/* Sidebar remains sticky/fixed-height via its internal implementation */}
        <Sidebar />
        
        {/* Flexible Main content area */}
        <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
