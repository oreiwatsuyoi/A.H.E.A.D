'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Shield, 
  Eye, 
  EyeOff, 
  UserPlus,
  AlertCircle,
  CheckCircle,
  Loader2,
  Heart,
  Sparkles,
  Lock
} from 'lucide-react';
import { signUpUser } from '../../src/lib/auth';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    address: '',
    allergies: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const patientData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        address: formData.address,
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone
      };

      const result = await signUpUser(formData.email, formData.password, patientData);
      
      if (result.success) {
        setSuccess('Account created successfully!');
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl">
          {/* Epic Header */}
          <div className="text-center mb-12">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-slate-800/50 backdrop-blur-xl border border-emerald-400/30 rounded-3xl">
                <div className="absolute inset-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Heart className="h-10 w-10 text-white animate-pulse" />
                </div>
              </div>
            </div>
            <h1 className="text-6xl font-black mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-emerald-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Join MediCore
              </span>
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
              <p className="text-xl text-blue-100">Your Healthcare Journey Begins Here</p>
              <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
            </div>
            <p className="text-slate-300 max-w-2xl mx-auto">Experience the future of healthcare with AI-powered diagnostics and personalized care management</p>
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

              {success && (
                <div className="mb-6 p-4 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-emerald-300">{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Info Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Personal Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-emerald-300">First Name *</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-6 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-gray-100 placeholder-slate-400 focus:border-emerald-400/70 focus:bg-slate-700/80 focus:outline-none transition-all duration-300"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-emerald-300">Last Name *</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-6 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-gray-100 placeholder-slate-400 focus:border-emerald-400/70 focus:bg-slate-700/80 focus:outline-none transition-all duration-300"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-emerald-300">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-14 pr-6 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-gray-100 placeholder-slate-400 focus:border-emerald-400/70 focus:bg-slate-700/80 focus:outline-none transition-all duration-300"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-emerald-300">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          className="w-full pl-16 pr-6 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-gray-100 placeholder-slate-400 focus:border-emerald-400/70 focus:bg-slate-700/80 focus:outline-none transition-all duration-300"
                          placeholder="+234 801 234 5678"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-emerald-300">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                          className="w-full pl-16 pr-6 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-gray-100 focus:border-emerald-400/70 focus:bg-slate-700/80 focus:outline-none transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-emerald-300">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-6 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-gray-100 focus:border-emerald-400/70 focus:bg-slate-700/80 focus:outline-none transition-all duration-300"
                      >
                        <option value="" className="bg-slate-800 text-white">Select gender</option>
                        <option value="male" className="bg-slate-800 text-white">Male</option>
                        <option value="female" className="bg-slate-800 text-white">Female</option>
                        <option value="other" className="bg-slate-800 text-white">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Medical Info Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Medical Information</h3>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-300">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full pl-16 pr-6 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-gray-100 placeholder-slate-400 focus:border-emerald-400/70 focus:bg-slate-700/80 focus:outline-none transition-all duration-300 resize-none"
                        placeholder="Enter your full address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-300">Known Allergies</label>
                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-6 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-gray-100 placeholder-slate-400 focus:border-emerald-400/70 focus:bg-slate-700/80 focus:outline-none transition-all duration-300"
                      placeholder="e.g., Penicillin, Peanuts (comma separated)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-emerald-300">Emergency Contact Name</label>
                      <input
                        type="text"
                        name="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-6 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-gray-100 placeholder-slate-400 focus:border-emerald-400/70 focus:bg-slate-700/80 focus:outline-none transition-all duration-300"
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-emerald-300">Emergency Contact Phone</label>
                      <input
                        type="tel"
                        name="emergency_contact_phone"
                        value={formData.emergency_contact_phone}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-6 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-gray-100 placeholder-slate-400 focus:border-emerald-400/70 focus:bg-slate-700/80 focus:outline-none transition-all duration-300"
                        placeholder="Emergency contact phone"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Lock className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Security</h3>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-emerald-300">Password *</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-16 pr-16 py-4 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-gray-100 placeholder-slate-400 focus:border-emerald-400/70 focus:bg-slate-700/80 focus:outline-none transition-all duration-300"
                        placeholder="Create a secure password"
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
                </div>

                {/* Epic Submit Button */}
                <div className="pt-6">
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
                          <span>Creating Your Account...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-6 w-6" />
                          <span>Create My MediCore Account</span>
                          <Sparkles className="h-5 w-5 animate-pulse" />
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {/* Login Link */}
                <div className="text-center pt-6 border-t border-slate-600/30">
                  <p className="text-slate-300">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/login')}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-300 hover:underline"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;