import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PatientPortal from './pages/PatientPortal';
import PatientRegistrationForm from './components/Forms/PatientRegistrationForm';
import AppointmentBooking from './components/Forms/AppointmentBooking';
import AIChat from './components/UI/AIChat';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<PatientPortal />} />
          <Route path="/register-patient" element={<PatientRegistrationForm />} />
          <Route path="/appointments" element={<AppointmentBooking />} />
          <Route path="/ai-chat" element={
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Healthcare Assistant</h1>
                  <p className="text-gray-600">Register patients and book appointments using natural language</p>
                </div>
                <AIChat />
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;