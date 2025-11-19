'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Heart, 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Bot, 
  Pill, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut
} from 'lucide-react';

interface RecentTab {
  path: string;
  name: string;
  icon: React.ComponentType<any>;
  timestamp: number;
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [recentTabs, setRecentTabs] = useState<RecentTab[]>([]);
  const pathname = usePathname();

  const navigationItems = [
    { path: '/', name: 'Home', icon: Heart },
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/patients', name: 'Patients', icon: Users },
    { path: '/register-patient', name: 'Register Patient', icon: UserPlus },
    { path: '/ai-chat', name: 'AI Assistant', icon: Bot },
    { path: '/pharmacy', name: 'Pharmacy', icon: Pill },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('recentTabs');
    if (saved) {
      setRecentTabs(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const currentItem = navigationItems.find(item => item.path === pathname);
    if (currentItem && pathname !== '/') {
      const newTab: RecentTab = {
        path: currentItem.path,
        name: currentItem.name,
        icon: currentItem.icon,
        timestamp: Date.now()
      };

      setRecentTabs(prev => {
        const filtered = prev.filter(tab => tab.path !== pathname);
        const updated = [newTab, ...filtered].slice(0, 5);
        localStorage.setItem('recentTabs', JSON.stringify(updated));
        return updated;
      });
    }
  }, [pathname]);

  return (
    <div className={`h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-emerald-900 border-r border-white/10 transition-all duration-300 flex-shrink-0 ${
      isCollapsed ? 'w-16' : 'w-72'
    }`}>
      
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">
                  MediCore
                </h1>
                <p className="text-xs text-blue-200">Healthcare Intelligence</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-white" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-white" />
            )}
          </button>
        </div>
      </div>

      <div className="p-4">
        {!isCollapsed && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">
              Navigation
            </h3>
          </div>
        )}
        
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 text-emerald-300'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-400' : 'text-blue-200 group-hover:text-white'}`} />
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {!isCollapsed && recentTabs.length > 0 && (
        <div className="p-4 border-t border-white/10">
          <h3 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">
            Recent
          </h3>
          <div className="space-y-1">
            {recentTabs.map((tab, index) => {
              const IconComponent = tab.icon;
              return (
                <Link
                  key={`${tab.path}-${index}`}
                  href={tab.path}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-colors group"
                >
                  <IconComponent className="h-4 w-4 text-blue-300 group-hover:text-white" />
                  <span className="text-sm">{tab.name}</span>
                  <Clock className="h-3 w-3 text-blue-400 ml-auto" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className="space-y-2">
          <button className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-colors w-full ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="text-sm">Settings</span>}
          </button>
          <button className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors w-full ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;