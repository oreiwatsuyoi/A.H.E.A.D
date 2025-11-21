// API Configuration
const API_BASE = '/api';
let currentPage = 'home';
let currentData = {};

// API Helper
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = { method };
    if (data) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Router
function navigate(page, params = {}) {
    currentPage = page;
    currentData = params;
    render();
}

// Icons (SVG)
const icons = {
    home: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>',
    dashboard: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
    patients: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>',
    appointments: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>',
    encounters: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>',
    medications: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>',
    tests: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>',
    ai: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
    plus: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>',
    search: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>',
    close: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
    arrow: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>',
    check: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
};

// Components
let recordsMenuOpen = false;

function toggleRecordsMenu() {
    recordsMenuOpen = !recordsMenuOpen;
    const menu = document.getElementById('records-submenu');
    const icon = document.getElementById('records-toggle-icon');
    if (menu) {
        menu.style.display = recordsMenuOpen ? 'block' : 'none';
        if (icon) icon.style.transform = recordsMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    }
}

function TopNav() {
    return `
        <nav class="top-nav mobile-only">
            <div class="logo">MediCore</div>
            <div id="mobile-auth-btn"></div>
        </nav>
    `;
}

function Sidebar() {
    const allItems = [
        { id: 'home', label: 'Home', icon: 'home' },
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'patients', label: 'Patients', icon: 'patients' },
        { id: 'appointments', label: 'Appointments', icon: 'appointments' },
        { id: 'encounters', label: 'Encounters', icon: 'encounters' },
        { id: 'pharma', label: 'PharmaWatch', icon: 'medications', desktopOnly: true },
        { id: 'ai', label: 'Doctor Chat', icon: 'ai' }
    ];
    
    return `
        ${TopNav()}
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="logo">MediCore</div>
                <div id="auth-btn" style="margin-top: 1rem;"></div>
            </div>
            <ul class="nav-menu">
                ${allItems.map(item => `
                    <li class="nav-item ${item.desktopOnly ? 'desktop-only' : ''}">
                        <a href="javascript:void(0)" class="nav-link ${currentPage === item.id ? 'active' : ''}" 
                           onclick="navigate('${item.id}')">
                            <span class="nav-icon">${icons[item.icon]}</span>
                            <span class="nav-text">${item.label}</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        </aside>
    `;
}

function HomePage() {
    return `
        ${Sidebar()}
        <main class="main-content">
            <div class="hero">
                <h1>Revolutionary Healthcare Platform</h1>
                <p>Empowering African healthcare with cutting-edge technology, AI-powered insights, and seamless patient management</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary" onclick="navigate('dashboard')">
                        Get Started ${icons.arrow}
                    </button>
                    <button class="btn btn-secondary" onclick="navigate('ai')">
                        Doctor Chat
                    </button>
                </div>
            </div>
            
            <div class="features-grid">
                <div class="feature-card" onclick="navigate('patients')">
                    <div class="feature-icon">${icons.patients}</div>
                    <h3>Patient Management</h3>
                    <p>Comprehensive patient records with advanced search, filtering, and real-time updates. Manage allergies, medical history, and demographics effortlessly.</p>
                </div>
                
                <div class="feature-card" onclick="navigate('appointments')">
                    <div class="feature-icon">${icons.appointments}</div>
                    <h3>Smart Appointments</h3>
                    <p>Intelligent scheduling system with automated reminders, conflict detection, and seamless calendar integration for optimal patient flow.</p>
                </div>
                
                <div class="feature-card feature-center" onclick="navigate('encounters')">
                    <div class="feature-icon">${icons.encounters}</div>
                    <h3>Medical Encounters</h3>
                    <p>Complete encounter documentation with vitals tracking, diagnosis recording, medication management, and comprehensive clinical notes.</p>
                </div>
            </div>
            
            <div class="data-section" style="max-width: 1000px; margin: 4rem auto 2rem;">
                <div class="section-header">
                    <h2>Frequently Asked Questions</h2>
                </div>
                <div style="display: grid; gap: 1rem;">
                    ${[
                        { q: 'How do I register a new patient?', a: 'Click on "Patients" in the navigation, then click "Add Patient". You can use the AI assistant for natural language input or fill the form manually.' },
                        { q: 'Can I schedule appointments with AI?', a: 'Yes! Go to Appointments and click "Schedule Appointment". Use natural language like "Book appointment for John tomorrow at 3 PM for checkup".' },
                        { q: 'How does the wellness tracker work?', a: 'Click the + button at the bottom-left to log symptoms, meals, moods, or workouts. Access guided meditation, breathing exercises, and stretches. View your history with AI-powered health insights.' },
                        { q: 'What is PharmaVigilance monitoring?', a: 'PharmaVigilance monitors drug interactions and alerts you to potential safety issues. It provides real-time alerts for Major, Moderate, Minor, and Unknown severity interactions.' },
                        { q: 'How do I connect with a doctor via video?', a: 'Navigate to the "Doctor" tab, enter your 6-digit access code, check your camera and microphone, then join the session for secure video consultation.' },
                        { q: 'Can I integrate Google Fit data?', a: 'Yes! In the patient detail page, click "Connect Google Fit" to sync steps, heart rate, calories, and sleep data automatically.' },
                        { q: 'How do I view patient medical history?', a: 'Click on any patient name to view their complete profile including appointments, encounters, medications, lab tests, and fitness data.' },
                        { q: 'What AI features are available?', a: 'AI-powered patient registration, appointment booking, encounter creation, prompt improvement, voice input, and wellness log analysis with personalized health recommendations.' }
                    ].map(faq => `
                        <div style="background: rgba(30, 41, 59, 0.4); border-radius: 12px; padding: 1.5rem; border-left: 3px solid #10b981; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(16, 185, 129, 0.1)'" onmouseout="this.style.background='rgba(30, 41, 59, 0.4)'">
                            <div style="font-weight: 600; color: #10b981; margin-bottom: 0.5rem; font-size: 1.05rem;">${faq.q}</div>
                            <div style="color: #94a3b8; line-height: 1.6;">${faq.a}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </main>
    `;
}

function DashboardPage() {
    return `
        ${Sidebar()}
        <main class="main-content">
            <div class="section-header">
                <h2>Healthcare Dashboard</h2>
            </div>
            
            <div class="stats-grid" id="stats-container">
                <div class="loading"><div class="spinner"></div><p>Loading statistics...</p></div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div class="data-section" id="recent-medications">
                    <div class="section-header"><h3>Recent Medications</h3></div>
                    <div class="loading"><div class="spinner"></div></div>
                </div>
                <div class="data-section" id="recent-tests">
                    <div class="section-header"><h3>Recent Lab Tests</h3></div>
                    <div class="loading"><div class="spinner"></div></div>
                </div>
            </div>
            
            <div class="data-section" id="recent-patients">
                <div class="section-header">
                    <h2>Recent Patients</h2>
                    <button class="btn btn-primary" onclick="showModal('createPatient')">
                        ${icons.plus} Add Patient
                    </button>
                </div>
                <div class="loading"><div class="spinner"></div></div>
            </div>
            
            <div class="data-section">
                <div class="section-header">
                    <h2>Wellness Tracking</h2>
                    <button class="btn btn-secondary" onclick="viewWellnessLogs()">
                        ${icons.search} View All Logs
                    </button>
                </div>
                <div id="wellness-summary" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
                    <div style="padding: 1rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2)); border-radius: 12px; text-align: center; border-left: 3px solid #ef4444;">
                        <div style="font-size: 2rem;">🩺</div>
                        <div style="font-size: 1.5rem; font-weight: 600; color: #ef4444;" id="symptom-count">0</div>
                        <div style="font-size: 0.75rem; color: #94a3b8;">Symptoms</div>
                    </div>
                    <div style="padding: 1rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2)); border-radius: 12px; text-align: center; border-left: 3px solid #f59e0b;">
                        <div style="font-size: 2rem;">🍽️</div>
                        <div style="font-size: 1.5rem; font-weight: 600; color: #f59e0b;" id="meal-count">0</div>
                        <div style="font-size: 0.75rem; color: #94a3b8;">Meals</div>
                    </div>
                    <div style="padding: 1rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2)); border-radius: 12px; text-align: center; border-left: 3px solid #8b5cf6;">
                        <div style="font-size: 2rem;">😊</div>
                        <div style="font-size: 1.5rem; font-weight: 600; color: #8b5cf6;" id="mood-count">0</div>
                        <div style="font-size: 0.75rem; color: #94a3b8;">Moods</div>
                    </div>
                    <div style="padding: 1rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2)); border-radius: 12px; text-align: center; border-left: 3px solid #10b981;">
                        <div style="font-size: 2rem;">💪</div>
                        <div style="font-size: 1.5rem; font-weight: 600; color: #10b981;" id="workout-count">0</div>
                        <div style="font-size: 0.75rem; color: #94a3b8;">Workouts</div>
                    </div>
                </div>
            </div>
        </main>
    `;
}

// Load Dashboard Data
async function loadDashboard() {
    try {
        const [patients, appointments, encounters] = await Promise.all([
            apiCall('/patients'),
            apiCall('/appointments'),
            apiCall('/encounters')
        ]);
        
        document.getElementById('stats-container').innerHTML = `
            <div class="stat-card">
                <div class="stat-header">
                    <h4>Total Patients</h4>
                    <div class="stat-icon">${icons.patients}</div>
                </div>
                <div class="stat-value">${patients.count || 0}</div>
                <div class="stat-change positive">
                    ${icons.arrow} +12% from last month
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <h4>Appointments</h4>
                    <div class="stat-icon">${icons.appointments}</div>
                </div>
                <div class="stat-value">${appointments.count || 0}</div>
                <div class="stat-change positive">
                    ${icons.arrow} +8% from last month
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <h4>Encounters</h4>
                    <div class="stat-icon">${icons.encounters}</div>
                </div>
                <div class="stat-value">${encounters.count || 0}</div>
                <div class="stat-change positive">
                    ${icons.arrow} +15% from last month
                </div>
            </div>
        `;
        
        const allMeds = [], allTests = [];
        for (const patient of patients.results?.slice(0, 20) || []) {
            try {
                const [meds, tests] = await Promise.all([
                    apiCall(`/patients/${patient.id}/medications`),
                    apiCall(`/patients/${patient.id}/tests`)
                ]);
                if (meds.results) allMeds.push(...meds.results.map(m => ({...m, patient_name: `${patient.first_name} ${patient.last_name}`})));
                if (tests.results) allTests.push(...tests.results.map(t => ({...t, patient_name: `${patient.first_name} ${patient.last_name}`})));
            } catch (e) {}
        }
        
        document.getElementById('recent-medications').innerHTML = `
            <div class="section-header"><h3>Recent Medications</h3></div>
            ${allMeds.length > 0 ? `<table class="data-table"><thead><tr><th>Patient</th><th>Name</th><th>Dosage</th><th>Frequency</th></tr></thead><tbody>${allMeds.slice(0, 5).map(m => `<tr><td>${m.patient_name}</td><td><strong>${m.name}</strong></td><td>${m.dosage || 'N/A'}</td><td>${m.frequency || 'N/A'}</td></tr>`).join('')}</tbody></table>` : '<p style="padding: 1rem; color: #6b7280;">No medications</p>'}
        `;
        
        document.getElementById('recent-tests').innerHTML = `
            <div class="section-header"><h3>Recent Lab Tests</h3></div>
            ${allTests.length > 0 ? `<table class="data-table"><thead><tr><th>Patient</th><th>Test</th><th>Result</th><th>Date</th></tr></thead><tbody>${allTests.slice(0, 5).map(t => `<tr><td>${t.patient_name}</td><td><strong>${t.name}</strong></td><td>${t.result || 'Pending'}</td><td>${new Date(t.created_at).toLocaleDateString()}</td></tr>`).join('')}</tbody></table>` : '<p style="padding: 1rem; color: #6b7280;">No tests</p>'}
        `;
        
        const recentPatients = patients.results?.slice(0, 5) || [];
        document.getElementById('recent-patients').innerHTML = `
            <div class="section-header">
                <h2>Recent Patients</h2>
                <button class="btn btn-primary" onclick="showModal('createPatient')">
                    ${icons.plus} Add Patient
                </button>
            </div>
            ${recentPatients.length > 0 ? `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Gender</th>
                            <th>Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recentPatients.map(p => `
                            <tr onclick="navigate('patients', {id: ${p.id}})">
                                <td>#${p.id}</td>
                                <td>${p.first_name} ${p.last_name}</td>
                                <td>${p.email || 'N/A'}</td>
                                <td>${p.phone_number || 'N/A'}</td>
                                <td><span class="badge badge-info">${p.gender}</span></td>
                                <td>${p.age || 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : '<div class="empty-state"><div class="empty-icon">${icons.patients}</div><h3>No patients yet</h3><p>Start by adding your first patient</p></div>'}
        `;
        
        const logs = JSON.parse(localStorage.getItem('wellness_logs') || '[]');
        const today = new Date().toDateString();
        const todayLogs = logs.filter(l => new Date(l.timestamp).toDateString() === today);
        document.getElementById('symptom-count').textContent = todayLogs.filter(l => l.type === 'symptom').length;
        document.getElementById('meal-count').textContent = todayLogs.filter(l => l.type === 'meal').length;
        document.getElementById('mood-count').textContent = todayLogs.filter(l => l.type === 'mood').length;
        document.getElementById('workout-count').textContent = todayLogs.filter(l => l.type === 'workout').length;
    } catch (error) {
        document.getElementById('stats-container').innerHTML = '<p style="color: #ef4444;">Error loading dashboard data</p>';
    }
}

// Render
function render() {
    let content = '';
    
    switch(currentPage) {
        case 'home':
            content = HomePage();
            break;
        case 'dashboard':
            content = DashboardPage();
            setTimeout(loadDashboard, 100);
            break;
        case 'patients':
            content = PatientsPage();
            setTimeout(loadPatients, 100);
            break;
        case 'appointments':
            content = AppointmentsPage();
            setTimeout(loadAppointments, 100);
            break;
        case 'encounters':
            content = EncountersPage();
            setTimeout(loadEncounters, 100);
            break;

        case 'ai':
            content = AIPage();
            break;
        case 'pharma':
            content = PharmaVigilancePage();
            setTimeout(loadPharmaAlerts, 100);
            break;
        case 'patient-detail':
            content = PatientDetailPage();
            setTimeout(() => { loadPatientDetail(); initGoogleFit(); }, 100);
            break;
        default:
            content = HomePage();
    }
    
    document.getElementById('app').innerHTML = content;
    setTimeout(updateAuthUI, 100);
}

// Modal System
function showModal(type) {
    const modalRoot = document.getElementById('modal-root');
    let modalContent = '';
    
    if (type === 'createPatient') {
        modalContent = `
            <div class="modal-overlay" onclick="closeModal(event)">
                <div class="modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>Add New Patient</h2>
                        <button class="close-btn" onclick="closeModal()">${icons.close}</button>
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <button class="btn btn-secondary" onclick="showModal('aiPatient')" style="width: 100%;">
                            ${icons.ai} Use AI to Create Patient
                        </button>
                    </div>
                    <form onsubmit="createPatient(event)">
                        <div class="form-group">
                            <label class="form-label">First Name *</label>
                            <input type="text" class="form-input" name="first_name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Last Name</label>
                            <input type="text" class="form-input" name="last_name">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" name="email">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Phone</label>
                            <input type="tel" class="form-input" name="phone_number">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Date of Birth</label>
                            <input type="date" class="form-input" name="date_of_birth">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Gender *</label>
                            <select class="form-select" name="gender" required>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Address</label>
                            <textarea class="form-textarea" name="address"></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Allergies (comma separated)</label>
                            <input type="text" class="form-input" name="allergies" placeholder="e.g., Penicillin, Peanuts">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            ${icons.check} Create Patient
                        </button>
                    </form>
                </div>
            </div>
        `;
    } else if (type === 'createAppointment') {
        modalContent = `
            <div class="modal-overlay" onclick="closeModal(event)">
                <div class="modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>Schedule Appointment (AI)</h2>
                        <button class="close-btn" onclick="closeModal()">${icons.close}</button>
                    </div>
                    <form onsubmit="createAIAppointment(event)">
                        <div class="form-group" style="position: relative;">
                            <label class="form-label">Search Patient *</label>
                            <input type="text" class="form-input" id="patient-search-appt" oninput="searchPatientForAI(this.value, 'appt')" placeholder="Search by name or ID" autocomplete="off">
                            <div id="patient-results-appt" style="display: none; position: absolute; z-index: 1000; background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; width: 100%; max-height: 200px; overflow-y: auto; margin-top: 0.25rem;"></div>
                            <input type="hidden" name="patient" id="selected-patient-appt" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Describe the appointment</label>
                            <div style="position: relative;">
                                <textarea class="form-textarea" id="ai-appt-prompt" name="prompt" required 
                                          placeholder="Example: Schedule appointment tomorrow at 3 PM for dental checkup"
                                          style="min-height: 150px; padding-right: 50px;"></textarea>
                                <button type="button" onclick="startVoiceInput('ai-appt-prompt')" style="position: absolute; right: 10px; top: 10px; background: #0ea5e9; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;">🎤</button>
                            </div>
                        </div>
                        <button type="button" onclick="improvePrompt('ai-appt-prompt')" class="btn btn-secondary" style="width: 100%; margin-bottom: 1rem;">✨ Improve with AI</button>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            ${icons.ai} Schedule Appointment
                        </button>
                    </form>
                </div>
            </div>
        `;
    } else if (type === 'createEncounter') {
        modalContent = `
            <div class="modal-overlay" onclick="closeModal(event)">
                <div class="modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>New Medical Encounter (AI)</h2>
                        <button class="close-btn" onclick="closeModal()">${icons.close}</button>
                    </div>
                    <form onsubmit="createAIEncounter(event)">
                        <div class="form-group" style="position: relative;">
                            <label class="form-label">Search Patient *</label>
                            <input type="text" class="form-input" id="patient-search-enc" oninput="searchPatientForAI(this.value, 'enc')" placeholder="Search by name or ID" autocomplete="off">
                            <div id="patient-results-enc" style="display: none; position: absolute; z-index: 1000; background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; width: 100%; max-height: 200px; overflow-y: auto; margin-top: 0.25rem;"></div>
                            <input type="hidden" name="patient" id="selected-patient-enc" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Describe the encounter</label>
                            <div style="position: relative;">
                                <textarea class="form-textarea" id="ai-enc-prompt" name="prompt" required 
                                          placeholder="Example: Patient came with chest pain, BP 140/90, prescribed medication"
                                          style="min-height: 150px; padding-right: 50px;"></textarea>
                                <button type="button" onclick="startVoiceInput('ai-enc-prompt')" style="position: absolute; right: 10px; top: 10px; background: #0ea5e9; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;">🎤</button>
                            </div>
                        </div>
                        <button type="button" onclick="improvePrompt('ai-enc-prompt')" class="btn btn-secondary" style="width: 100%; margin-bottom: 1rem;">✨ Improve with AI</button>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            ${icons.ai} Create Encounter
                        </button>
                    </form>
                </div>
            </div>
        `;
    } else if (type === 'aiPatient') {
        modalContent = `
            <div class="modal-overlay" onclick="closeModal(event)">
                <div class="modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>AI Patient Creation</h2>
                        <button class="close-btn" onclick="closeModal()">${icons.close}</button>
                    </div>
                    <form onsubmit="createAIPatient(event)">
                        <div class="form-group">
                            <label class="form-label">Describe the patient in natural language</label>
                            <div style="position: relative;">
                                <textarea class="form-textarea" id="ai-patient-prompt" name="prompt" required 
                                          placeholder="Example: Create a patient named Sarah Johnson, female, 28 years old, allergic to shellfish, email: sarah@email.com, phone: +234-802-345-6789"
                                          style="min-height: 150px; padding-right: 50px;"></textarea>
                                <button type="button" onclick="startVoiceInput('ai-patient-prompt')" style="position: absolute; right: 10px; top: 10px; background: #0ea5e9; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;">🎤</button>
                            </div>
                        </div>
                        <button type="button" onclick="improvePrompt('ai-patient-prompt')" class="btn btn-secondary" style="width: 100%; margin-bottom: 1rem;">✨ Improve with AI</button>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            ${icons.ai} Create with AI
                        </button>
                    </form>
                </div>
            </div>
        `;

    }
    
    modalRoot.innerHTML = modalContent;
}

function closeModal(event) {
    if (!event || event.target.classList.contains('modal-overlay')) {
        document.getElementById('modal-root').innerHTML = '';
    }
}

// Make closeModal globally accessible
window.closeModal = closeModal;

async function createPatient(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        phone_number: formData.get('phone_number'),
        date_of_birth: formData.get('date_of_birth'),
        gender: formData.get('gender'),
        address: formData.get('address'),
        allergies: formData.get('allergies') ? formData.get('allergies').split(',').map(a => a.trim()) : []
    };
    
    try {
        await apiCall('/patients/create', 'POST', data);
        closeModal();
        Swal.fire('Success!', 'Patient created successfully', 'success');
        navigate('patients');
    } catch (error) {
        Swal.fire('Error', 'Failed to create patient', 'error');
    }
}

async function createAIPatient(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
        const result = await apiCall('/ai/patient', 'POST', {
            prompt: formData.get('prompt')
        });
        closeModal();
        Swal.fire('Success!', `Patient created successfully! ID: ${result.id}`, 'success');
        navigate('patients');
    } catch (error) {
        Swal.fire('Error', 'Failed to create patient with AI', 'error');
    }
}

window.createAIAppointment = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
        const result = await apiCall('/ai/emr', 'POST', {
            prompt: formData.get('prompt'),
            patient: parseInt(formData.get('patient'))
        });
        closeModal();
        Swal.fire('Success!', 'Appointment created successfully!', 'success');
        navigate('appointments');
    } catch (error) {
        Swal.fire('Error', 'Failed to create appointment with AI', 'error');
    }
}

window.createAIEncounter = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
        const result = await apiCall('/ai/emr', 'POST', {
            prompt: formData.get('prompt'),
            patient: parseInt(formData.get('patient'))
        });
        closeModal();
        Swal.fire('Success!', 'Encounter created successfully!', 'success');
        navigate('encounters');
    } catch (error) {
        Swal.fire('Error', 'Failed to create encounter with AI', 'error');
    }
}

// Encounter Search Functions
let encounterSearchTimeout;

window.searchEncounterForMed = async function(query) {
    console.log('searchEncounterForMed:', query);
    clearTimeout(encounterSearchTimeout);
    const resultsDiv = document.getElementById('encounter-results-med');
    
    if (!resultsDiv) return;
    
    encounterSearchTimeout = setTimeout(async () => {
        try {
            const encounters = await apiCall('/encounters');
            const patients = await apiCall('/patients');
            console.log('Encounters:', encounters.results?.length, 'Patients:', patients.results?.length);
            const patientMap = {};
            patients.results?.forEach(p => patientMap[p.id] = p);
            
            const filtered = query.trim() ? encounters.results?.filter(e => {
                const patient = patientMap[e.patient];
                const patientName = patient ? `${patient.first_name} ${patient.last_name}` : '';
                return patient && patientName && (patientName.toLowerCase().includes(query.toLowerCase()) || e.patient.toString().includes(query) || e.id.toString().includes(query));
            }) : encounters.results?.filter(e => patientMap[e.patient]);
            console.log('Filtered:', filtered?.length);
            
            resultsDiv.innerHTML = (filtered || []).slice(0, 10).map(e => {
                const patient = patientMap[e.patient];
                const patientName = patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
                return `<div onclick="selectEncounterMed(${e.patient}, ${e.id}, '${patientName}', '${e.unique_id}')" style="padding: 0.75rem; cursor: pointer; border-bottom: 1px solid #f3f4f6; hover:background: #f9fafb;">Patient: ${patientName} (ID: ${e.patient})<br><small style="color: #6b7280;">Encounter ID: ${e.id} - ${e.unique_id}</small></div>`;
            }).join('') || '<div style="padding: 0.75rem; color: #6b7280;">No encounters found</div>';
            console.log('Showing results');
            resultsDiv.style.display = 'block';
        } catch (error) {
            console.error('Search error:', error);
            resultsDiv.innerHTML = '<div style="padding: 0.75rem; color: #ef4444;">Error loading encounters</div>';
            resultsDiv.style.display = 'block';
        }
    }, 300);
}

window.selectEncounterMed = function(patientId, encounterId, patientName, encounterUid) {
    document.getElementById('selected-patient-med').value = patientId;
    document.getElementById('selected-encounter-med').value = encounterId;
    document.getElementById('encounter-search-med').value = `${patientName} - ${encounterUid}`;
    document.getElementById('encounter-results-med').style.display = 'none';
}

window.searchEncounterForTest = async function(query) {
    clearTimeout(encounterSearchTimeout);
    const resultsDiv = document.getElementById('encounter-results-test');
    
    if (!resultsDiv) return;
    
    encounterSearchTimeout = setTimeout(async () => {
        try {
            const encounters = await apiCall('/encounters');
            const patients = await apiCall('/patients');
            const patientMap = {};
            patients.results?.forEach(p => patientMap[p.id] = p);
            
            const filtered = query.trim() ? encounters.results?.filter(e => {
                const patient = patientMap[e.patient];
                const patientName = patient ? `${patient.first_name} ${patient.last_name}` : '';
                return patient && patientName && (patientName.toLowerCase().includes(query.toLowerCase()) || e.patient.toString().includes(query) || e.id.toString().includes(query));
            }) : encounters.results?.filter(e => patientMap[e.patient]);
            
            resultsDiv.innerHTML = (filtered || []).slice(0, 10).map(e => {
                const patient = patientMap[e.patient];
                const patientName = patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
                return `<div onclick="selectEncounterTest(${e.patient}, ${e.id}, '${patientName}', '${e.unique_id}')" style="padding: 0.75rem; cursor: pointer; border-bottom: 1px solid #f3f4f6; hover:background: #f9fafb;">Patient: ${patientName} (ID: ${e.patient})<br><small style="color: #6b7280;">Encounter ID: ${e.id} - ${e.unique_id}</small></div>`;
            }).join('') || '<div style="padding: 0.75rem; color: #6b7280;">No encounters found</div>';
            resultsDiv.style.display = 'block';
        } catch (error) {
            resultsDiv.innerHTML = '<div style="padding: 0.75rem; color: #ef4444;">Error loading encounters</div>';
        }
    }, 300);
}

window.selectEncounterTest = function(patientId, encounterId, patientName, encounterUid) {
    document.getElementById('selected-patient-test').value = patientId;
    document.getElementById('selected-encounter-test').value = encounterId;
    document.getElementById('encounter-search-test').value = `${patientName} - ${encounterUid}`;
    document.getElementById('encounter-results-test').style.display = 'none';
}

let medNameSearchTimeout;
window.searchMedicationName = async function(query) {
    console.log('searchMedicationName:', query);
    clearTimeout(medNameSearchTimeout);
    const resultsDiv = document.getElementById('med-name-results');
    if (!resultsDiv) return;
    
    medNameSearchTimeout = setTimeout(async () => {
        try {
            const encounters = await apiCall('/encounters');
            console.log('Total encounters:', encounters.results?.length);
            const allMeds = [];
            for (const enc of encounters.results || []) {
                const detail = await apiCall(`/encounters/${enc.id}`);
                console.log(`Encounter ${enc.id} meds:`, detail.encounter_medications?.length);
                if (detail.encounter_medications) {
                    allMeds.push(...detail.encounter_medications);
                }
            }
            console.log('Total meds:', allMeds.length);
            const uniqueNames = [...new Set(allMeds.map(m => m.name).filter(n => n))];
            console.log('Unique names:', uniqueNames);
            const filtered = query.trim() ? uniqueNames.filter(n => n.toLowerCase().includes(query.toLowerCase())) : uniqueNames;
            console.log('Filtered:', filtered);
            
            resultsDiv.innerHTML = filtered.slice(0, 10).map(name => 
                `<div onclick="selectMedName('${name}')" style="padding: 0.75rem; cursor: pointer; border-bottom: 1px solid #f3f4f6; hover:background: #f9fafb;">${name}</div>`
            ).join('') || '<div style="padding: 0.75rem; color: #6b7280;">No medications found</div>';
            resultsDiv.style.display = 'block';
        } catch (error) {
            console.error('Med search error:', error);
            resultsDiv.innerHTML = '<div style="padding: 0.75rem; color: #ef4444;">Error loading medications</div>';
            resultsDiv.style.display = 'block';
        }
    }, 300);
}

window.selectMedName = function(name) {
    document.getElementById('med-name-search').value = name;
    document.getElementById('med-name-results').style.display = 'none';
}

let testNameSearchTimeout;
window.searchTestName = async function(query) {
    clearTimeout(testNameSearchTimeout);
    const resultsDiv = document.getElementById('test-name-results');
    if (!resultsDiv) return;
    
    testNameSearchTimeout = setTimeout(async () => {
        try {
            const encounters = await apiCall('/encounters');
            const allTests = [];
            for (const enc of encounters.results || []) {
                const detail = await apiCall(`/encounters/${enc.id}`);
                if (detail.encounter_tests) {
                    allTests.push(...detail.encounter_tests);
                }
            }
            const uniqueNames = [...new Set(allTests.map(t => t.name).filter(n => n))];
            const filtered = query.trim() ? uniqueNames.filter(n => n.toLowerCase().includes(query.toLowerCase())) : uniqueNames;
            
            resultsDiv.innerHTML = filtered.slice(0, 10).map(name => 
                `<div onclick="selectTestName('${name}')" style="padding: 0.75rem; cursor: pointer; border-bottom: 1px solid #f3f4f6; hover:background: #f9fafb;">${name}</div>`
            ).join('') || '<div style="padding: 0.75rem; color: #6b7280;">No tests found</div>';
            resultsDiv.style.display = 'block';
        } catch (error) {
            resultsDiv.innerHTML = '<div style="padding: 0.75rem; color: #ef4444;">Error loading tests</div>';
            resultsDiv.style.display = 'block';
        }
    }, 300);
}

window.selectTestName = function(name) {
    document.getElementById('test-name-search').value = name;
    document.getElementById('test-name-results').style.display = 'none';
}

let patientSearchTimeout;
window.searchPatientForAI = async function(query, type) {
    clearTimeout(patientSearchTimeout);
    const resultsDiv = document.getElementById(`patient-results-${type}`);
    if (!resultsDiv) return;
    
    patientSearchTimeout = setTimeout(async () => {
        try {
            const patients = await apiCall('/patients');
            const filtered = query.trim() ? patients.results?.filter(p => {
                const patientName = `${p.first_name} ${p.last_name}`;
                return patientName.toLowerCase().includes(query.toLowerCase()) || p.id.toString().includes(query);
            }) : patients.results;
            
            resultsDiv.innerHTML = (filtered || []).slice(0, 10).map(p => {
                const patientName = `${p.first_name} ${p.last_name}`;
                return `<div onclick="selectPatientForAI(${p.id}, '${patientName}', '${type}')" style="padding: 0.75rem; cursor: pointer; border-bottom: 1px solid #f3f4f6; hover:background: #f9fafb;">${patientName} (ID: ${p.id})</div>`;
            }).join('') || '<div style="padding: 0.75rem; color: #6b7280;">No patients found</div>';
            resultsDiv.style.display = 'block';
        } catch (error) {
            resultsDiv.innerHTML = '<div style="padding: 0.75rem; color: #ef4444;">Error loading patients</div>';
            resultsDiv.style.display = 'block';
        }
    }, 300);
}

window.selectPatientForAI = function(id, name, type) {
    document.getElementById(`selected-patient-${type}`).value = id;
    document.getElementById(`patient-search-${type}`).value = `${name} (ID: ${id})`;
    document.getElementById(`patient-results-${type}`).style.display = 'none';
}

window.prescribeMedication = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const patientId = parseInt(formData.get('patient'));
    const data = {
        patient: patientId,
        encounter: parseInt(formData.get('encounter')),
        name: formData.get('name'),
        dosage: formData.get('dosage'),
        frequency: formData.get('frequency'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date')
    };
    
    try {
        await apiCall(`/patients/${patientId}/medications`, 'POST', data);
        Swal.fire('Success!', 'Medication prescribed successfully', 'success');
        event.target.reset();
        document.getElementById('encounter-search-med').value = '';
    } catch (error) {
        Swal.fire('Error', 'Failed to prescribe medication', 'error');
    }
}

window.orderTest = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const patientId = parseInt(formData.get('patient'));
    const data = {
        patient: patientId,
        encounter: parseInt(formData.get('encounter')),
        name: formData.get('name'),
        notes: formData.get('notes')
    };
    
    try {
        await apiCall(`/patients/${patientId}/tests`, 'POST', data);
        Swal.fire('Success!', 'Lab test ordered successfully', 'success');
        event.target.reset();
        document.getElementById('encounter-search-test').value = '';
    } catch (error) {
        Swal.fire('Error', 'Failed to order test', 'error');
    }
}

// Voice & AI Enhancement
const GEMINI_API_KEY = 'AIzaSyC_zk6RFUUqiuSuVOTZVhYQDx_E_wfGpIY';
let recognition;
let isListening = false;

window.startVoiceInput = function(textareaId) {
    const btn = event.target;
    
    if (isListening) {
        recognition.stop();
        isListening = false;
        btn.innerHTML = '🎤';
        btn.style.background = '#0ea5e9';
        return;
    }
    
    if (!('webkitSpeechRecognition' in window)) {
        Swal.fire('Error', 'Speech recognition not supported', 'error');
        return;
    }
    
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    let finalTranscript = document.getElementById(textareaId).value;
    
    recognition.onstart = () => {
        isListening = true;
        btn.innerHTML = '⏸️';
        btn.style.background = '#ef4444';
    };
    
    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + ' ';
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        document.getElementById(textareaId).value = finalTranscript + interimTranscript;
    };
    
    recognition.onend = () => {
        isListening = false;
        btn.innerHTML = '🎤';
        btn.style.background = '#0ea5e9';
    };
    
    recognition.onerror = () => {
        isListening = false;
        btn.innerHTML = '🎤';
        btn.style.background = '#0ea5e9';
        Swal.fire('Error', 'Speech recognition failed', 'error');
    };
    
    recognition.start();
}

window.improvePrompt = async function(textareaId) {
    const textarea = document.getElementById(textareaId);
    const prompt = textarea.value.trim();
    
    if (!prompt) {
        Swal.fire('Error', 'Please enter a prompt first', 'error');
        return;
    }
    
    try {
        Swal.fire({ title: 'Improving...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        
        const systemPrompt = textareaId.includes('patient') 
            ? 'Improve this patient description to include: full name, age/DOB, gender, contact info, allergies. Return only the improved text.'
            : textareaId.includes('appt')
            ? 'Improve this appointment description to include: date, time, reason. Return only the improved text.'
            : 'Improve this encounter description to include: symptoms, vitals, diagnosis, treatment. Return only the improved text.';
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + '\n\nOriginal: ' + prompt }] }]
            })
        });
        
        const result = await response.json();
        const improved = result.candidates[0].content.parts[0].text;
        
        Swal.fire({
            title: 'Improved Prompt',
            html: `<textarea readonly style="width: 100%; height: 150px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">${improved}</textarea>`,
            showCancelButton: true,
            confirmButtonText: 'Use This',
            cancelButtonText: 'Keep Original'
        }).then((result) => {
            if (result.isConfirmed) {
                textarea.value = improved;
            }
        });
    } catch (error) {
        Swal.fire('Error', 'Failed to improve prompt', 'error');
    }
}

// Google Fit Integration
const GOOGLE_FIT_CLIENT_ID = '540896450970-249g4m29ttf4vvo7jnj21cobpkv5dvbs.apps.googleusercontent.com';
let googleFitToken = null;

function FitnessPage() {
    return `
        ${Sidebar()}
        <main class="main-content">
            <div class="section-header">
                <h2>Fitness Tracking</h2>
                <button class="btn btn-primary" id="connect-google-fit" onclick="connectGoogleFit()">
                    ${icons.check} Connect Google Fit
                </button>
            </div>
            <div id="fitness-content">
                <div style="text-align: center; padding: 3rem; color: #6b7280;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🏃‍♂️</div>
                    <h3>Connect Google Fit to view your fitness data</h3>
                    <p>Track steps, heart rate, calories, and sleep patterns</p>
                </div>
            </div>
        </main>
    `;
}

window.connectGoogleFit = function() {
    const client = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_FIT_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.heart_rate.read https://www.googleapis.com/auth/fitness.body.read https://www.googleapis.com/auth/fitness.sleep.read',
        callback: (response) => {
            if (response.access_token) {
                googleFitToken = response.access_token;
                loadPatientFitnessData();
            }
        }
    });
    client.requestAccessToken();
}

window.loadPatientFitnessData = async function() {
    const endTime = Date.now();
    const startTime = endTime - 86400000;
    
    try {
        const [steps, heartRate, calories, sleep] = await Promise.all([
            fetchFitData('com.google.step_count.delta', startTime, endTime),
            fetchFitData('com.google.heart_rate.bpm', startTime, endTime),
            fetchFitData('com.google.calories.expended', startTime, endTime),
            fetchFitData('com.google.sleep.segment', startTime, endTime)
        ]);
        
        const stepsTotal = steps.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
        const avgHeartRate = heartRate.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0;
        const caloriesTotal = calories.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0;
        const sleepMinutes = sleep.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
        
        document.getElementById('patient-fitness-data').innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1rem;">
                <div style="background: #f0f9ff; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 1.5rem;">🚶</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: #0369a1;">${stepsTotal.toLocaleString()}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">Steps Today</div>
                </div>
                <div style="background: #fef2f2; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 1.5rem;">❤️</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: #dc2626;">${Math.round(avgHeartRate)} bpm</div>
                    <div style="font-size: 0.75rem; color: #64748b;">Heart Rate</div>
                </div>
                <div style="background: #fff7ed; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 1.5rem;">🔥</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: #ea580c;">${Math.round(caloriesTotal)}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">Calories</div>
                </div>
                <div style="background: #f5f3ff; padding: 1rem; border-radius: 8px; text-align: center;">
                    <div style="font-size: 1.5rem;">😴</div>
                    <div style="font-size: 1.5rem; font-weight: 600; color: #7c3aed;">${Math.round(sleepMinutes / 60)}h ${sleepMinutes % 60}m</div>
                    <div style="font-size: 0.75rem; color: #64748b;">Sleep</div>
                </div>
            </div>
        `;
        document.getElementById('connect-google-fit-btn').innerHTML = `${icons.check} Connected`;
        document.getElementById('connect-google-fit-btn').disabled = true;
    } catch (error) {
        Swal.fire('Error', 'Failed to load fitness data', 'error');
    }
}

async function fetchFitData(dataType, startTime, endTime) {
    const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${googleFitToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            aggregateBy: [{ dataTypeName: dataType }],
            startTimeMillis: startTime,
            endTimeMillis: endTime
        })
    });
    return response.json();
}

window.initGoogleFit = function() {
    if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        document.head.appendChild(script);
    }
}

// Health Facts Widget
const healthFacts = [
    "Drinking water first thing in the morning helps activate your internal organs and flush out toxins.",
    "Your liver can regenerate itself completely even if only 25% of it remains functional.",
    "Walking barefoot on grass for 15 minutes daily can help reduce stress and improve sleep quality.",
    "Laughing for 10-15 minutes can burn approximately 40 calories.",
    "Your brain uses 20% of your body's total oxygen and blood supply despite being only 2% of body weight.",
    "Eating slowly can help you consume fewer calories and improve digestion significantly.",
    "Standing for 3 hours burns 144 more calories than sitting for the same duration.",
    "Your sense of smell is 10,000 times more sensitive than your sense of taste.",
    "Drinking green tea regularly can boost your metabolism by 4-5% and help burn fat.",
    "Taking deep breaths for 5 minutes can lower blood pressure and reduce stress hormones.",
    "Your stomach lining replaces itself every 3-4 days to prevent it from digesting itself.",
    "Eating dark chocolate (70%+ cocoa) can improve blood flow and lower blood pressure.",
    "Your body produces about 25 million new cells every second.",
    "Sleeping on your left side can improve digestion and reduce acid reflux symptoms.",
    "Chewing gum while studying and during tests can improve memory recall by 35%.",
    "Your bones are 4 times stronger than concrete, yet they're mostly made of water.",
    "Eating an apple in the morning is more effective at waking you up than coffee.",
    "Your heart beats about 100,000 times per day, pumping 2,000 gallons of blood.",
    "Smiling, even when you don't feel happy, can trick your brain into feeling better.",
    "Your body has enough iron to make a 3-inch nail.",
    "Drinking cold water can boost your metabolism by up to 30% for about 90 minutes.",
    "Your eyes can distinguish approximately 10 million different colors.",
    "Eating carrots doesn't just help night vision - they also reduce the risk of lung cancer by 40%.",
    "Your fingernails grow nearly 4 times faster than your toenails.",
    "Listening to music for 15 minutes can boost your immune system by increasing antibody production.",
    "Your body produces enough saliva in a lifetime to fill two swimming pools.",
    "Eating almonds before meals can reduce overall calorie absorption by up to 15%.",
    "Your brain continues to develop until you're about 25 years old.",
    "Taking a cold shower for 2-3 minutes can boost your immune system and increase alertness.",
    "Your sense of smell is directly linked to memory - scents can trigger vivid memories instantly."
];

let currentFactIndex = 0;

window.showHealthFact = function() {
    console.log('🏥 Health fact triggered, index:', currentFactIndex);
    const widget = document.getElementById('health-fact-widget');
    if (!widget) {
        console.error('❌ Widget element not found!');
        return;
    }
    console.log('✅ Widget found, showing fact');
    
    widget.innerHTML = `
        <div style="font-size: 0.75rem; color: #0ea5e9; font-weight: 600; margin-bottom: 0.5rem;">💡 Health Tip</div>
        <div style="font-size: 0.85rem; line-height: 1.4; color: #1f2937;">${healthFacts[currentFactIndex]}</div>
    `;
    widget.style.display = 'block';
    widget.style.opacity = '0';
    widget.style.zIndex = '99999';
    
    setTimeout(() => widget.style.opacity = '1', 100);
    
    setTimeout(() => {
        widget.style.opacity = '0';
        setTimeout(() => {
            widget.style.display = 'none';
            currentFactIndex = (currentFactIndex + 1) % healthFacts.length;
            setTimeout(showHealthFact, 32000);
        }, 500);
    }, 12000);
}

// Initialize
console.log('🚀 App.js loaded, initializing...');
render();

window.addEventListener('message', (event) => {
    if (event.data.event === 'DrugInteraction') {
        handleWebhookEvent(event.data);
    }
});

// Start health facts widget - MUST BE LAST
console.log('=== HEALTH FACTS INIT START ===');
console.log('typeof setTimeout:', typeof setTimeout);
console.log('typeof window.showHealthFact:', typeof window.showHealthFact);
console.log('⏰ Setting health fact timer for 5 seconds');
setTimeout(() => {
    console.log('⏰ 5 seconds passed, calling showHealthFact');
    try {
        window.showHealthFact();
    } catch(e) {
        console.error('❌ Error calling showHealthFact:', e);
    }
}, 5000);
setInterval(() => {
    try {
        window.showHealthFact();
    } catch(e) {
        console.error('❌ Error in interval:', e);
    }
}, 32000);
