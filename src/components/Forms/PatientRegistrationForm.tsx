import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { CreatePatientRequest } from '../../types';
import { patientService } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';

const PatientRegistrationForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState('');
  const { showNotification } = useNotification();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreatePatientRequest>();

  const addAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter(a => a !== allergy));
  };

  const onSubmit = async (data: CreatePatientRequest) => {
    setIsLoading(true);
    try {
      const patientData = { ...data, allergies };
      const response = await patientService.createPatient(patientData);
      
      if (response.status) {
        showNotification('Patient registered successfully!', 'success');
        reset();
        setAllergies([]);
      } else {
        showNotification('Failed to register patient', 'error');
      }
    } catch (error) {
      showNotification('Error registering patient', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-health-500 to-primary-600 rounded-full mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Registration</h2>
          <p className="text-gray-600">Register a new patient in the system</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                {...register('first_name', { required: 'First name is required' })}
                className="input-field"
                placeholder="Enter first name"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                {...register('last_name')}
                className="input-field"
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date of Birth
              </label>
              <input
                type="date"
                {...register('date_of_birth')}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                {...register('gender', { required: 'Gender is required' })}
                className="input-field"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              className="input-field"
              placeholder="patient@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone Number
            </label>
            <input
              {...register('phone_number')}
              className="input-field"
              placeholder="+234 xxx xxx xxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Address
            </label>
            <textarea
              {...register('address')}
              className="input-field"
              rows={3}
              placeholder="Enter full address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              Allergies
            </label>
            <div className="flex gap-2 mb-3">
              <input
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                className="input-field flex-1"
                placeholder="Enter allergy (e.g., Penicillin)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
              />
              <button
                type="button"
                onClick={addAllergy}
                className="btn-secondary px-4"
              >
                Add
              </button>
            </div>
            {allergies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                  >
                    {allergy}
                    <button
                      type="button"
                      onClick={() => removeAllergy(allergy)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? 'Registering...' : 'Register Patient'}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setAllergies([]);
              }}
              className="btn-secondary"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistrationForm;