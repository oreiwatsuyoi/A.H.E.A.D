'use client';

import React, { useState } from 'react';
import '../src/index.css';
import Header from '../src/components/Layout/Header';
import { useNotification } from '../src/hooks/useNotification';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { notification, hideNotification } = useNotification();

  return (
    <html lang="en">
      <head>
        <title>MediCore - Intelligent Healthcare Management</title>
        <meta name="description" content="Revolutionizing patient care through AI-powered diagnostics and comprehensive health monitoring." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        
        <main className="flex-1">
          {children}
        </main>

        {/* Error Overlay for Development */}
        {process.env.NODE_ENV === 'development' && (
          <div id="__next-error-overlay" />
        )}

        {/* Notification Toast */}
        {notification.isVisible && (
          <div className="fixed top-20 right-4 z-50 animate-slide-up">
            <div className={`p-4 rounded-xl shadow-lg max-w-sm ${
              notification.type === 'success' ? 'bg-health-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              notification.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-primary-500 text-white'
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
      </body>
    </html>
  );
}