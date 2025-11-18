import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Pill, Search } from 'lucide-react';
import { Patient } from '../../types';
import { patientService, pharmacyService } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';

const PharmacyWidget: React.FC = () => {
  const [patientId, setPatientId] = useState<string>('');
  const [medications, setMedications] = useState<string[]>([]);
  const [medicationInput, setMedicationInput] = useState('');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [checkResult, setCheckResult] = useState<{ safe: boolean; warnings: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const loadPatient = async () => {
    if (!patientId) return;
    
    setIsLoading(true);
    try {
      const patientData = await patientService.getPatient(parseInt(patientId));
      setPatient(patientData);
    } catch (error) {
      showNotification('Patient not found', 'error');
      setPatient(null);
    } finally {
      setIsLoading(false);
    }
  };

  const addMedication = () => {
    if (medicationInput.trim() && !medications.includes(medicationInput.trim())) {
      setMedications([...medications, medicationInput.trim()]);
      setMedicationInput('');
    }
  };

  const removeMedication = (medication: string) => {
    setMedications(medications.filter(m => m !== medication));
    setCheckResult(null);
  };

  const checkAllergies = async () => {
    if (!patient || medications.length === 0) return;

    setIsLoading(true);
    try {
      const result = await pharmacyService.checkAllergies(patient.id, medications);
      setCheckResult(result);
      
      if (result.safe) {
        showNotification('All medications are safe for this patient', 'success');
      } else {
        showNotification(`${result.warnings.length} potential allergy warning(s) found`, 'warning');
      }
    } catch (error) {
      showNotification('Failed to check allergies', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-medical-500 to-primary-600 p-3 rounded-xl mr-4">
          <Pill className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Pharmacy Safety Check</h3>
          <p className="text-gray-600">Check patient allergies before prescribing</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Patient Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient ID
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="input-field flex-1"
              placeholder="Enter patient ID"
            />
            <button
              onClick={loadPatient}
              disabled={!patientId || isLoading}
              className="btn-secondary px-4"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Patient Info */}
        {patient && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">{patient.full_name}</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>DOB: {patient.date_of_birth}</p>
              <p>Gender: {patient.gender}</p>
              {patient.allergies && patient.allergies.length > 0 ? (
                <div>
                  <p className="font-medium">Known Allergies:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-green-700">No known allergies</p>
              )}
            </div>
          </div>
        )}

        {/* Medication Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medications to Prescribe
          </label>
          <div className="flex gap-2 mb-3">
            <input
              value={medicationInput}
              onChange={(e) => setMedicationInput(e.target.value)}
              className="input-field flex-1"
              placeholder="Enter medication name"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
            />
            <button
              type="button"
              onClick={addMedication}
              className="btn-secondary px-4"
            >
              Add
            </button>
          </div>

          {medications.length > 0 && (
            <div className="space-y-2">
              {medications.map((medication, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{medication}</span>
                  <button
                    onClick={() => removeMedication(medication)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Check Button */}
        {patient && medications.length > 0 && (
          <button
            onClick={checkAllergies}
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? 'Checking...' : 'Check for Allergies'}
          </button>
        )}

        {/* Results */}
        {checkResult && (
          <div className={`p-4 rounded-xl border ${
            checkResult.safe 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center mb-3">
              {checkResult.safe ? (
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              )}
              <h4 className={`font-semibold ${
                checkResult.safe ? 'text-green-900' : 'text-red-900'
              }`}>
                {checkResult.safe ? 'Safe to Prescribe' : 'Allergy Warning'}
              </h4>
            </div>

            {checkResult.warnings.length > 0 && (
              <div className="space-y-2">
                {checkResult.warnings.map((warning, index) => (
                  <div key={index} className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-red-800 text-sm">{warning}</p>
                  </div>
                ))}
              </div>
            )}

            {checkResult.safe && (
              <p className="text-green-800 text-sm">
                All medications are safe for this patient based on known allergies.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyWidget;