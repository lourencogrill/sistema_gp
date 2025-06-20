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

// --- ESTRUTURA DE DADOS ---
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

// --- PROPS DO COMPONENTE ---
interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isDesktopExpanded: boolean;
  onDesktopExpandChange: (isExpanded: boolean) => void;
}

// --- COMPONENTE PRINCIPAL ---
export function Sidebar({
  isMobileOpen,
  onMobileClose,
  isDesktopExpanded,
  onDesktopExpandChange,
}: SidebarProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = useMemo(() => 
    isMobile ? true : isDesktopExpanded || isHovered,
    [isMobile, isDesktopExpanded, isHovered]
  );
  
  const handleMouseEnter = () => {
    if (!isMobile) setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) setIsHovered(false);
  };

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
          isMobile={isMobile}
          isDesktopExpanded={isDesktopExpanded}
          onDesktopExpandChange={onDesktopExpandChange}
        />
        <SidebarNav isExpanded={isExpanded} isMobile={isMobile} />
        <SidebarFooter isExpanded={isExpanded} />
      </aside>
    </>
  );
}


// --- COMPONENTES FILHOS ---

function SidebarHeader({ 
  isExpanded, 
  isMobile,
  isDesktopExpanded, 
  onDesktopExpandChange
}: { 
  isExpanded: boolean;
  isMobile: boolean;
  isDesktopExpanded: boolean,
  onDesktopExpandChange: (isExpanded: boolean) => void;
}) {
  return (
    <div className="flex h-16 items-center border-b px-4 shrink-0">
      <div className={`flex items-center transition-all duration-300 ${isExpanded ? 'w-full justify-between' : 'w-full justify-center'}`}>
        <span className={cn(
          "font-bold text-lg whitespace-nowrap transition-opacity",
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
            {isDesktopExpanded ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}

function SidebarNav({ isExpanded, isMobile }: { isExpanded: boolean, isMobile: boolean }) {
  const pathname = usePathname();
  const notifications = useNotifications();

  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
      <ul className="flex flex-col gap-1">
        {menuSections.map((section, sectionIndex) => (
          <li key={sectionIndex} className="space-y-1">
            {section.title && (
              <h3 className="relative text-xs font-semibold text-muted-foreground uppercase tracking-wider h-5 my-2 px-2">
                <span className={cn(
                  "absolute inset-0 flex items-center transition-opacity duration-300",
                  isExpanded ? "justify-start opacity-100" : "justify-center opacity-0"
                )}>
                  <span className="truncate max-w-full">{section.title}</span>
                </span>
                {!isMobile && (
                  <span className={cn(
                    "absolute inset-0 flex items-center justify-center text-[10px] transition-opacity duration-300",
                    !isExpanded ? 'opacity-100' : 'opacity-0'
                  )}>
                    {section.title.substring(0, 3)}
                  </span>
                )}
              </h3>
            )}
            
            <ul className="flex flex-col gap-1">
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === item.href)}
                  isExpanded={isExpanded}
                  notificationCount={item.notificationKey ? notifications[item.notificationKey] : 0}
                />
              ))}
            </ul>

            {sectionIndex < menuSections.length - 1 && <div className="pt-2" />}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SidebarNavItem({
  item,
  isActive,
  isExpanded,
  notificationCount = 0,
}: {
  item: MenuItem;
  isActive: boolean;
  isExpanded: boolean;
  notificationCount?: number;
}) {
  const showNotification = notificationCount > 0;
  
  return (
    <li>
      <Link href={item.href} className={cn(
        "group flex items-center rounded-md p-2 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isActive 
          ? "bg-primary/10 text-primary"
          : "text-foreground/70 hover:bg-muted hover:text-foreground",
        isExpanded ? "justify-start" : "justify-center"
      )}>
        <item.icon className="h-[18px] w-[18px] shrink-0" />
        <span className={cn(
          "ml-3 whitespace-nowrap transition-all duration-300 transform",
          isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
        )}>
          {item.label}
        </span>
        {showNotification && (
           <span className={cn(
            "flex items-center justify-center text-xs rounded-full h-5 min-w-[20px] px-1",
            "bg-destructive text-destructive-foreground",
            isExpanded ? 'ml-auto' : 'absolute -top-1 -right-1'
          )}>
            {notificationCount}
          </span>
        )}
      </Link>
    </li>
  );
}

function SidebarFooter({ isExpanded }: { isExpanded: boolean }) {
    return (
        <div className="mt-auto border-t p-4">
             <div className={cn(
                "flex items-center",
                isExpanded ? "justify-start" : "justify-center"
             )}>
                <ChevronLeft size={18} className={cn(
                    "text-muted-foreground transition-transform duration-500 ease-in-out",
                    isExpanded ? "rotate-0" : "rotate-180"
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