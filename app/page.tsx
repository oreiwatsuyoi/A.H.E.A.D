'use client';

import Link from 'next/link';
import { Heart, UserPlus, Calendar, Bot, Stethoscope, ArrowRight, Shield, Activity, Users, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-24">
        
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-32 h-32 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl">
              <div className="absolute inset-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Heart className="h-16 w-16 text-white animate-pulse" />
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-emerald-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                MediCore
              </span>
            </h1>
            
            <div className="h-1 w-40 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto mb-8 rounded-full"></div>
            
            <p className="text-3xl md:text-4xl font-light text-blue-100 mb-6">Intelligent Healthcare Excellence</p>
            <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              Where artificial intelligence meets compassionate care. Transforming healthcare delivery through sophisticated technology and human-centered design.
            </p>
          </div>

          {/* Perfect Premium Buttons */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-32">
            
            {/* Register Patient Button */}
            <Link href="/register-patient" className="group relative block">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-emerald-400 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl leading-none flex items-center divide-x divide-emerald-400">
                <div className="flex items-center space-x-4 pr-6">
                  <UserPlus className="h-6 w-6 text-white" />
                  <span className="text-white font-semibold text-lg">Register Patient</span>
                </div>
                <div className="pl-6">
                  <ArrowRight className="h-5 w-5 text-emerald-200 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
            
            {/* Schedule Appointment Button */}
            <Link href="/appointments" className="group relative block">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative px-10 py-5 bg-slate-900/90 backdrop-blur-sm border border-white/20 rounded-2xl leading-none flex items-center divide-x divide-blue-400">
                <div className="flex items-center space-x-4 pr-6">
                  <Calendar className="h-6 w-6 text-white" />
                  <span className="text-white font-semibold text-lg">Schedule Appointment</span>
                </div>
                <div className="pl-6">
                  <ArrowRight className="h-5 w-5 text-blue-200 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
            
          </div>
        </div>

        {/* Sophisticated Features Grid */}
        <section className="mb-40">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Revolutionary Healthcare Solutions</h2>
            <div className="h-1 w-32 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto">Experience the pinnacle of medical technology with our comprehensive suite of intelligent healthcare tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-3xl p-8 hover:bg-slate-800/50 transition-all duration-500 group-hover:scale-105 h-[320px] flex flex-col justify-between">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Stethoscope className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Precision Diagnostics</h3>
                  <p className="text-blue-100 leading-relaxed">AI-enhanced clinical decision support with predictive analytics</p>
                </div>
                <div className="text-center mt-6">
                  <div className="inline-flex items-center text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Explore Feature</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-3xl p-8 hover:bg-slate-800/50 transition-all duration-500 group-hover:scale-105 h-[320px] flex flex-col justify-between">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Intelligent Orchestration</h3>
                  <p className="text-blue-100 leading-relaxed">Seamless appointment management with predictive scheduling</p>
                </div>
                <div className="text-center mt-6">
                  <div className="inline-flex items-center text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Explore Feature</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-3xl p-8 hover:bg-slate-800/50 transition-all duration-500 group-hover:scale-105 h-[320px] flex flex-col justify-between">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Clinical Intelligence</h3>
                  <p className="text-blue-100 leading-relaxed">Advanced NLP for documentation and diagnostic assistance</p>
                </div>
                <div className="text-center mt-6">
                  <div className="inline-flex items-center text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Explore Feature</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 rounded-3xl p-8 hover:bg-slate-800/50 transition-all duration-500 group-hover:scale-105 h-[320px] flex flex-col justify-between">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Safety Protocols</h3>
                  <p className="text-blue-100 leading-relaxed">Real-time monitoring and pharmaceutical safety systems</p>
                </div>
                <div className="text-center mt-6">
                  <div className="inline-flex items-center text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Explore Feature</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Platform Access */}
        <section className="mt-48 mb-32">
          <div className="max-w-6xl mx-auto px-4">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-white mb-6">
                <span className="bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">
                  Platform Access
                </span>
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Enter your personalized healthcare ecosystem with enterprise-grade security and intelligence
              </p>
            </div>

            {/* Premium Access Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
              {[
                { 
                  href: '/dashboard', 
                  icon: Activity, 
                  title: 'Executive Dashboard', 
                  desc: 'Real-time analytics, predictive insights, and comprehensive healthcare metrics',
                  gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
                  accent: 'emerald'
                },
                { 
                  href: '/patients', 
                  icon: Users, 
                  title: 'Patient Universe', 
                  desc: 'Secure patient records, medical history, and personalized health journeys',
                  gradient: 'from-blue-500 via-indigo-500 to-purple-500',
                  accent: 'blue'
                },
                { 
                  href: '/ai-chat', 
                  icon: Bot, 
                  title: 'AI Companion', 
                  desc: 'Intelligent healthcare assistant with natural language processing capabilities',
                  gradient: 'from-purple-500 via-pink-500 to-rose-500',
                  accent: 'purple'
                }
              ].map((item, index) => (
                <Link key={index} href={item.href} className="group relative block">
                  <div className="absolute -inset-1 bg-gradient-to-r opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 rounded-3xl blur-sm animate-pulse" 
                       style={{background: `linear-gradient(135deg, var(--tw-gradient-stops))`}}></div>
                  
                  <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 h-full">
                    <div className="flex flex-col items-center text-center space-y-6">
                      
                      {/* Icon */}
                      <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                        <item.icon className="h-8 w-8 text-white" />
                        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-white group-hover:text-emerald-100 transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-blue-200 leading-relaxed group-hover:text-white transition-colors duration-300">
                          {item.desc}
                        </p>
                      </div>
                      
                      {/* Access Button */}
                      <div className="pt-4">
                        <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${item.gradient} rounded-xl text-white font-semibold text-sm group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                          <span>Access Platform</span>
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </Link>
              ))}
            </div>


            
          </div>
        </section>

      </div>
      
      {/* Comprehensive Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 border-t border-emerald-400/30 mt-24">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">MediCore</h3>
                  <p className="text-blue-200 text-sm">Healthcare Intelligence</p>
                </div>
              </div>
              <p className="text-blue-100 leading-relaxed mb-6 max-w-md">
                Revolutionizing healthcare delivery through sophisticated AI technology and human-centered design. Empowering medical professionals with intelligent tools for superior patient outcomes.
              </p>
              <div className="flex space-x-4">
                {['LinkedIn', 'Twitter', 'GitHub'].map((social, index) => (
                  <div key={index} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                    <span className="text-white text-xs font-medium">{social[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6">Platform</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Dashboard', href: '/dashboard' },
                  { name: 'Patient Portal', href: '/patients' },
                  { name: 'AI Assistant', href: '/ai-chat' },
                  { name: 'Appointments', href: '/appointments' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-blue-200 hover:text-emerald-300 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-3">
                {[
                  'Documentation',
                  'API Reference', 
                  'Help Center',
                  'Contact Support'
                ].map((item, index) => (
                  <li key={index}>
                    <span className="text-blue-200 hover:text-emerald-300 transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-blue-200 text-sm mb-4 md:mb-0">
                © 2024 MediCore Healthcare Intelligence. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                {['Privacy Policy', 'Terms of Service', 'Security'].map((item, index) => (
                  <span key={index} className="text-blue-200 hover:text-emerald-300 transition-colors cursor-pointer">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 text-blue-200 text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>System Status: All services operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}