'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Stethoscope,

} from 'lucide-react';
import { Patient, Appointment, Encounter } from '../../src/types';
import { patientService, appointmentService, encounterService } from '../../src/services/api';
import PharmacyWidget from '../../src/components/UI/PharmacyWidget';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    totalEncounters: 0,
    pendingAppointments: 0
  });
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [recentEncounters, setRecentEncounters] = useState<Encounter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load patients
      const patientsResponse = await patientService.getPatients({ ordering: '-created_at' });
      setRecentPatients(patientsResponse.results.slice(0, 5));
      
      // Load appointments
      const appointmentsResponse = await appointmentService.getAppointments({ ordering: '-date' });
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointmentsResponse.results.filter(apt => 
        apt.date.startsWith(today)
      );
      setTodayAppointments(todayAppts);
      
      // Load encounters
      const encountersResponse = await encounterService.getEncounters({ ordering: '-created_at' });
      setRecentEncounters(encountersResponse.results.slice(0, 5));
      
      // Calculate stats
      setStats({
        totalPatients: patientsResponse.count,
        todayAppointments: todayAppts.length,
        totalEncounters: encountersResponse.count,
        pendingAppointments: appointmentsResponse.results.filter(apt => apt.status === 'active').length
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="h-4 w-4 inline mr-1" />
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your patients today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Patients"
            value={stats.totalPatients}
            change={12}
            color="bg-gradient-to-r from-emerald-500 to-emerald-600"
          />
          <StatCard
            icon={Calendar}
            title="Today's Appointments"
            value={stats.todayAppointments}
            change={8}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            icon={Activity}
            title="Total Encounters"
            value={stats.totalEncounters}
            change={15}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatCard
            icon={Clock}
            title="Pending Appointments"
            value={stats.pendingAppointments}
            change={-5}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Appointments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Today's Appointments</h2>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              
              {todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Patient ID: {appointment.patient}</p>
                          <p className="text-sm text-gray-600">{appointment.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(appointment.date).toLocaleTimeString()}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status === 'active' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No appointments scheduled for today</p>
                </div>
              )}
            </div>

            {/* Recent Encounters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Encounters</h2>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              
              {recentEncounters.length > 0 ? (
                <div className="space-y-4">
                  {recentEncounters.map((encounter) => (
                    <div key={encounter.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="bg-emerald-100 p-2 rounded-lg mr-4">
                          <Stethoscope className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Patient ID: {encounter.patient}</p>
                          <p className="text-sm text-gray-600">{encounter.diagnosis}</p>
                          <p className="text-xs text-gray-500">BMI: {encounter.bmi} • Temp: {encounter.temperature}°C</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(encounter.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent encounters</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Recent Patients */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Patients</h2>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              
              {recentPatients.length > 0 ? (
                <div className="space-y-3">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{patient.full_name}</p>
                        <p className="text-xs text-gray-600">{patient.gender} • {patient.phone_number}</p>
                        {patient.allergies && patient.allergies.length > 0 && (
                          <div className="flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                            <span className="text-xs text-red-600">Has allergies</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No patients registered</p>
                </div>
              )}
            </div>

            {/* Pharmacy Widget */}
            <PharmacyWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;