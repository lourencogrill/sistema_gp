'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { Menu, Settings, User } from 'lucide-react';
import Link from 'next/link';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onMenuClose={() => setMobileMenuOpen(false)}
        onMenuExpandChange={setSidebarExpanded}
      />
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out md:ml-20 ${
          isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        <header className="bg-background shadow-sm h-16 flex items-center justify-between px-4 md:px-6 border-b">
          <div className="flex items-center">
            <button
              className="text-foreground hover:text-foreground/80 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:block ml-4 font-semibold text-lg">
              Lume People
            </div>
          </div>
          
          {session?.user && (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col items-end">
                <div className="font-medium text-sm text-foreground">{session.user.name}</div>
                <div className="text-xs text-muted-foreground">{session.user.email}</div>
              </div>
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
          <Toaster />
        </main>
      </div>
    </div>
  );
} 