'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { Menu, User } from 'lucide-react';

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
      
      {/* Main content */}
      <div
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}
        `}
      >
        {/* Header */}
        <header className="bg-background shadow-sm h-16 flex items-center justify-between px-4 md:px-6 border-b border-border">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            {/* Title - visible on desktop */}
            <div className="hidden md:block ml-4">
              <h1 className="text-xl font-semibold text-foreground">
                Lume People
              </h1>
            </div>
          </div>
          
          {/* User info */}
          {session?.user && (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col items-end">
                <div className="text-sm font-medium text-foreground">
                  {session.user.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {session.user.email}
                </div>
              </div>
              
              {/* Avatar */}
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                {session.user.name?.charAt(0).toUpperCase() || <User size={16} />}
              </div>
            </div>
          )}
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        <Toaster />
      </div>
    </div>
  );
} 