'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Heart, 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Bot, 
  Pill, 
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut
} from 'lucide-react';

const SimpleSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { path: '/', name: 'Home', icon: Heart },
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/patients', name: 'Patients', icon: Users },
    { path: '/ai-chat', name: 'AI Assistant', icon: Bot },
    { path: '/pharmacy', name: 'Pharmacy', icon: Pill },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:block fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-blue-900 to-emerald-900 border-r border-white/10 transition-all duration-300 z-50 ${
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
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 text-emerald-300'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-400' : 'text-blue-200 group-hover:text-white'}`} />
                {!isCollapsed && (
                  <span className="font-medium text-left">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className="space-y-2">
          <button 
            onClick={() => handleNavigation('/settings')}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition-colors w-full ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="text-sm">Settings</span>}
          </button>
          <button 
            onClick={() => handleNavigation('/login')}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200 transition-colors w-full ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="text-sm">Sign In</span>}
          </button>
        </div>
      </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 border-t border-white/10 z-50">
        <div className="flex justify-around items-center py-2 px-4">
          {navigationItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-emerald-300'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-400' : 'text-blue-200'}`} />
                <span className="text-xs font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SimpleSidebar;