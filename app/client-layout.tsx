'use client';

import React from 'react';
import SimpleSidebar from '../src/components/Layout/SimpleSidebar';
import { useNotification } from '../src/hooks/useNotification';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { notification, hideNotification } = useNotification();

  return (
    <div className="min-h-screen">
      <SimpleSidebar />
      
      <main className="ml-72 min-h-screen">
        {children}
      </main>

      {/* Notification Toast */}
      {notification.isVisible && (
        <div className="fixed top-4 right-4 z-50 animate-slide-up">
          <div className={`p-4 rounded-xl shadow-lg max-w-sm ${
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            notification.type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{notification.message}</p>
              <button
                onClick={hideNotification}
                className="ml-3 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}