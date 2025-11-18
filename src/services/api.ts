import axios from 'axios';
import { Patient, Appointment, Encounter, CreatePatientRequest, ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = 'https://hackathon-api.aheadafrica.org/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const patientService = {
  // List all patients
  getPatients: async (params?: { ordering?: string; page?: number; search?: string }): Promise<PaginatedResponse<Patient>> => {
    const response = await api.get('/patients', { params });
    return response.data;
  },

  // Get patient by ID
  getPatient: async (id: number): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  // Create patient via standard endpoint
  createPatient: async (data: CreatePatientRequest): Promise<ApiResponse> => {
    const response = await api.post('/patients/create', data);
    return response.data;
  },

  // Create patient via AI prompt
  createPatientAI: async (prompt: string): Promise<ApiResponse> => {
    const response = await api.post('/ai/patient', { prompt });
    return response.data;
  },

  // Update patient
  updatePatient: async (id: number, data: Partial<CreatePatientRequest>): Promise<ApiResponse> => {
    const response = await api.patch(`/patients/${id}`, data);
    return response.data;
  },

  // Delete patient
  deletePatient: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },

  // Get patient appointments
  getPatientAppointments: async (id: number, params?: { ordering?: string; page?: number; search?: string }): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get(`/patients/${id}/appointments`, { params });
    return response.data;
  },

  // Get patient encounters
  getPatientEncounters: async (id: number, params?: { ordering?: string; page?: number; search?: string }): Promise<PaginatedResponse<Encounter>> => {
    const response = await api.get(`/patients/${id}/encounters`, { params });
    return response.data;
  },
};

export const appointmentService = {
  // List all appointments
  getAppointments: async (params?: { ordering?: string; page?: number; search?: string }): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  // Get appointment by ID
  getAppointment: async (id: number): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id: number, data: Partial<Appointment>): Promise<ApiResponse> => {
    const response = await api.patch(`/appointments/${id}`, data);
    return response.data;
  },

  // Delete appointment
  deleteAppointment: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};

export const encounterService = {
  // List all encounters
  getEncounters: async (params?: { ordering?: string; page?: number; search?: string }): Promise<PaginatedResponse<Encounter>> => {
    const response = await api.get('/encounters', { params });
    return response.data;
  },

  // Get encounter by ID
  getEncounter: async (id: number): Promise<Encounter> => {
    const response = await api.get(`/encounters/${id}`);
    return response.data;
  },
};

export const aiService = {
  // Create EMR entry via AI
  createEMR: async (prompt: string, patient: number): Promise<ApiResponse> => {
    const response = await api.post('/ai/emr', { prompt, patient });
    return response.data;
  },
};

// Pharmacy vigilance service (mock implementation)
export const pharmacyService = {
  checkAllergies: async (patientId: number, medications: string[]): Promise<{ safe: boolean; warnings: string[] }> => {
    // Mock implementation - in real app this would call the PharmaVigilance API
    const patient = await patientService.getPatient(patientId);
    const allergies = patient.allergies || [];
    
    const warnings: string[] = [];
    medications.forEach(med => {
      allergies.forEach(allergy => {
        if (med.toLowerCase().includes(allergy.toLowerCase())) {
          warnings.push(`Warning: Patient is allergic to ${allergy}. Medication ${med} may contain this allergen.`);
        }
      });
    });

    return {
      safe: warnings.length === 0,
      warnings
    };
  },
};

export default api;