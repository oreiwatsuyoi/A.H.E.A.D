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
    const userRole = localStorage.getItem('user_role');
    
    if (!userRole && page !== 'home') {
        Swal.fire('Access Denied', 'Please login and select a role to access other pages', 'error');
        return;
    }
    
    if (userRole === 'patient' && !['home', 'settings'].includes(page)) {
        Swal.fire('Access Denied', 'Patients can only access Home and Settings', 'error');
        return;
    }
    
    if (userRole === 'doctor' && page === 'home') {
        page = 'dashboard';
    }
    
    currentPage = page;
    currentData = params;
    if (typeof savePageData === 'function') savePageData('current', { page, params });
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
    check: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
    settings: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>'
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

function Footer() {
    return `
        <footer style="background: linear-gradient(135deg, #0f172a, #1e293b); border-top: 2px solid rgba(14, 165, 233, 0.3); margin-top: 4rem; padding: 3rem 0 1rem;">
            <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 3rem; margin-bottom: 3rem;">
                    <div>
                        <h3 style="color: #0ea5e9; font-size: 1.5rem; margin-bottom: 1rem;">MediCore</h3>
                        <p style="color: #94a3b8; line-height: 1.6; margin-bottom: 1rem;">Revolutionary healthcare platform built for Africa. Empowering healthcare providers with cutting-edge technology.</p>
                        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                            <a href="#" style="width: 40px; height: 40px; background: rgba(14, 165, 233, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0ea5e9; text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='rgba(14, 165, 233, 0.3)'" onmouseout="this.style.background='rgba(14, 165, 233, 0.1)'"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" style="width: 40px; height: 40px; background: rgba(14, 165, 233, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0ea5e9; text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='rgba(14, 165, 233, 0.3)'" onmouseout="this.style.background='rgba(14, 165, 233, 0.1)'"><i class="fab fa-twitter"></i></a>
                            <a href="#" style="width: 40px; height: 40px; background: rgba(14, 165, 233, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0ea5e9; text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='rgba(14, 165, 233, 0.3)'" onmouseout="this.style.background='rgba(14, 165, 233, 0.1)'"><i class="fab fa-linkedin-in"></i></a>
                            <a href="#" style="width: 40px; height: 40px; background: rgba(14, 165, 233, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0ea5e9; text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='rgba(14, 165, 233, 0.3)'" onmouseout="this.style.background='rgba(14, 165, 233, 0.1)'"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                    
                    <div>
                        <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 1rem;">Quick Links</h4>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="margin-bottom: 0.75rem;"><a href="javascript:navigate('home')" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Home</a></li>
                            <li style="margin-bottom: 0.75rem;"><a href="javascript:navigate('dashboard')" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Dashboard</a></li>
                            <li style="margin-bottom: 0.75rem;"><a href="javascript:navigate('patients')" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Patients</a></li>
                            <li style="margin-bottom: 0.75rem;"><a href="javascript:navigate('appointments')" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Appointments</a></li>
                            <li style="margin-bottom: 0.75rem;"><a href="javascript:navigate('encounters')" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Encounters</a></li>
                            <li style="margin-bottom: 0.75rem;"><a href="javascript:navigate('ai')" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Doctor Chat</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 1rem;">Features</h4>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="margin-bottom: 0.75rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">AI Patient Creation</a></li>
                            <li style="margin-bottom: 0.75rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Smart Appointments</a></li>
                            <li style="margin-bottom: 0.75rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Medical Encounters</a></li>
                            <li style="margin-bottom: 0.75rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">PharmaVigilance</a></li>
                            <li style="margin-bottom: 0.75rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Wellness Tracking</a></li>
                            <li style="margin-bottom: 0.75rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Video Consultations</a></li>
                            <li style="margin-bottom: 0.75rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">SOS Emergency</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 1rem;">Contact Us</h4>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="margin-bottom: 0.75rem; display: flex; align-items: start; gap: 0.5rem;">
                                <i class="fas fa-map-marker-alt" style="color: #0ea5e9; margin-top: 0.25rem;"></i>
                                <span style="color: #94a3b8; line-height: 1.6;">Radisson Blu Hotel, Ikeja, Lagos, Nigeria</span>
                            </li>
                            <li style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-phone" style="color: #0ea5e9;"></i>
                                <a href="tel:+2348012345678" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">+234 801 234 5678</a>
                            </li>
                            <li style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-envelope" style="color: #0ea5e9;"></i>
                                <a href="mailto:support@medicore.health" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">support@medicore.health</a>
                            </li>
                            <li style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-clock" style="color: #0ea5e9;"></i>
                                <span style="color: #94a3b8;">24/7 Support Available</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                    <div style="color: #94a3b8; font-size: 0.9rem;">
                        © 2025 MediCore Health Platform. All rights reserved. Built for A.H.E.A.D Hackathon 2025.
                    </div>
                    <div style="display: flex; gap: 2rem;">
                        <a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Privacy Policy</a>
                        <a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Terms of Service</a>
                        <a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    `;
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
    const userRole = localStorage.getItem('user_role');
    
    const noRoleItems = [
        { id: 'home', label: 'Home', icon: 'home' }
    ];
    
    const patientItems = [
        { id: 'home', label: 'Home', icon: 'home' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
    ];
    
    const doctorItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'patients', label: 'Patients', icon: 'patients' },
        { id: 'appointments', label: 'Appointments', icon: 'appointments' },
        { id: 'encounters', label: 'Encounters', icon: 'encounters' },
        { id: 'emergency', label: 'Emergency', icon: 'medications', desktopOnly: true },
        { id: 'pharma', label: 'PharmaWatch', icon: 'medications', desktopOnly: true },
        { id: 'ai', label: 'Doctor Chat', icon: 'ai' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
    ];
    
    const items = !userRole ? noRoleItems : (userRole === 'patient' ? patientItems : doctorItems);
    
    return `
        ${TopNav()}
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="logo">MediCore</div>
                <div id="auth-btn" style="margin-top: 1rem;"></div>
            </div>
            <ul class="nav-menu">
                ${items.map(item => `
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
            <div id="home-content">
                <div class="loading"><div class="spinner"></div><p>Loading your dashboard...</p></div>
            </div>
        </main>
    `;
}

async function loadHomePage() {
    const user = firebase.app('sos-emergency').auth().currentUser;
    const homeContent = document.getElementById('home-content');
    if (!homeContent) return;
    
    // Initialize Google Fit API
    initGoogleFit();
    
    if (!user) {
        homeContent.innerHTML = `
            <div class="hero">
                <h1>Revolutionary Healthcare Platform</h1>
                <p>Empowering African healthcare with cutting-edge technology, AI-powered insights, and seamless patient management</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary" onclick="showAuthModal('login')">
                        Login ${icons.arrow}
                    </button>
                    <button class="btn btn-secondary" onclick="showAuthModal('signup')">
                        Sign Up
                    </button>
                </div>
            </div>
            
            <div class="features-grid" style="margin: 4rem auto; max-width: 1400px;">
                <div class="feature-card">
                    <div class="feature-icon">${icons.patients}</div>
                    <h3>Patient Management</h3>
                    <p>Comprehensive patient records with advanced search, filtering, and real-time updates. Manage allergies, medical history, and demographics effortlessly.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">${icons.appointments}</div>
                    <h3>Smart Appointments</h3>
                    <p>Intelligent scheduling system with automated reminders, conflict detection, and seamless calendar integration for optimal patient flow.</p>
                </div>
                
                <div class="feature-card feature-center">
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
        `;
        return;
    }
    const userEmail = user.email;
    
    if (!userEmail) {
        const homeContent = document.getElementById('home-content');
        if (!homeContent) return;
        homeContent.innerHTML = `
            <div class="hero">
                <h1>Revolutionary Healthcare Platform</h1>
                <p>Empowering African healthcare with cutting-edge technology, AI-powered insights, and seamless patient management</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary" onclick="showAuthModal('login')">
                        Login ${icons.arrow}
                    </button>
                    <button class="btn btn-secondary" onclick="showAuthModal('signup')">
                        Sign Up
                    </button>
                </div>
            </div>
            
            <div class="features-grid" style="margin: 4rem auto; max-width: 1400px;">
                <div class="feature-card">
                    <div class="feature-icon">${icons.patients}</div>
                    <h3>Patient Management</h3>
                    <p>Comprehensive patient records with advanced search, filtering, and real-time updates. Manage allergies, medical history, and demographics effortlessly.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">${icons.appointments}</div>
                    <h3>Smart Appointments</h3>
                    <p>Intelligent scheduling system with automated reminders, conflict detection, and seamless calendar integration for optimal patient flow.</p>
                </div>
                
                <div class="feature-card feature-center">
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
        `;
        return;
    }
    
    try {
        const patients = await apiCall('/patients');
        const patient = patients.results?.find(p => p.email === userEmail);
        
        if (!patient) {
            document.getElementById('home-content').innerHTML = `
                <div style="max-width: 800px; margin: 4rem auto; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 2rem;">🏥</div>
                    <h1 style="color: #fff; margin-bottom: 1rem;">Welcome to MediCore</h1>
                    <p style="color: #94a3b8; font-size: 1.1rem; margin-bottom: 2rem;">You're logged in as ${userEmail}</p>
                    
                    <div style="background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(59, 130, 246, 0.1)); padding: 3rem; border-radius: 20px; border: 2px solid rgba(14, 165, 233, 0.3); margin-bottom: 2rem;">
                        <h2 style="color: #0ea5e9; margin-bottom: 1rem;">Register as a Patient</h2>
                        <p style="color: #cbd5e1; margin-bottom: 2rem; line-height: 1.6;">To access your personal health dashboard with appointments, medical records, and video consultations, please complete your patient registration.</p>
                        <button class="btn btn-primary" onclick="showModal('createPatient')" style="padding: 1rem 2rem; font-size: 1.1rem;">
                            ${icons.plus} Complete Registration
                        </button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 3rem;">
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #10b981;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📅</div>
                            <h4 style="color: #10b981; margin-bottom: 0.5rem;">Appointments</h4>
                            <p style="color: #94a3b8; font-size: 0.9rem;">Schedule and manage your medical appointments</p>
                        </div>
                        <div style="background: rgba(59, 130, 246, 0.1); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📋</div>
                            <h4 style="color: #3b82f6; margin-bottom: 0.5rem;">Medical Records</h4>
                            <p style="color: #94a3b8; font-size: 0.9rem;">Access your complete health history</p>
                        </div>
                        <div style="background: rgba(139, 92, 246, 0.1); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #8b5cf6;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎥</div>
                            <h4 style="color: #8b5cf6; margin-bottom: 0.5rem;">Video Consultations</h4>
                            <p style="color: #94a3b8; font-size: 0.9rem;">Connect with doctors remotely</p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        const [appointments, encounters, medications, tests, emergencies] = await Promise.all([
            apiCall(`/patients/${patient.id}/appointments`).catch(() => ({results: []})),
            apiCall(`/patients/${patient.id}/encounters`).catch(() => ({results: []})),
            apiCall(`/patients/${patient.id}/medications`).catch(() => ({results: []})),
            apiCall(`/patients/${patient.id}/tests`).catch(() => ({results: []})),
            Promise.resolve({results: JSON.parse(localStorage.getItem('emergency_alerts') || '[]').filter(e => e.patient.email === userEmail)})
        ]);
        
        const homeContent = document.getElementById('home-content');
        if (!homeContent) return;
        homeContent.innerHTML = `
            <div class="hero" style="margin-bottom: 3rem;">
                <h1>Welcome back, ${patient.first_name}! <i class="fas fa-hand-wave" style="color: #fff;"></i></h1>
                <p>Here's your complete health overview and quick access to all your medical services</p>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h2 style="color: #fff; margin-bottom: 0.5rem;">Your Health Dashboard</h2>
                <p style="color: #94a3b8;">All your medical information in one place</p>
            </div>
            
            <div class="stats-grid" style="margin-bottom: 2rem;">
                <div class="stat-card" style="background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(14, 165, 233, 0.2)); border-left: 4px solid #0ea5e9;">
                    <div class="stat-header"><h4>Appointments</h4><div class="stat-icon">📅</div></div>
                    <div class="stat-value">${appointments.results?.length || 0}</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2)); border-left: 4px solid #10b981;">
                    <div class="stat-header"><h4>Encounters</h4><div class="stat-icon">📋</div></div>
                    <div class="stat-value">${encounters.results?.length || 0}</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.2)); border-left: 4px solid #8b5cf6;">
                    <div class="stat-header"><h4>Medications</h4><div class="stat-icon">💊</div></div>
                    <div class="stat-value">${medications.results?.length || 0}</div>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.2)); border-left: 4px solid #ef4444;">
                    <div class="stat-header"><h4>Emergencies</h4><div class="stat-icon">🚨</div></div>
                    <div class="stat-value">${emergencies.results?.length || 0}</div>
                </div>
            </div>
            
            <div class="data-section" style="margin-bottom: 2rem; max-width: 1400px; margin-left: auto; margin-right: auto;">
                <div class="section-header">
                    <h3>Health Profile</h3>
                    <button class="btn btn-secondary" onclick="saveHealthProfile()" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                        ${icons.check} Save Profile
                    </button>
                </div>
                <div style="padding: 1.5rem;">
                    <p style="color: #94a3b8; margin-bottom: 1rem; font-size: 0.9rem;">Select all that apply to personalize your healthcare experience and improve emergency response</p>
                    <input type="text" id="health-profile-search" placeholder="Search conditions..." oninput="filterHealthTags(this.value)" style="width: 100%; padding: 0.75rem; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; margin-bottom: 1rem;">
                    <div id="health-profile-tags" style="display: flex; flex-wrap: wrap; gap: 0.75rem; max-height: 400px; overflow-y: auto;">
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; max-width: 1400px; margin-left: auto; margin-right: auto;">
                <div class="stat-card">
                    <h3 style="color: #0ea5e9; margin-bottom: 1rem;">Personal Information</h3>
                    <div style="display: grid; gap: 0.75rem;">
                        <p><strong>First Name:</strong> ${patient.first_name}</p>
                        <p><strong>Last Name:</strong> ${patient.last_name}</p>
                        <p><strong>Date of Birth:</strong> ${patient.date_of_birth || 'N/A'}</p>
                        <p><strong>Age:</strong> ${patient.age || 'N/A'}</p>
                        <p><strong>Gender:</strong> <span class="badge badge-info">${patient.gender}</span></p>
                        <p><strong>Email:</strong> ${patient.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> ${patient.phone_number || 'N/A'}</p>
                        <p><strong>Address:</strong> ${patient.address || 'N/A'}</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <h3 style="color: #ef4444; margin-bottom: 1rem;">Medical Information</h3>
                    <div style="display: grid; gap: 0.75rem;">
                        <p><strong>Allergies:</strong></p>
                        ${patient.allergies?.length > 0 ? `
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${patient.allergies.map(a => `<span class="badge" style="background: #fee2e2; color: #dc2626;">${a}</span>`).join('')}
                            </div>
                        ` : '<p style="color: #94a3b8;">No known allergies</p>'}
                        <p style="margin-top: 1rem;"><strong>Created:</strong> ${new Date(patient.created_at).toLocaleDateString()}</p>
                        <p><strong>Last Updated:</strong> ${new Date(patient.updated_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            
            <div class="data-section" style="margin-bottom: 2rem; max-width: 1400px; margin-left: auto; margin-right: auto;">
                <div class="section-header">
                    <h3>Fitness Data</h3>
                    <button class="btn btn-primary" id="connect-google-fit-btn" onclick="connectGoogleFit()">
                        Connect Google Fit
                    </button>
                </div>
                <div id="patient-fitness-data">
                    <p style="padding: 1rem; color: #6b7280; text-align: center;">Connect Google Fit to view fitness data</p>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; max-width: 1400px; margin-left: auto; margin-right: auto;">
                <div class="data-section">
                    <div class="section-header">
                        <h3>My Appointments</h3>
                    </div>
                    ${appointments.results?.length > 0 ? `
                        <table class="data-table">
                            <thead><tr><th>Date</th><th>Time</th><th>Reason</th><th>Status</th></tr></thead>
                            <tbody>
                                ${appointments.results.slice(0, 5).map(a => `
                                    <tr>
                                        <td>${new Date(a.date).toLocaleDateString()}</td>
                                        <td>${new Date(a.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                        <td>${a.reason || 'Checkup'}</td>
                                        <td><span class="badge" style="background: #0ea5e9;">${a.status || 'Scheduled'}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p style="padding: 2rem; text-align: center; color: #6b7280;">No appointments scheduled</p>'}
                </div>
                
                <div class="data-section">
                    <div class="section-header">
                        <h3>Recent Encounters</h3>
                    </div>
                    ${encounters.results?.length > 0 ? `
                        <table class="data-table">
                            <thead><tr><th>Date</th><th>Diagnosis</th><th>Doctor</th></tr></thead>
                            <tbody>
                                ${encounters.results.slice(0, 5).map(e => `
                                    <tr onclick="viewEncounterDetails(${e.id})" style="cursor: pointer;">
                                        <td>${new Date(e.created_at).toLocaleDateString()}</td>
                                        <td>${e.diagnosis || 'N/A'}</td>
                                        <td>${e.doctor_name || 'Dr. Available'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : '<p style="padding: 2rem; text-align: center; color: #6b7280;">No encounters recorded</p>'}
                </div>
            </div>
            
            <div class="data-section" style="margin-bottom: 2rem;">
                <div class="section-header">
                    <h3>Current Medications</h3>
                </div>
                ${medications.results?.length > 0 ? `
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; padding: 1rem;">
                        ${medications.results.slice(0, 6).map(m => `
                            <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05)); padding: 1rem; border-radius: 10px; border-left: 3px solid #8b5cf6;">
                                <div style="font-weight: 600; color: #8b5cf6; margin-bottom: 0.5rem;">${m.name}</div>
                                <div style="color: #94a3b8; font-size: 0.85rem;">${m.dosage || 'N/A'} - ${m.frequency || 'N/A'}</div>
                                <div style="color: #6b7280; font-size: 0.75rem; margin-top: 0.25rem;">${m.start_date ? new Date(m.start_date).toLocaleDateString() : 'Ongoing'}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p style="padding: 2rem; text-align: center; color: #6b7280;">No current medications</p>'}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; max-width: 1400px; margin-left: auto; margin-right: auto;">
                <div class="data-section">
                    <div class="section-header">
                        <h3>🎥 Video Consultation</h3>
                    </div>
                    <div style="padding: 2rem; text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">👨‍⚕️</div>
                        <h4 style="color: #fff; margin-bottom: 1rem;">Connect with a Doctor</h4>
                        <p style="color: #94a3b8; margin-bottom: 2rem;">Enter your 6-digit access code to start a video consultation</p>
                        <button class="btn btn-primary" onclick="navigate('ai')" style="padding: 1rem 2rem;">
                            ${icons.ai} Start Video Call
                        </button>
                    </div>
                </div>
                
                <div class="data-section">
                    <div class="section-header">
                        <h3>💬 Message Doctor</h3>
                    </div>
                    <div style="padding: 1rem;">
                        <div id="patient-chat-messages" style="height: 300px; overflow-y: auto; background: rgba(15, 23, 42, 0.6); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
                            <p style="color: #94a3b8; text-align: center; padding: 2rem;">No messages yet. Start a conversation with your doctor.</p>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="patient-message-input" placeholder="Type your message..." style="flex: 1; padding: 0.75rem; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff;" onkeypress="if(event.key==='Enter') sendPatientMessage()">
                            <button onclick="sendPatientMessage()" class="btn btn-primary" style="padding: 0.75rem 1.5rem;">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="features-grid" style="margin: 4rem auto; max-width: 1400px;">
                <div class="feature-card">
                    <div class="feature-icon">${icons.patients}</div>
                    <h3>Patient Management</h3>
                    <p>Comprehensive patient records with advanced search, filtering, and real-time updates. Manage allergies, medical history, and demographics effortlessly.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">${icons.appointments}</div>
                    <h3>Smart Appointments</h3>
                    <p>Intelligent scheduling system with automated reminders, conflict detection, and seamless calendar integration for optimal patient flow.</p>
                </div>
                
                <div class="feature-card feature-center">
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
            
            <footer style="background: linear-gradient(135deg, #0f172a, #1e293b); border-top: 2px solid rgba(14, 165, 233, 0.3); margin-top: 4rem; padding: 3rem 0 1rem;">
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 3rem; margin-bottom: 3rem;">
                        <div>
                            <h3 style="color: #0ea5e9; font-size: 1.5rem; margin-bottom: 1rem;">MediCore</h3>
                            <p style="color: #94a3b8; line-height: 1.6; margin-bottom: 1rem;">Revolutionary healthcare platform built for Africa. Empowering healthcare providers with cutting-edge technology.</p>
                            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                                <a href="#" style="width: 40px; height: 40px; background: rgba(14, 165, 233, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0ea5e9; text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='rgba(14, 165, 233, 0.3)'" onmouseout="this.style.background='rgba(14, 165, 233, 0.1)'"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" style="width: 40px; height: 40px; background: rgba(14, 165, 233, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0ea5e9; text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='rgba(14, 165, 233, 0.3)'" onmouseout="this.style.background='rgba(14, 165, 233, 0.1)'"><i class="fab fa-twitter"></i></a>
                                <a href="#" style="width: 40px; height: 40px; background: rgba(14, 165, 233, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0ea5e9; text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='rgba(14, 165, 233, 0.3)'" onmouseout="this.style.background='rgba(14, 165, 233, 0.1)'"><i class="fab fa-linkedin-in"></i></a>
                                <a href="#" style="width: 40px; height: 40px; background: rgba(14, 165, 233, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #0ea5e9; text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='rgba(14, 165, 233, 0.3)'" onmouseout="this.style.background='rgba(14, 165, 233, 0.1)'"><i class="fab fa-instagram"></i></a>
                            </div>
                        </div>
                        
                        <div>
                            <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 1rem;">Quick Links</h4>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="margin-bottom: 0.75rem;"><a href="javascript:navigate('home')" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Home</a></li>
                                <li style="margin-bottom: 0.75rem;"><a href="javascript:navigate('dashboard')" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Dashboard</a></li>
                                <li style="margin-bottom: 0.75rem;"><a href="javascript:navigate('patients')" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Patients</a></li>
                                <li style="margin-bottom: 0.75rem;"><a href="javascript:navigate('appointments')" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Appointments</a></li>
                                <li style="margin-bottom: 0.75rem;"><a href="javascript:navigate('encounters')" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Encounters</a></li>
                                <li style="margin-bottom: 0.75rem;"><a href="javascript:navigate('ai')" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Doctor Chat</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 1rem;">Features</h4>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="margin-bottom: 0.75rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">AI Patient Creation</a></li>
                                <li style="margin-bottom: 0.75rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Smart Appointments</a></li>
                                <li style="margin-bottom: 0.75rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Medical Encounters</a></li>
                                <li style="margin-bottom: 0.75rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">PharmaVigilance</a></li>
                                <li style="margin-bottom: 0.75rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Wellness Tracking</a></li>
                                <li style="margin-bottom: 0.75rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Video Consultations</a></li>
                                <li style="margin-bottom: 0.75rem;"><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">SOS Emergency</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 1rem;">Contact Us</h4>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="margin-bottom: 0.75rem; display: flex; align-items: start; gap: 0.5rem;">
                                    <i class="fas fa-map-marker-alt" style="color: #0ea5e9; margin-top: 0.25rem;"></i>
                                    <span style="color: #94a3b8; line-height: 1.6;">Radisson Blu Hotel, Ikeja, Lagos, Nigeria</span>
                                </li>
                                <li style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-phone" style="color: #0ea5e9;"></i>
                                    <a href="tel:+2348012345678" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">+234 801 234 5678</a>
                                </li>
                                <li style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-envelope" style="color: #0ea5e9;"></i>
                                    <a href="mailto:support@medicore.health" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">support@medicore.health</a>
                                </li>
                                <li style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-clock" style="color: #0ea5e9;"></i>
                                    <span style="color: #94a3b8;">24/7 Support Available</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                        <div style="color: #94a3b8; font-size: 0.9rem;">
                            © 2025 MediCore Health Platform. All rights reserved. Built for A.H.E.A.D Hackathon 2025.
                        </div>
                        <div style="display: flex; gap: 2rem;">
                            <a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Privacy Policy</a>
                            <a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Terms of Service</a>
                            <a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem; transition: color 0.3s;" onmouseover="this.style.color='#0ea5e9'" onmouseout="this.style.color='#94a3b8'">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
        
        // Render health profile tags
        setTimeout(() => renderHealthTags(), 100);
        
        // Load patient conditions
        setTimeout(async () => {
            const conditionsDiv = document.getElementById('patient-conditions');
            if (!conditionsDiv) return;
            try {
                const snapshot = await window.sosDatabase.ref(`health_profiles/${user.uid}`).once('value');
                const profile = snapshot.val();
                const conditions = profile?.conditions || [];
                if (conditions.length > 0) {
                    const tagMap = {};
                    healthProfileTags.forEach(t => tagMap[t.value] = t);
                    conditionsDiv.innerHTML = conditions.map(c => {
                        const tag = tagMap[c];
                        return tag ? `<span class="badge" style="background: ${tag.color}; color: #fff;">${tag.label}</span>` : '';
                    }).join('');
                } else {
                    conditionsDiv.innerHTML = '<p style="color: #94a3b8;">No conditions recorded</p>';
                }
            } catch (e) {
                conditionsDiv.innerHTML = '<p style="color: #94a3b8;">No conditions recorded</p>';
            }
        }, 200);
    } catch (error) {
        console.error('Error loading patient dashboard:', error);
        document.getElementById('home-content').innerHTML = '<p style="color: #ef4444; padding: 2rem;">Error loading dashboard</p>';
    }
}

function OldHomePage() {
    return `
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
        ${Footer()}
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
            setTimeout(loadHomePage, 100);
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
        case 'emergency':
            content = EmergencyPage();
            setTimeout(loadEmergencies, 100);
            break;
        case 'pharma':
            content = PharmaVigilancePage();
            setTimeout(loadPharmaAlerts, 100);
            break;
        case 'patient-detail':
            content = PatientDetailPage();
            setTimeout(() => { loadPatientDetail(); initGoogleFit(); }, 100);
            break;
        case 'settings':
            content = SettingsPage();
            setTimeout(loadSettings, 100);
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
                            <label class="form-label">Language / Langue / Lugha</label>
                            <select class="form-select" id="appt-language" onchange="updatePlaceholder('ai-appt-prompt', this.value, 'appointment'); toggleVoiceButton('appt-voice-btn', this.value)">
                                <option value="en">🇬🇧 English</option>
                                <option value="fr">🇫🇷 Français</option>
                                <option value="sw">🇰🇪 Kiswahili</option>
                                <option value="ar">🇪🇬 العربية (Arabic)</option>
                                <option value="am">🇪🇹 አማርኛ (Amharic)</option>
                                <option value="zu">🇿🇦 isiZulu (Zulu)</option>
                                <option value="af">🇿🇦 Afrikaans</option>
                                <option value="yo">🇳🇬 Yoruba (text only)</option>
                                <option value="ha">🇳🇬 Hausa (text only)</option>
                                <option value="ig">🇳🇬 Igbo (text only)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Describe the appointment in your language</label>
                            <div style="position: relative;">
                                <textarea class="form-textarea" id="ai-appt-prompt" name="prompt" required 
                                          placeholder="Example: Schedule appointment tomorrow at 3 PM for dental checkup"
                                          style="min-height: 150px; padding-right: 50px;"></textarea>
                                <button type="button" id="appt-voice-btn" onclick="startVoiceInput('ai-appt-prompt', 'appt-language')" style="position: absolute; right: 10px; top: 10px; background: #0ea5e9; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;">🎤</button>
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
                            <label class="form-label">Language / Langue / Lugha</label>
                            <select class="form-select" id="enc-language" onchange="updatePlaceholder('ai-enc-prompt', this.value, 'encounter'); toggleVoiceButton('enc-voice-btn', this.value)">
                                <option value="en">🇬🇧 English</option>
                                <option value="fr">🇫🇷 Français</option>
                                <option value="sw">🇰🇪 Kiswahili</option>
                                <option value="ar">🇪🇬 العربية (Arabic)</option>
                                <option value="am">🇪🇹 አማርኛ (Amharic)</option>
                                <option value="zu">🇿🇦 isiZulu (Zulu)</option>
                                <option value="af">🇿🇦 Afrikaans</option>
                                <option value="yo">🇳🇬 Yoruba (text only)</option>
                                <option value="ha">🇳🇬 Hausa (text only)</option>
                                <option value="ig">🇳🇬 Igbo (text only)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Describe the encounter in your language</label>
                            <div style="position: relative;">
                                <textarea class="form-textarea" id="ai-enc-prompt" name="prompt" required 
                                          placeholder="Example: Patient came with chest pain, BP 140/90, prescribed medication"
                                          style="min-height: 150px; padding-right: 50px;"></textarea>
                                <button type="button" id="enc-voice-btn" onclick="startVoiceInput('ai-enc-prompt', 'enc-language')" style="position: absolute; right: 10px; top: 10px; background: #0ea5e9; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;">🎤</button>
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
                            <label class="form-label">Language / Langue / Lugha</label>
                            <select class="form-select" id="patient-language" onchange="updatePlaceholder('ai-patient-prompt', this.value, 'patient'); toggleVoiceButton('patient-voice-btn', this.value)">
                                <option value="en">🇬🇧 English</option>
                                <option value="fr">🇫🇷 Français</option>
                                <option value="sw">🇰🇪 Kiswahili</option>
                                <option value="ar">🇪🇬 العربية (Arabic)</option>
                                <option value="am">🇪🇹 አማርኛ (Amharic)</option>
                                <option value="zu">🇿🇦 isiZulu (Zulu)</option>
                                <option value="af">🇿🇦 Afrikaans</option>
                                <option value="yo">🇳🇬 Yoruba (text only)</option>
                                <option value="ha">🇳🇬 Hausa (text only)</option>
                                <option value="ig">🇳🇬 Igbo (text only)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Describe the patient in your language</label>
                            <div style="position: relative;">
                                <textarea class="form-textarea" id="ai-patient-prompt" name="prompt" required 
                                          placeholder="Example: Create a patient named Sarah Johnson, female, 28 years old, allergic to shellfish, email: sarah@email.com, phone: +234-802-345-6789"
                                          style="min-height: 150px; padding-right: 50px;"></textarea>
                                <button type="button" id="patient-voice-btn" onclick="startVoiceInput('ai-patient-prompt', 'patient-language')" style="position: absolute; right: 10px; top: 10px; background: #0ea5e9; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;">🎤</button>
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
    const lang = document.getElementById('patient-language')?.value || 'en';
    let prompt = formData.get('prompt');
    
    try {
        if (lang !== 'en') {
            Swal.fire({ title: 'Translating...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            prompt = await translateText(prompt, lang, 'en');
            Swal.close();
        }
        
        const result = await apiCall('/ai/patient', 'POST', { prompt });
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
    const patientId = parseInt(formData.get('patient'));
    
    try {
        const result = await apiCall('/ai/emr', 'POST', {
            prompt: formData.get('prompt'),
            patient: patientId
        });
        closeModal();
        
        // Get patient name for notification
        const patients = await apiCall('/patients');
        const patient = patients.results?.find(p => p.id === patientId);
        const patientName = patient ? `${patient.first_name} ${patient.last_name}` : `Patient #${patientId}`;
        
        // Send push notification
        if (Notification.permission === 'granted' && typeof window.sendPushNotification === 'function') {
            await window.sendPushNotification({
                title: '✅ Encounter Created',
                body: `New medical encounter created for ${patientName}`,
                icon: 'logo.jpeg',
                tag: `encounter-${result.id || Date.now()}`
            });
        }
        
        // Show toast notification
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Encounter Created',
            text: `New encounter for ${patientName}`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        
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

window.translateText = async function(text, fromLang, toLang) {
    const langNames = { en: 'English', fr: 'French', sw: 'Swahili', ar: 'Arabic', am: 'Amharic', zu: 'Zulu', af: 'Afrikaans', yo: 'Yoruba', ha: 'Hausa', ig: 'Igbo' };
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Translate this from ${langNames[fromLang]} to ${langNames[toLang]}. Return ONLY the translation, no explanations:\n\n${text}` }] }]
            })
        });
        const result = await response.json();
        return result.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error('Translation error:', error);
        return text;
    }
}

window.toggleVoiceButton = function(btnId, lang) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    
    const noVoiceLangs = ['yo', 'ha', 'ig'];
    if (noVoiceLangs.includes(lang)) {
        btn.style.display = 'none';
    } else {
        btn.style.display = 'flex';
    }
}
let recognition;
let isListening = false;

window.updatePlaceholder = function(textareaId, lang, type) {
    const placeholders = {
        patient: {
            en: 'Example: Create a patient named Sarah Johnson, female, 28 years old, allergic to shellfish',
            fr: 'Exemple: Créer un patient nommé Sarah Johnson, femme, 28 ans, allergique aux fruits de mer',
            sw: 'Mfano: Unda mgonjwa anaitwa Sarah Johnson, mwanamke, miaka 28, ana mzio wa samaki wa baharini',
            ar: 'مثال: إنشاء مريض اسمه سارة جونسون، أنثى، 28 سنة، لديها حساسية من المحار',
            am: 'ምሳሌ: ሳራ ጆንሰን የተባለች ታካሚ ፍጠር፣ ሴት፣ 28 ዓመት፣ የባህር ምግብ አለርጂ አለባት',
            zu: 'Isibonelo: Dala isiguli esibizwa ngokuthi uSarah Johnson, owesifazane, oneminyaka engu-28, onezinambuzane zolwandle',
            af: 'Voorbeeld: Skep \n pasiënt genaamd Sarah Johnson, vroulik, 28 jaar oud, allergies vir skulpvis',
            yo: 'Apẹẹrẹ: Ṣẹda alaisan ti a npè ni Sarah Johnson, obinrin, ọmọ ọdún 28, ti o ni àìsan si ẹja okun',
            ha: 'Misali: Kirkiro majiyyaci mai suna Sarah Johnson, mace, shekara 28, mai rashin lafiya ga kifin teku',
            ig: 'Ihe atụ: Mepee onye ọrịa aha ya bụ Sarah Johnson, nwaanyị, afọ 28, nwere nfụọ azụ mmiri'
        },
        appointment: {
            en: 'Example: Schedule appointment tomorrow at 3 PM for dental checkup',
            fr: 'Exemple: Planifier un rendez-vous demain à 15h pour un contrôle dentaire',
            sw: 'Mfano: Panga miadi kesho saa 9 jioni kwa ukaguzi wa meno',
            ar: 'مثال: حدد موعدًا غدًا في الساعة 3 مساءً لفحص الأسنان',
            am: 'ምሳሌ: ነገ ከሰዓት 3 ላይ ለጥርስ ምርመራ ቀጠሮ ይያዙ',
            zu: 'Isibonelo: Hlela isikhathi kusasa ngo-3 PM sokuhlola amazinyo',
            af: 'Voorbeeld: Skeduleer afspraak môre om 3nm vir tandheelkundige ondersoek',
            yo: 'Apẹẹrẹ: Ṣeto ipade fun ọla ni ago mẹta irọlẹ fun ayewo eyin',
            ha: 'Misali: Shirya alƙawari gobe da ƙarfe 3 na yamma don binciken haƙori',
            ig: 'Ihe atụ: Hazie nhọpụta echi na elekere 3 nke ehihie maka nlele ezé'
        },
        encounter: {
            en: 'Example: Patient came with chest pain, BP 140/90, prescribed medication',
            fr: 'Exemple: Le patient est venu avec des douleurs thoraciques, TA 140/90, médicament prescrit',
            sw: 'Mfano: Mgonjwa alikuja na maumivu ya kifua, BP 140/90, dawa iliyoandikwa',
            ar: 'مثال: جاء المريض بألم في الصدر، ضغط الدم 140/90، وصف الدواء',
            am: 'ምሳሌ: ታካሚው የደረት ህመም ይዞ መጣ፣ BP 140/90፣ መድሃኒት ተመርቷል',
            zu: 'Isibonelo: Isiguli sifike sinezinhlungu zesifuba, BP 140/90, kunikezwe imithi',
            af: 'Voorbeeld: Pasiënt het gekom met borspyn, BP 140/90, medikasie voorgeskryf',
            yo: 'Apẹẹrẹ: Alaisan wa pẹlu irora àyà, BP 140/90, oogun ti a fun',
            ha: 'Misali: Majiyyaci ya zo da ciwon ƙirji, BP 140/90, an rubuta magani',
            ig: 'Ihe atụ: Onye ọrịa bịara na mgbu obi, BP 140/90, nyere ọgwụ'
        }
    };
    document.getElementById(textareaId).placeholder = placeholders[type][lang] || placeholders[type]['en'];
}

window.startVoiceInput = function(textareaId, langSelectId) {
    console.log('🎤 startVoiceInput called', { textareaId, langSelectId });
    const btn = event.target;
    
    const lang = langSelectId ? document.getElementById(langSelectId)?.value || 'en' : 'en';
    console.log('Selected language:', lang);
    
    const langMap = { en: 'en-US', fr: 'fr-FR', sw: 'sw-KE', ar: 'ar-EG', am: 'am-ET', zu: 'zu-ZA', af: 'af-ZA' };
    
    if (isListening) {
        console.log('⏸️ Stopping recognition');
        recognition.stop();
        isListening = false;
        btn.innerHTML = '🎤';
        btn.style.background = '#0ea5e9';
        return;
    }
    
    if (!('webkitSpeechRecognition' in window)) {
        console.error('❌ Speech recognition not supported');
        Swal.fire('Error', 'Speech recognition not supported. Please use Chrome or Edge.', 'error');
        return;
    }
    
    console.log('✅ Creating recognition instance');
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = langMap[lang] || 'en-US';
    console.log('Recognition language set to:', recognition.lang);
    
    let finalTranscript = document.getElementById(textareaId).value;
    
    recognition.onstart = () => {
        console.log('🎙️ Recognition started');
        isListening = true;
        btn.innerHTML = '⏸️';
        btn.style.background = '#ef4444';
    };
    
    recognition.onresult = (event) => {
        console.log('📝 Recognition result received');
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        document.getElementById(textareaId).value = finalTranscript + interimTranscript;
    };
    
    recognition.onend = () => {
        console.log('🛑 Recognition ended');
        isListening = false;
        btn.innerHTML = '🎤';
        btn.style.background = '#0ea5e9';
    };
    
    recognition.onerror = (event) => {
        console.error('❌ Recognition error:', event.error);
        isListening = false;
        btn.innerHTML = '🎤';
        btn.style.background = '#0ea5e9';
        
        const errorMessages = {
            'network': 'Network error. Check your internet connection.',
            'not-allowed': 'Microphone access denied. Please allow microphone access.',
            'no-speech': 'No speech detected. Please try again.',
            'aborted': 'Speech recognition aborted.'
        };
        
        Swal.fire('Error', errorMessages[event.error] || `Speech recognition failed: ${event.error}`, 'error');
    };
    
    console.log('🚀 Starting recognition...');
    try {
        recognition.start();
        console.log('✅ Recognition started');
    } catch (error) {
        console.error('❌ Error starting recognition:', error);
        Swal.fire('Error', `Failed to start: ${error.message}`, 'error');
    }
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
    const widget = document.getElementById('health-fact-widget');
    if (!widget) return;
    
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

// Removed - using consent-modal.js instead

// Send test notification on page load
window.sendTestNotification = async function() {
    if (Notification.permission !== 'granted') return;
    
    try {
        const notification = new Notification('MediCore Health Platform', {
            body: 'System ready. All services are operational.',
            icon: 'logo.jpeg',
            badge: 'logo.jpeg',
            requireInteraction: true,
            silent: false,
            vibrate: [200, 100, 200]
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    } catch (e) {
        console.error('Notification error:', e);
    }
    
    if (typeof window.sendPushNotification === 'function') {
        await window.sendPushNotification({
            title: 'MediCore Health Platform',
            body: 'System ready. All services are operational.',
            icon: 'logo.jpeg',
            tag: 'system-test',
            requireInteraction: true
        });
    }
}

// Health Profile Functions
const healthProfileTags = [
    {label: '<i class="fas fa-baby-carriage"></i> Pregnant', value: 'pregnant', color: '#ec4899'},
    {label: '<i class="fas fa-baby"></i> Breastfeeding', value: 'breastfeeding', color: '#f472b6'},
    {label: '<i class="fas fa-user-clock"></i> Elderly (65+)', value: 'elderly', color: '#a78bfa'},
    {label: '<i class="fas fa-child"></i> Pediatric', value: 'pediatric', color: '#60a5fa'},
    {label: '<i class="fas fa-deaf"></i> Deaf/Hard of Hearing', value: 'deaf', color: '#fbbf24'},
    {label: '<i class="fas fa-eye-slash"></i> Blind/Low Vision', value: 'blind', color: '#fb923c'},
    {label: '<i class="fas fa-wheelchair"></i> Mobility Impaired', value: 'mobility', color: '#34d399'},
    {label: '<i class="fas fa-brain"></i> Cognitive Disability', value: 'cognitive', color: '#a3e635'},
    {label: '<i class="fas fa-syringe"></i> Diabetic Type 1', value: 'diabetic_t1', color: '#ef4444'},
    {label: '<i class="fas fa-syringe"></i> Diabetic Type 2', value: 'diabetic_t2', color: '#dc2626'},
    {label: '<i class="fas fa-heartbeat"></i> Heart Disease', value: 'heart', color: '#dc2626'},
    {label: '<i class="fas fa-lungs"></i> Asthma', value: 'asthma', color: '#06b6d4'},
    {label: '<i class="fas fa-lungs"></i> COPD', value: 'copd', color: '#0891b2'},
    {label: '<i class="fas fa-tint"></i> Hypertension', value: 'hypertension', color: '#f43f5e'},
    {label: '<i class="fas fa-procedures"></i> Chronic Pain', value: 'chronic_pain', color: '#8b5cf6'},
    {label: '<i class="fas fa-shield-virus"></i> Immunocompromised', value: 'immunocompromised', color: '#6366f1'},
    {label: '<i class="fas fa-running"></i> Athlete', value: 'athlete', color: '#10b981'},
    {label: '<i class="fas fa-allergies"></i> Food Allergies', value: 'food_allergies', color: '#f59e0b'},
    {label: '<i class="fas fa-pills"></i> Drug Allergies', value: 'drug_allergies', color: '#ea580c'},
    {label: '<i class="fas fa-dna"></i> Cancer Survivor', value: 'cancer_survivor', color: '#a855f7'},
    {label: '<i class="fas fa-dna"></i> Cancer Patient', value: 'cancer_patient', color: '#9333ea'},
    {label: '<i class="fas fa-kidneys"></i> Kidney Disease', value: 'kidney', color: '#f97316'},
    {label: '<i class="fas fa-liver"></i> Liver Disease', value: 'liver', color: '#fb923c'},
    {label: '<i class="fas fa-brain"></i> Epilepsy', value: 'epilepsy', color: '#8b5cf6'},
    {label: '<i class="fas fa-brain"></i> Alzheimer\'s', value: 'alzheimers', color: '#7c3aed'},
    {label: '<i class="fas fa-brain"></i> Parkinson\'s', value: 'parkinsons', color: '#6d28d9'},
    {label: '<i class="fas fa-brain"></i> Stroke History', value: 'stroke', color: '#5b21b6'},
    {label: '<i class="fas fa-bone"></i> Osteoporosis', value: 'osteoporosis', color: '#94a3b8'},
    {label: '<i class="fas fa-bone"></i> Arthritis', value: 'arthritis', color: '#64748b'},
    {label: '<i class="fas fa-weight"></i> Obesity', value: 'obesity', color: '#f59e0b'},
    {label: '<i class="fas fa-weight"></i> Underweight', value: 'underweight', color: '#fbbf24'},
    {label: '<i class="fas fa-head-side-virus"></i> Mental Health', value: 'mental_health', color: '#8b5cf6'},
    {label: '<i class="fas fa-sad-tear"></i> Depression', value: 'depression', color: '#6366f1'},
    {label: '<i class="fas fa-exclamation-triangle"></i> Anxiety', value: 'anxiety', color: '#3b82f6'},
    {label: '<i class="fas fa-pills"></i> Substance Abuse', value: 'substance_abuse', color: '#ef4444'},
    {label: '<i class="fas fa-smoking"></i> Smoker', value: 'smoker', color: '#78716c'},
    {label: '<i class="fas fa-wine-glass"></i> Alcohol Use', value: 'alcohol', color: '#a16207'},
    {label: '<i class="fas fa-virus"></i> HIV/AIDS', value: 'hiv', color: '#dc2626'},
    {label: '<i class="fas fa-virus"></i> Hepatitis', value: 'hepatitis', color: '#ea580c'},
    {label: '<i class="fas fa-lungs-virus"></i> Tuberculosis', value: 'tuberculosis', color: '#f97316'},
    {label: '<i class="fas fa-disease"></i> Autoimmune Disease', value: 'autoimmune', color: '#ec4899'},
    {label: '<i class="fas fa-thermometer-full"></i> Thyroid Disorder', value: 'thyroid', color: '#06b6d4'},
    {label: '<i class="fas fa-bed"></i> Sleep Apnea', value: 'sleep_apnea', color: '#6366f1'},
    {label: '<i class="fas fa-stomach"></i> IBS/IBD', value: 'ibs', color: '#f59e0b'},
    {label: '<i class="fas fa-stomach"></i> Celiac Disease', value: 'celiac', color: '#eab308'},
    {label: '<i class="fas fa-hand-holding-medical"></i> Organ Transplant', value: 'transplant', color: '#10b981'},
    {label: '<i class="fas fa-heartbeat"></i> Pacemaker', value: 'pacemaker', color: '#ef4444'},
    {label: '<i class="fas fa-vial"></i> Blood Disorder', value: 'blood_disorder', color: '#dc2626'},
    {label: '<i class="fas fa-vial"></i> Anemia', value: 'anemia', color: '#f87171'},
    {label: '<i class="fas fa-hand-sparkles"></i> Skin Condition', value: 'skin_condition', color: '#fb923c'}
];

window.renderHealthTags = function(filter = '') {
    const container = document.getElementById('health-profile-tags');
    if (!container) return;
    
    const saved = JSON.parse(localStorage.getItem('health_profile') || '[]');
    const filtered = filter ? healthProfileTags.filter(tag => 
        tag.label.toLowerCase().includes(filter.toLowerCase()) || 
        tag.value.toLowerCase().includes(filter.toLowerCase())
    ) : healthProfileTags;
    
    container.innerHTML = '';
    filtered.forEach(tag => {
        const isSelected = saved.includes(tag.value);
        const btn = document.createElement('button');
        btn.id = `tag-${tag.value}`;
        btn.innerHTML = tag.label;
        btn.onclick = () => toggleHealthTag(tag.value);
        btn.style.cssText = `padding: 0.5rem 1rem; border-radius: 20px; border: 2px solid ${tag.color}; background: ${isSelected ? tag.color : 'transparent'}; color: ${isSelected ? '#fff' : tag.color}; cursor: pointer; font-size: 0.85rem; transition: all 0.3s; font-weight: 500;`;
        btn.onmouseover = () => { if(btn.style.background === 'transparent' || !btn.style.background) btn.style.background = tag.color + '20'; };
        btn.onmouseout = () => { if(btn.style.background === tag.color + '20') btn.style.background = 'transparent'; };
        container.appendChild(btn);
    });
}

window.filterHealthTags = function(query) {
    renderHealthTags(query);
}

window.toggleHealthTag = function(value) {
    const saved = JSON.parse(localStorage.getItem('health_profile') || '[]');
    const btn = document.getElementById(`tag-${value}`);
    const color = btn.style.borderColor;
    
    if (saved.includes(value)) {
        const index = saved.indexOf(value);
        saved.splice(index, 1);
        btn.style.background = 'transparent';
        btn.style.color = color;
    } else {
        saved.push(value);
        btn.style.background = color;
        btn.style.color = '#fff';
    }
    
    localStorage.setItem('health_profile', JSON.stringify(saved));
}

window.saveHealthProfile = async function() {
    const saved = JSON.parse(localStorage.getItem('health_profile') || '[]');
    if (saved.length === 0) {
        Swal.fire('Info', 'Please select at least one health profile category', 'info');
        return;
    }
    
    const user = firebase.app('sos-emergency').auth().currentUser;
    if (user) {
        await window.sosDatabase.ref(`health_profiles/${user.uid}`).set({ 
            conditions: saved, 
            email: user.email,
            updated: Date.now() 
        });
    }
    
    Swal.fire('Success!', `Health profile saved with ${saved.length} categories`, 'success');
}

// Role switching function
window.switchRole = function() {
    const currentRole = localStorage.getItem('user_role');
    const newRole = currentRole === 'doctor' ? 'patient' : 'doctor';
    
    Swal.fire({
        title: 'Switch Role?',
        text: `Switch from ${currentRole} to ${newRole}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Switch',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem('user_role', newRole);
            Swal.fire('Switched!', `You are now logged in as ${newRole}`, 'success');
            navigate(newRole === 'doctor' ? 'dashboard' : 'home');
        }
    });
}

// Patient messaging functions
window.sendPatientMessage = function() {
    const input = document.getElementById('patient-message-input');
    const message = input.value.trim();
    if (!message) return;
    
    const userEmail = firebase.auth().currentUser?.email;
    const messagesDiv = document.getElementById('patient-chat-messages');
    
    const messageEl = document.createElement('div');
    messageEl.style.cssText = 'background: linear-gradient(135deg, #0ea5e9, #3b82f6); padding: 0.75rem 1rem; border-radius: 12px; margin-bottom: 0.5rem; max-width: 80%; margin-left: auto;';
    messageEl.innerHTML = `
        <div style="color: #fff; font-size: 0.9rem;">${message}</div>
        <div style="color: rgba(255,255,255,0.7); font-size: 0.7rem; margin-top: 0.25rem;">${new Date().toLocaleTimeString()}</div>
    `;
    
    if (messagesDiv.querySelector('p')) {
        messagesDiv.innerHTML = '';
    }
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    // Save to Firebase
    if (userEmail) {
        firebase.database().ref('patient_messages').push({
            email: userEmail,
            message: message,
            timestamp: Date.now(),
            sender: 'patient'
        });
    }
    
    input.value = '';
}

// Initialize
console.log('🚀 App.js loaded, initializing...');
const sosAuth = firebase.app('sos-emergency').auth();
sosAuth.onAuthStateChanged((user) => {
    console.log('🔐 Auth state changed:', user?.email);
    
    if (user) {
        const userRole = localStorage.getItem('user_role');
        if (userRole === 'doctor' && currentPage === 'home') {
            currentPage = 'dashboard';
        }
    }
    
    render();
    if (user && currentPage === 'home') {
        setTimeout(loadHomePage, 200);
    }
});

// Send test notification after everything is ready
setTimeout(() => sendTestNotification(), 5000);

window.addEventListener('message', (event) => {
    if (event.data.event === 'DrugInteraction') {
        handleWebhookEvent(event.data);
    }
});

// Start health facts widget
setTimeout(() => window.showHealthFact?.(), 5000);
setInterval(() => window.showHealthFact?.(), 32000);
