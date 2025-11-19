'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Shield, 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  Loader2, 
  Heart, 
  Sparkles, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { signInUser } from '../../src/lib/auth';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signInUser(formData.email, formData.password);
      
      if (result.success) {
        localStorage.setItem('current_patient_id', result.patientId);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          {/* Epic Header */}
          <div className="text-center mb-12">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 backdrop-blur-xl border border-emerald-400/30 rounded-3xl">
                <div className="absolute inset-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white animate-pulse" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-black mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-emerald-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
              <p className="text-lg text-blue-100">Continue Your Healthcare Journey</p>
              <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
            </div>
            <p className="text-slate-300">Sign in to access your MediCore dashboard</p>
          </div>

          {/* Epic Form Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-800/20 backdrop-blur-2xl border border-slate-600/50 rounded-3xl p-8 shadow-2xl">
              
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <span className="text-red-300">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Login Fields */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Lock className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Account Access</h3>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-300">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-16 pr-6 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-gray-100 placeholder-slate-400 focus:border-emerald-400/70 focus:bg-slate-700/80 focus:outline-none transition-all duration-300"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-300">Password</label>
                    <div className="relative group">
                      <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-16 pr-16 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-gray-100 placeholder-slate-400 focus:border-emerald-400/70 focus:bg-slate-700/80 focus:outline-none transition-all duration-300"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>

                {/* Epic Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full py-5 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center space-x-3">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span>Signing You In...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="h-6 w-6" />
                          <span>Access MediCore Dashboard</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {/* Signup Link */}
                <div className="text-center pt-6 border-t border-slate-600/30">
                  <p className="text-slate-300">
                    New to MediCore?{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/signup')}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-300 hover:underline"
                    >
                      Create your account
                    </button>
                  </p>
                </div>

                {/* Quick Demo Access */}
                <div className="text-center pt-4">
                  <div className="mb-4">
                    <span className="text-sm text-slate-400">Quick Access</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ email: 'demo@medicore.com', password: 'demo123' });
                    }}
                    className="px-6 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-xl transition-all duration-300 text-sm"
                  >
                    Use Demo Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;