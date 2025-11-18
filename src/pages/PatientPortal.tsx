import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  FileText, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  AlertTriangle,
  Activity,
  Heart
} from 'lucide-react';
import { Patient, Appointment, Encounter } from '../types';
import { patientService } from '../services/api';

const PatientPortal: React.FC = () => {
  const [patientId, setPatientId] = useState<string>('');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'appointments' | 'encounters'>('profile');

  const loadPatientData = async () => {
    if (!patientId) return;
    
    setIsLoading(true);
    try {
      const patientData = await patientService.getPatient(parseInt(patientId));
      setPatient(patientData);
      
      // Load appointments
      const appointmentsData = await patientService.getPatientAppointments(parseInt(patientId));
      setAppointments(appointmentsData.results);
      
      // Load encounters
      const encountersData = await patientService.getPatientEncounters(parseInt(patientId));
      setEncounters(encountersData.results);
    } catch (error) {
      console.error('Failed to load patient data:', error);
      setPatient(null);
      setAppointments([]);
      setEncounters([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-health-500 to-primary-600 rounded-full mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Portal</h1>
          <p className="text-gray-600">Access your medical information and appointments</p>
        </div>

        {/* Patient ID Input */}
        {!patient && (
          <div className="max-w-md mx-auto mb-8">
            <div className="card p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Patient ID
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Patient ID"
                />
                <button
                  onClick={loadPatientData}
                  disabled={!patientId || isLoading}
                  className="btn-primary px-6"
                >
                  {isLoading ? 'Loading...' : 'Access Portal'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Patient Dashboard */}
        {patient && (
          <div>
            {/* Patient Header */}
            <div className="card p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-primary-500 to-health-600 p-4 rounded-full mr-6">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{patient.full_name}</h2>
                    <p className="text-gray-600">Patient ID: {patient.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPatient(null);
                    setPatientId('');
                    setAppointments([]);
                    setEncounters([]);
                  }}
                  className="btn-secondary"
                >
                  Switch Patient
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-8">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'encounters', label: 'Medical History', icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <>
                  <div className="lg:col-span-2">
                    <div className="card p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <p className="text-gray-900">{patient.full_name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          <p className="text-gray-900">{patient.date_of_birth ? formatDate(patient.date_of_birth) : 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <p className="text-gray-900">{patient.gender}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Phone className="h-4 w-4 inline mr-1" />
                            Phone Number
                          </label>
                          <p className="text-gray-900">{patient.phone_number || 'Not provided'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Mail className="h-4 w-4 inline mr-1" />
                            Email Address
                          </label>
                          <p className="text-gray-900">{patient.email || 'Not provided'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <MapPin className="h-4 w-4 inline mr-1" />
                            Address
                          </label>
                          <p className="text-gray-900">{patient.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="card p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        <AlertTriangle className="h-5 w-5 inline mr-2 text-red-500" />
                        Allergies
                      </h3>
                      {patient.allergies && patient.allergies.length > 0 ? (
                        <div className="space-y-2">
                          {patient.allergies.map((allergy, index) => (
                            <div key={index} className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                              <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                              <span className="text-red-800 font-medium">{allergy}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-green-600 bg-green-50 p-3 rounded-lg">No known allergies</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div className="lg:col-span-3">
                  <div className="card p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Your Appointments</h3>
                    {appointments.length > 0 ? (
                      <div className="space-y-4">
                        {appointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center">
                              <div className="bg-primary-100 p-3 rounded-lg mr-4">
                                <Calendar className="h-5 w-5 text-primary-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{appointment.reason}</p>
                                <p className="text-sm text-gray-600">{formatDateTime(appointment.date)}</p>
                                {appointment.summary && (
                                  <p className="text-sm text-gray-500 mt-1">{appointment.summary}</p>
                                )}
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              appointment.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <Clock className="h-3 w-3 mr-1" />
                              {appointment.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No appointments scheduled</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Encounters Tab */}
              {activeTab === 'encounters' && (
                <div className="lg:col-span-3">
                  <div className="card p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Medical History</h3>
                    {encounters.length > 0 ? (
                      <div className="space-y-6">
                        {encounters.map((encounter) => (
                          <div key={encounter.id} className="border border-gray-200 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="bg-health-100 p-3 rounded-lg mr-4">
                                  <Activity className="h-5 w-5 text-health-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{encounter.diagnosis}</h4>
                                  <p className="text-sm text-gray-600">{formatDate(encounter.created_at)}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-xs text-blue-600 font-medium">Weight</p>
                                <p className="text-lg font-bold text-blue-900">{encounter.weight} kg</p>
                              </div>
                              <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-xs text-green-600 font-medium">Height</p>
                                <p className="text-lg font-bold text-green-900">{encounter.height} cm</p>
                              </div>
                              <div className="bg-purple-50 p-3 rounded-lg">
                                <p className="text-xs text-purple-600 font-medium">BMI</p>
                                <p className="text-lg font-bold text-purple-900">{encounter.bmi}</p>
                              </div>
                              <div className="bg-red-50 p-3 rounded-lg">
                                <p className="text-xs text-red-600 font-medium">Temperature</p>
                                <p className="text-lg font-bold text-red-900">{encounter.temperature}°C</p>
                              </div>
                            </div>
                            
                            {encounter.symptoms && encounter.symptoms.length > 0 && (
                              <div className="mb-4">
                                <h5 className="font-medium text-gray-900 mb-2">Symptoms</h5>
                                <div className="flex flex-wrap gap-2">
                                  {encounter.symptoms.map((symptom, index) => (
                                    <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                                      {symptom}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {encounter.note && (
                              <div className="mb-4">
                                <h5 className="font-medium text-gray-900 mb-2">Doctor's Notes</h5>
                                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{encounter.note}</p>
                              </div>
                            )}
                            
                            {encounter.summary && (
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2">Summary</h5>
                                <p className="text-gray-700">{encounter.summary}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No medical history available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPortal;