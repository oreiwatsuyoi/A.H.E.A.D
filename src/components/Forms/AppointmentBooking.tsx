import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, User, FileText, Search } from 'lucide-react';
import { Patient } from '../../types';
import { patientService } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';
import { smsService } from '../../utils/smsService';

interface AppointmentForm {
  patient_id: number;
  date: string;
  time: string;
  reason: string;
  notes?: string;
}

const AppointmentBooking: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { showNotification } = useNotification();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AppointmentForm>();

  const loadPatientsCallback = useCallback(async () => {
    try {
      const response = await patientService.getPatients();
      setPatients(response.results);
    } catch (error) {
      showNotification('Failed to load patients', 'error');
    }
  }, [showNotification]);

  useEffect(() => {
    loadPatientsCallback();
  }, [loadPatientsCallback]);



  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone_number.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setValue('patient_id', patient.id);
    setSearchTerm('');
  };

  const onSubmit = async (data: AppointmentForm) => {
    setIsLoading(true);
    try {
      // Combine date and time
      const appointmentDateTime = new Date(`${data.date}T${data.time}`);
      
      // Mock appointment creation (replace with actual API call)
      console.log('Creating appointment:', {
        ...data,
        datetime: appointmentDateTime.toISOString(),
      });

      // Send reminder
      if (selectedPatient) {
        await smsService.sendSMSReminder({
          patientName: selectedPatient.full_name,
          appointmentDate: data.date,
          appointmentTime: data.time,
          doctorName: 'Dr. Smith',
          phoneNumber: selectedPatient.phone_number,
          email: selectedPatient.email,
        });
      }

      showNotification('Appointment booked successfully!', 'success');
      reset();
      setSelectedPatient(null);
    } catch (error) {
      showNotification('Failed to book appointment', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };



  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-health-600 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Appointment</h2>
          <p className="text-gray-600">Schedule a new appointment for a patient</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Select Patient *
            </label>
            
            {selectedPatient ? (
              <div className="flex items-center justify-between p-4 bg-health-50 border border-health-200 rounded-xl">
                <div>
                  <p className="font-medium text-health-800">{selectedPatient.full_name}</p>
                  <p className="text-sm text-health-600">{selectedPatient.phone_number} • {selectedPatient.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="text-health-600 hover:text-health-800"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Search patients by name, phone, or email..."
                  />
                </div>
                
                {searchTerm && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => selectPatient(patient)}
                          className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <p className="font-medium text-gray-900">{patient.full_name}</p>
                          <p className="text-sm text-gray-600">{patient.phone_number} • {patient.email}</p>
                        </button>
                      ))
                    ) : (
                      <p className="p-4 text-gray-500 text-center">No patients found</p>
                    )}
                  </div>
                )}
              </div>
            )}
            {errors.patient_id && (
              <p className="text-red-500 text-sm mt-1">Please select a patient</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Appointment Date *
              </label>
              <input
                type="date"
                {...register('date', { required: 'Date is required' })}
                min={getMinDate()}
                className="input-field"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Appointment Time *
              </label>
              <input
                type="time"
                {...register('time', { required: 'Time is required' })}
                className="input-field"
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Reason for Visit *
            </label>
            <select
              {...register('reason', { required: 'Reason is required' })}
              className="input-field"
            >
              <option value="">Select reason</option>
              <option value="General Checkup">General Checkup</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Consultation">Consultation</option>
              <option value="Emergency">Emergency</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Lab Results">Lab Results</option>
              <option value="Other">Other</option>
            </select>
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              {...register('notes')}
              className="input-field"
              rows={3}
              placeholder="Any additional information or special requirements..."
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading || !selectedPatient}
              className="btn-primary flex-1"
            >
              {isLoading ? 'Booking...' : 'Book Appointment'}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setSelectedPatient(null);
              }}
              className="btn-secondary"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBooking;