import React from 'react';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../../store/useAppStore';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { simpleMode } = useAppStore();

  return (
    <div
      className="flex min-h-screen bg-bg font-sans"
      dir="rtl"
      style={simpleMode ? { fontSize: '1.15rem' } : undefined}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 max-w-full">
        {children}
      </main>
    </div>
  );
}
