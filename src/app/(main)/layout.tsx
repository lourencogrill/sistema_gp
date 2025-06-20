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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onMenuClose={() => setMobileMenuOpen(false)}
        onMenuExpandChange={setSidebarExpanded}
      />
      
      {/* Main content */}
      <div
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${isSidebarExpanded ? 'lg:ml-64' : 'lg:ml-16'}
        `}
      >
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-4 lg:px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            {/* Title - visible on desktop */}
            <div className="hidden lg:block ml-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Lume People
              </h1>
            </div>
          </div>
          
          {/* User info */}
          {session?.user && (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col items-end">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {session.user.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {session.user.email}
                </div>
              </div>
              
              {/* Avatar */}
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {session.user.name?.charAt(0).toUpperCase() || <User size={16} />}
              </div>
            </div>
          )}
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 xl:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        <Toaster />
      </div>
    </div>
  );
} 