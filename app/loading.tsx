import { Heart } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-health-400 to-primary-500 rounded-full blur opacity-75 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-health-500 to-primary-600 p-6 rounded-full animate-bounce">
            <Heart className="h-12 w-12 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Loading A.H.E.A.D Healthcare
        </h2>
        
        <p className="text-gray-600 mb-8">
          Preparing your healthcare platform...
        </p>
        
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-health-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-medical-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}