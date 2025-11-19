'use client';

import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Database, 
  Key, 
  Mail, 
  Phone, 
  Clock, 
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    appointments: true,
    reminders: true,
    security: true
  });
  const [profile, setProfile] = useState({
    firstName: 'Dr. John',
    lastName: 'Smith',
    email: 'john.smith@medicore.com',
    phone: '+234 801 234 5678',
    specialization: 'General Medicine',
    license: 'MD-2024-001',
    department: 'Internal Medicine'
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'language', name: 'Language', icon: Globe },
    { id: 'data', name: 'Data & Privacy', icon: Database },
    { id: 'api', name: 'API Settings', icon: Key }
  ];

  const handleSave = () => {
    console.log('Settings saved');
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">First Name</label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile({...profile, firstName: e.target.value})}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">Last Name</label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile({...profile, lastName: e.target.value})}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({...profile, email: e.target.value})}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">Phone</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({...profile, phone: e.target.value})}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">Specialization</label>
          <select
            value={profile.specialization}
            onChange={(e) => setProfile({...profile, specialization: e.target.value})}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-emerald-400 focus:outline-none"
          >
            <option value="General Medicine">General Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Surgery">Surgery</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">License Number</label>
          <input
            type="text"
            value={profile.license}
            onChange={(e) => setProfile({...profile, license: e.target.value})}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-4">Password & Authentication</h3>
        <div className="space-y-4">
          <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all">
            Change Password
          </button>
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-slate-400 text-sm">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Enable
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-4">Session Management</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <span className="text-white">Auto-logout after inactivity</span>
            <select className="px-3 py-1 bg-slate-600 text-white rounded border border-slate-500">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Logout All Devices
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-4">Notification Channels</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                {key === 'email' && <Mail className="h-5 w-5 text-emerald-400" />}
                {key === 'sms' && <Phone className="h-5 w-5 text-blue-400" />}
                {key === 'push' && <Bell className="h-5 w-5 text-purple-400" />}
                {key === 'appointments' && <Clock className="h-5 w-5 text-yellow-400" />}
                {key === 'reminders' && <AlertTriangle className="h-5 w-5 text-orange-400" />}
                {key === 'security' && <Shield className="h-5 w-5 text-red-400" />}
                <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              </div>
              <button
                onClick={() => setNotifications({...notifications, [key]: !value})}
                className={`w-12 h-6 rounded-full transition-colors ${
                  value ? 'bg-emerald-600' : 'bg-slate-600'
                } relative`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-4">Theme Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-slate-900 border-2 border-emerald-400 rounded-xl text-center">
            <Moon className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <span className="text-white font-medium">Dark</span>
          </button>
          <button className="p-4 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-center hover:border-slate-400">
            <Sun className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <span className="text-slate-400 font-medium">Light</span>
          </button>
          <button className="p-4 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-center hover:border-slate-400">
            <Monitor className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <span className="text-slate-400 font-medium">System</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-4">Display Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white">Font Size</span>
            <select className="px-3 py-2 bg-slate-600 text-white rounded border border-slate-500">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Sidebar Collapsed by Default</span>
            <button className="w-12 h-6 bg-slate-600 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
        <div className="space-y-4">
          <button className="flex items-center space-x-3 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
            <Download className="h-5 w-5" />
            <span>Export My Data</span>
          </button>
          <button className="flex items-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Upload className="h-5 w-5" />
            <span>Import Data</span>
          </button>
          <button className="flex items-center space-x-3 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
            <Trash2 className="h-5 w-5" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <span className="text-white">Analytics & Usage Data</span>
            <button className="w-12 h-6 bg-emerald-600 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 translate-x-6" />
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <span className="text-white">Crash Reports</span>
            <button className="w-12 h-6 bg-emerald-600 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 translate-x-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPISettings = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-emerald-300 mb-2">Dorra EMR API Endpoint</label>
            <input
              type="url"
              value="https://hackathon-api.aheadafrica.org/v1"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-emerald-400 focus:outline-none"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-emerald-300 mb-2">API Token</label>
            <div className="flex space-x-2">
              <input
                type="password"
                value="ND3T27IJ4D:whNhkiyAjxE0YQYvybTzfm_BvUXFzWK6VrE88nKgFVw"
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:border-emerald-400 focus:outline-none"
                readOnly
              />
              <button className="px-4 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors">
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Test Connection</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-4">Rate Limiting</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <span className="text-white">Requests per minute</span>
            <span className="text-emerald-400 font-mono">60</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <span className="text-white">Daily quota</span>
            <span className="text-emerald-400 font-mono">10,000</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'data': return renderDataSettings();
      case 'api': return renderAPISettings();
      default: return renderProfileSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-slate-300">Manage your MediCore platform preferences and configuration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 text-emerald-300'
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6">
              {renderTabContent()}
              
              <div className="mt-8 pt-6 border-t border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">All changes saved automatically</span>
                  </div>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl hover:from-emerald-700 hover:to-blue-700 transition-all"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;