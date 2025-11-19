import React, { useState } from 'react';
import { Pill, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { pharmacyService } from '../../services/api';

const PharmacyWidget: React.FC = () => {
  const [patientId, setPatientId] = useState('');
  const [medications, setMedications] = useState<string[]>([]);
  const [currentMed, setCurrentMed] = useState('');
  const [result, setResult] = useState<{ safe: boolean; warnings: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addMedication = () => {
    if (currentMed.trim()) {
      setMedications([...medications, currentMed.trim()]);
      setCurrentMed('');
    }
  };

  const checkAllergies = async () => {
    if (!patientId || medications.length === 0) return;
    
    setIsLoading(true);
    try {
      const result = await pharmacyService.checkAllergies(parseInt(patientId), medications);
      setResult(result);
    } catch (error) {
      console.error('Failed to check allergies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-3 rounded-xl mr-4">
          <Pill className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Pharmacy Safety Check</h3>
          <p className="text-gray-600">Check patient allergies before prescribing</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter patient ID"
            />
            <button
              onClick={checkAllergies}
              disabled={!patientId || medications.length === 0 || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Medications to Prescribe</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={currentMed}
              onChange={(e) => setCurrentMed(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMedication()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter medication name"
            />
            <button
              type="button"
              onClick={addMedication}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Add
            </button>
          </div>
          
          {medications.length > 0 && (
            <div className="space-y-2">
              {medications.map((med, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{med}</span>
                  <button
                    onClick={() => setMedications(medications.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {result && (
          <div className={`p-4 rounded-lg ${result.safe ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center mb-2">
              {result.safe ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span className={`font-medium ${result.safe ? 'text-green-800' : 'text-red-800'}`}>
                {result.safe ? 'Safe to Prescribe' : 'Allergy Warning'}
              </span>
            </div>
            {result.warnings.length > 0 && (
              <div className="space-y-1">
                {result.warnings.map((warning, index) => (
                  <p key={index} className="text-sm text-red-700">{warning}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyWidget;