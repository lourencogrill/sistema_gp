'use client';

import React, { useState, useMemo } from 'react';
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
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useNotifications } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';

// --- DATA STRUCTURE ---
interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  notificationKey?: keyof ReturnType<typeof useNotifications>;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    items: [
      { icon: Home, label: 'Dashboard', href: '/dashboard' },
      { icon: Users, label: 'Colaboradores', href: '/collaborators', notificationKey: 'rhPendingCount' },
    ],
  },
  {
    title: 'Gestão',
    items: [
      { icon: Briefcase, label: 'Cargos', href: '/job-positions' },
      { icon: ClipboardCheck, label: 'Avaliações', href: '/evaluations' },
      { icon: TrendingUp, label: 'Analytics', href: '/analytics' },
    ],
  },
  {
    title: 'Empresa',
    items: [
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

// --- COMPONENT PROPS ---
interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isDesktopExpanded: boolean;
  onDesktopExpandChange: (isExpanded: boolean) => void;
}

// --- MAIN COMPONENT ---
export function Sidebar({
  isMobileOpen,
  onMobileClose,
  isDesktopExpanded,
  onDesktopExpandChange,
}: SidebarProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isHovered, setIsHovered] = useState(false);

  // This is the single source of truth for the expanded state.
  const isExpanded = useMemo(() => 
    isMobile ? true : isDesktopExpanded || isHovered,
    [isMobile, isDesktopExpanded, isHovered]
  );
  
  const handleMouseEnter = () => !isMobile && setIsHovered(true);
  const handleMouseLeave = () => !isMobile && setIsHovered(false);

  const containerClasses = cn(
    "fixed top-0 left-0 h-full bg-background border-r flex flex-col z-40 transition-all duration-300 ease-in-out",
    isMobile 
      ? isMobileOpen ? "translate-x-0 w-64 shadow-lg" : "-translate-x-full w-64"
      : isExpanded ? "w-64" : "w-20"
  );
  
  return (
    <>
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30" 
          onClick={onMobileClose} 
        />
      )}
      
      <aside 
        className={containerClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarHeader 
          isExpanded={isExpanded}
          isDesktopExpanded={isDesktopExpanded}
          onDesktopExpandChange={onDesktopExpandChange}
        />
        <SidebarNav isExpanded={isExpanded} />
        <SidebarFooter isExpanded={isExpanded} isDesktopExpanded={isDesktopExpanded} />
      </aside>
    </>
  );
}

// --- CHILD COMPONENTS ---

function SidebarHeader({ 
  isExpanded, 
  isDesktopExpanded, 
  onDesktopExpandChange
}: { 
  isExpanded: boolean;
  isDesktopExpanded: boolean;
  onDesktopExpandChange: (isExpanded: boolean) => void;
}) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <div className={cn(
      "flex h-16 items-center border-b shrink-0",
      isExpanded ? "justify-between px-4" : "justify-center"
    )}>
      <span className={cn(
        "font-bold text-lg whitespace-nowrap transition-opacity duration-300",
        isExpanded ? "opacity-100" : "opacity-0"
      )}>
        Lume GP
      </span>
      {!isMobile && (
        <button 
          onClick={() => onDesktopExpandChange(!isDesktopExpanded)}
          className="p-2 rounded-md hover:bg-muted text-muted-foreground"
          title={isDesktopExpanded ? "Recolher" : "Expandir"}
        >
          {isDesktopExpanded ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />}
        </button>
      )}
    </div>
  );
}

function SidebarNav({ isExpanded }: { isExpanded: boolean }) {
  const pathname = usePathname();
  const notifications = useNotifications();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
      <div className="flex flex-col gap-1">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <div className="px-2 my-2 h-5 flex items-center justify-center">
                 <h3 className={cn(
                  "text-xs font-semibold text-muted-foreground uppercase tracking-wider transition-opacity duration-300",
                  !isExpanded && !isMobile ? "opacity-100" : "opacity-0 w-0"
                 )}>
                   {section.title.substring(0, 3)}
                 </h3>
                 <h3 className={cn(
                  "text-xs font-semibold text-muted-foreground uppercase tracking-wider transition-opacity duration-300",
                  isExpanded ? "opacity-100" : "opacity-0 w-0"
                 )}>
                   {section.title}
                 </h3>
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  isActive={pathname.startsWith(item.href)}
                  isExpanded={isExpanded}
                  notificationCount={item.notificationKey ? notifications[item.notificationKey] : 0}
                />
              ))}
            </div>

            {sectionIndex < menuSections.length - 1 && <div className="h-4" />}
          </div>
        ))}
      </div>
    </nav>
  );
}

function SidebarNavItem({ item, isActive, isExpanded, notificationCount = 0 }: {
  item: MenuItem;
  isActive: boolean;
  isExpanded: boolean;
  notificationCount?: number;
}) {
  return (
    <Link href={item.href} className={cn(
      "group relative flex items-center rounded-md p-2 text-sm font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      isActive 
        ? "bg-primary/10 text-primary"
        : "text-foreground/70 hover:bg-muted hover:text-foreground",
      isExpanded ? "justify-start" : "justify-center"
    )}>
      <item.icon className="h-[18px] w-[18px] shrink-0" />
      <span className={cn(
        "ml-3 whitespace-nowrap transition-opacity duration-200",
        isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        {item.label}
      </span>
      {notificationCount > 0 && (
         <span className={cn(
          "flex items-center justify-center text-xs rounded-full h-5 min-w-[20px] px-1 font-bold",
          "bg-destructive text-destructive-foreground",
          isExpanded ? 'ml-auto' : 'absolute top-0 right-0'
        )}>
          {notificationCount}
        </span>
      )}
    </Link>
  );
}

function SidebarFooter({ isExpanded, isDesktopExpanded }: { isExpanded: boolean, isDesktopExpanded: boolean }) {
  return (
    <div className="mt-auto border-t">
      <div className={cn(
        "flex items-center p-4",
        isExpanded ? "justify-start" : "justify-center"
      )}>
        <ChevronLeft size={18} className={cn(
          "text-muted-foreground transition-transform duration-500 ease-in-out",
          isDesktopExpanded ? "rotate-0" : "rotate-180"
        )} />
        <span className={cn(
          "ml-3 text-sm text-muted-foreground whitespace-nowrap transition-opacity",
          isExpanded ? "opacity-100" : "opacity-0"
        )}>
          Recolher
        </span>
      </div>
    </div>
  );
}