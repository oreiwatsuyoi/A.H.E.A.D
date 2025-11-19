import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Users, 
  Calendar, 
  Bot, 
  Shield, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Stethoscope,
  Activity,
  UserPlus
} from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: UserPlus,
      title: 'Intelligent Patient Onboarding',
      description: 'AI-driven patient registration with advanced biometric integration and comprehensive health profiling',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Calendar,
      title: 'Predictive Scheduling',
      description: 'Machine learning-powered appointment optimization with automated conflict resolution and smart reminders',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Bot,
      title: 'Clinical AI Assistant',
      description: 'Advanced natural language processing for clinical documentation and diagnostic support',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Shield,
      title: 'Pharmaceutical Intelligence',
      description: 'Real-time drug interaction analysis with personalized allergy monitoring and safety protocols',
      color: 'from-red-500 to-orange-600'
    },
    {
      icon: Activity,
      title: 'Clinical Command Center',
      description: 'Comprehensive analytics dashboard with predictive insights and population health management',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Patient Engagement Hub',
      description: 'Personalized health portal with telemedicine integration and wellness tracking',
      color: 'from-violet-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-30"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-white via-blue-50 to-emerald-50 p-8 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl blur opacity-75 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-emerald-500 to-blue-600 p-4 rounded-2xl">
                      <Heart className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black mb-6">
                  <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    MediCore
                  </span>
                </h1>
                
                <div className="h-1 w-32 bg-gradient-to-r from-emerald-500 to-blue-600 mx-auto mb-6 rounded-full"></div>
                
                <p className="text-2xl md:text-3xl font-light text-gray-700 mb-4">
                  Intelligent Healthcare Management
                </p>
                
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Revolutionizing patient care through AI-powered diagnostics, seamless appointment management, and comprehensive health monitoring.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link href="/register-patient" className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  <UserPlus className="h-5 w-5 mr-3" />
                  <span className="text-lg">Register Patient</span>
                </div>
              </Link>
              
              <Link href="/appointments" className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/30 text-gray-700 font-bold py-4 px-8 rounded-2xl shadow-xl hover:bg-white/20 hover:border-emerald-300 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span className="text-lg">Schedule Appointment</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transforming Healthcare Delivery
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-blue-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering healthcare providers with cutting-edge technology for superior patient outcomes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Stethoscope, title: 'Smart Diagnostics', desc: 'AI-powered health analysis' },
              { icon: Users, title: 'Patient Management', desc: 'Comprehensive care tracking' },
              { icon: Calendar, title: 'Intelligent Scheduling', desc: 'Optimized appointment flow' },
              { icon: Bot, title: 'AI Assistant', desc: 'Natural language processing' }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200 transform hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    
                    <div className="mt-6 h-1 w-0 bg-gradient-to-r from-emerald-500 to-blue-600 group-hover:w-full transition-all duration-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Advanced Healthcare Solutions
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Experience the future of healthcare with our comprehensive suite of intelligent tools designed for modern medical practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                
                <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-100 transition-colors duration-300">{feature.title}</h3>
                    <p className="text-blue-100 leading-relaxed group-hover:text-white transition-colors duration-300">{feature.description}</p>
                    
                    <div className="mt-6 flex items-center text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-sm font-medium">Learn More</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Integration
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-blue-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600">
              Seamlessly integrated with leading healthcare APIs for comprehensive medical data management
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-3 rounded-xl mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Dorra EMR API</h3>
                  <p className="text-gray-600">Foundational, interoperable platform</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  'Patient record management',
                  'Appointment scheduling',
                  'Medical history tracking',
                  'Provider workflow optimization'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl mr-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">PharmaVigilance API</h3>
                  <p className="text-gray-600">Advanced medication safety</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  'Drug interaction detection',
                  'Allergy checking',
                  'Adverse reaction monitoring',
                  'Medication safety alerts'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0"></div>
        
        <div className="relative max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Transform Healthcare
              <span className="block bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">
                Today
              </span>
            </h2>
            
            <div className="h-1 w-32 bg-gradient-to-r from-emerald-300 to-blue-300 mx-auto mb-8 rounded-full"></div>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join thousands of healthcare professionals revolutionizing patient care with MediCore's intelligent platform.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/dashboard" className="group relative overflow-hidden bg-white text-emerald-600 hover:text-emerald-700 font-bold py-5 px-10 rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 inline-flex items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <span className="text-xl mr-3">Get Started</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>
            
            <Link href="/ai-chat" className="group relative overflow-hidden border-2 border-white/30 text-white hover:border-emerald-300 font-bold py-5 px-10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-105 inline-flex items-center">
              <div className="flex items-center">
                <Bot className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-xl">Try AI Assistant</span>
              </div>
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: '99.9%', label: 'Uptime Guarantee' },
              { number: '< 2s', label: 'Response Time' },
              { number: '24/7', label: 'Expert Support' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-200 text-sm uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;