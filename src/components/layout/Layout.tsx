import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useAppStore } from '../../store/useAppStore';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { simpleMode } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="flex min-h-screen bg-bg font-sans overflow-x-hidden"
      dir="rtl"
      style={simpleMode ? { fontSize: '1.2rem' } : undefined}
    >
      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* ── Mobile drawer overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div className="absolute top-0 right-0 bottom-0 w-[280px] z-50 overflow-y-auto shadow-strong">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-primary shadow-strong flex items-center justify-between px-4 py-3">
          <div className="text-white text-xl font-black">🧠 משחק זיכרון</div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white text-3xl min-h-[56px] min-w-[56px] bg-transparent border-none cursor-pointer"
            aria-label="פתח תפריט"
          >
            ☰
          </button>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 sm:p-6 pb-28 lg:pb-6">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom nav (hidden on desktop) ── */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
