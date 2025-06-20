'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Briefcase,
  ClipboardCheck,
  TrendingUp,
  Network,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
} from 'lucide-react';

interface SideMenuProps {
  isMobileMenuOpen: boolean;
  onMenuClose: () => void;
  onMenuExpandChange: (isExpanded: boolean) => void;
}

const menuSections = [
  {
    items: [
      { icon: Home, label: 'Dashboard', href: '/dashboard' },
      { icon: Users, label: 'Colaboradores', href: '/collaborators' },
      { icon: Briefcase, label: 'Cargos', href: '/job-positions' },
      { icon: ClipboardCheck, label: 'Avaliações', href: '/evaluations' },
      { icon: TrendingUp, label: 'Analytics', href: '/analytics' },
      { icon: Network, label: 'Organização', href: '/organization' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { icon: Settings, label: 'Configurações', href: '/settings' },
      { icon: HelpCircle, label: 'Ajuda', href: '/help' },
    ],
  },
];

export const Sidebar = ({ isMobileMenuOpen, onMenuClose, onMenuExpandChange }: SideMenuProps) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsExpanded(false);
        onMenuExpandChange(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [onMenuExpandChange]);

  const toggleExpand = () => {
    if (!isMobile) {
      const newState = !isExpanded;
      setIsExpanded(newState);
      onMenuExpandChange(newState);
    }
  };

  const handleItemClick = () => {
    if (isMobile) {
      onMenuClose();
    }
  };

  // Para mobile, usa o estado do menu mobile; para desktop, usa o estado de expansão
  const showExpanded = isMobile ? isMobileMenuOpen : isExpanded;

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileMenuOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onMenuClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-800 z-50
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full') + ' w-64'
            : (isExpanded ? 'w-64' : 'w-16') + ' translate-x-0'
          }
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          {showExpanded && (
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
              Lume People
            </h2>
          )}
          
          <div className="flex items-center">
            {isMobile && isMobileMenuOpen && (
              <button
                onClick={onMenuClose}
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            )}
            
            {!isMobile && (
              <button
                onClick={toggleExpand}
                className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                title={isExpanded ? 'Recolher menu' : 'Expandir menu'}
              >
                {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title || `section-${sectionIndex}`}>
              {/* Section title */}
              {section.title && showExpanded && (
                <div className="px-3 py-2">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
              )}
              
              {/* Section divider for collapsed state */}
              {section.title && !showExpanded && (
                <div className="px-3 py-2">
                  <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
                </div>
              )}

              {/* Menu items */}
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleItemClick}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                      }
                    `}
                    title={!showExpanded ? item.label : undefined}
                  >
                    <IconComponent 
                      size={20} 
                      className={`flex-shrink-0 ${!showExpanded ? 'mx-auto' : ''}`} 
                    />
                    {showExpanded && (
                      <span className="ml-3 truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}; 