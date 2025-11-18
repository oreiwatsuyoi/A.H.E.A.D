'use client';

import AIChat from '../../src/components/UI/AIChat';

export default function AIChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Healthcare Assistant</h1>
          <p className="text-gray-600">Register patients and book appointments using natural language</p>
        </div>
        <AIChat />
      </div>
    </div>
  );
}