'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { Menu, User, Loader2 } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktopSidebarExpanded, setDesktopSidebarExpanded] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const mainContentMargin = isMobile ? '' : (isDesktopSidebarExpanded ? 'md:ml-64' : 'md:ml-20');

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        isDesktopExpanded={isDesktopSidebarExpanded}
        onDesktopExpandChange={setDesktopSidebarExpanded}
      />
      
      <div className={cn("flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out", mainContentMargin)}>
        <MobileHeader onMenuClick={() => setMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
        
        <Toaster />
      </div>
    </div>
  );
}

function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="bg-background h-16 flex items-center justify-between px-4 md:hidden border-b">
      <div className="flex items-center">
        <button
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>
      </div>
      <UserInfo />
    </header>
  );
}

function UserInfo() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="flex items-center space-x-3">
      <div className="hidden sm:flex flex-col items-end">
        <div className="text-sm font-medium text-foreground">
          {session.user.name}
        </div>
        <div className="text-xs text-muted-foreground">
          {session.user.email}
        </div>
      </div>
      
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
        {session.user.name?.charAt(0).toUpperCase() || <User size={16} />}
      </div>
    </div>
  );
} 