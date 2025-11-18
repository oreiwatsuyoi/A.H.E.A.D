export interface Patient {
  id: number;
  unique_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  phone_number: string;
  email: string;
  allergies: string[] | null;
  created_at: string;
  updated_at: string;
  team: number;
}

export interface Appointment {
  id: number;
  date: string;
  reason: string;
  summary: string;
  status: 'active' | 'completed';
  created_at: string;
  updated_at: string;
  patient: number;
}

export interface Encounter {
  id: number;
  weight: number;
  height: number;
  bmi: number;
  temperature: number;
  symptoms: string[] | null;
  diagnosis: string;
  note: string;
  summary: string;
  created_at: string;
  patient: number;
}

export interface CreatePatientRequest {
  allergies: string[];
  first_name: string;
  last_name?: string;
  date_of_birth?: string;
  gender: 'Male' | 'Female' | 'Other';
  address?: string;
  phone_number?: string;
  email?: string;
}

export interface ApiResponse<T = any> {
  status: boolean;
  status_code: number;
  message: string;
  id?: number;
  resource?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'appointment' | 'patient' | 'general';
}