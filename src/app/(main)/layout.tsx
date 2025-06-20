'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { Menu } from 'lucide-react';
import { AuthProvider } from '@/components/auth/AuthProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <AuthProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          onMenuClose={() => setMobileMenuOpen(false)}
          onMenuExpandChange={setSidebarExpanded}
        />
        <div
          className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
            isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'
          }`}
        >
          {/* Header simples para o botão de menu mobile */}
          <header className="md:hidden flex items-center justify-between p-4 border-b bg-background">
            <h1 className="text-xl font-bold">Lume People</h1>
            <button onClick={() => setMobileMenuOpen(true)}>
              <Menu />
            </button>
          </header>

          <main className="flex-1 p-6 overflow-y-auto md:p-8">
            {children}
            <Toaster />
          </main>
        </div>
      </div>
    </AuthProvider>
  );
} 