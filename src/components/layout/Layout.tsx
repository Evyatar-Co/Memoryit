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
      {/* ── Desktop sidebar — only on screens ≥ 900px ── */}
      <div className="hidden" style={{ display: undefined }} id="desktop-sidebar">
        <style>{`@media (min-width: 900px) { #desktop-sidebar { display: block !important; } }`}</style>
        <Sidebar />
      </div>

      {/* ── Mobile drawer ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute top-0 right-0 bottom-0 z-50 overflow-y-auto shadow-strong"
            style={{ width: 'min(280px, 85vw)' }}
          >
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top bar — always visible on mobile, hidden on desktop */}
        <header
          className="sticky top-0 z-30 shadow-strong flex items-center justify-between px-4"
          style={{
            background: '#1A237E',
            minHeight: 64,
            display: 'flex',
          }}
          id="mobile-topbar"
        >
          <style>{`@media (min-width: 900px) { #mobile-topbar { display: none !important; } }`}</style>
          <div className="text-white text-xl font-black">🧠 משחק זיכרון</div>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: 32,
              cursor: 'pointer',
              minWidth: 56,
              minHeight: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}
            aria-label="פתח תפריט"
          >
            ☰
          </button>
        </header>

        {/* Page content — extra bottom padding so BottomNav doesn't cover content */}
        <div
          className="flex-1 p-4"
          style={{ paddingBottom: 96 }}
          id="main-content"
        >
          <style>{`@media (min-width: 900px) { #main-content { padding-bottom: 24px !important; } }`}</style>
          {children}
        </div>
      </main>

      {/* ── Bottom nav — mobile only ── */}
      <div id="bottom-nav-wrapper">
        <style>{`@media (min-width: 900px) { #bottom-nav-wrapper { display: none !important; } }`}</style>
        <BottomNav />
      </div>
    </div>
  );
}
