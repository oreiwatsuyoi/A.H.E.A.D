// Extended page components for MediCore

function PatientsPage() {
    return `
        ${Sidebar()}
        <main class="main-content">
            <div class="data-section">
                <div class="section-header">
                    <h2>Patient Management</h2>
                    <div class="search-bar">
                        <input type="text" class="search-input" placeholder="Search patients..." 
                               oninput="searchPatients(this.value)">
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-secondary" onclick="showImportExportModal('patients')">
                                ${icons.arrow} Import/Export
                            </button>
                            <button class="btn btn-primary" onclick="showModal('createPatient')">
                                ${icons.plus} Add Patient
                            </button>
                        </div>
                    </div>
                </div>
                <div style="background: rgba(14, 165, 233, 0.1); padding: 1rem; border-radius: 8px; border-left: 3px solid #0ea5e9; margin-bottom: 1rem;">
                    <p style="margin: 0; color: #0ea5e9; font-size: 0.9rem;"><i class="fas fa-info-circle"></i> <strong>Tip:</strong> Click on a patient's name to view their complete medical details, appointments, medications, and lab tests.</p>
                </div>
                <div id="patients-list">
                    <div class="loading"><div class="spinner"></div><p>Loading patients...</p></div>
                </div>
            </div>
        </main>
        ${Footer()}
    `;
}

async function loadPatients(search = '') {
    try {
        const cached = !search && typeof loadCachedData === 'function' ? loadCachedData('patients') : null;
        if (cached && navigator.onLine === false) {
            renderPatientsTable(cached.results);
            return;
        }
        const params = search ? `?search=${encodeURIComponent(search)}` : '';
        const data = await apiCall(`/patients${params}`);
        const patients = data.results || [];
        if (!search && typeof savePatientsCache === 'function') savePatientsCache(patients);
        
        renderPatientsTable(patients);
    } catch (error) {
        const cached = typeof loadCachedData === 'function' ? loadCachedData('patients') : null;
        if (cached) {
            renderPatientsTable(cached.results);
            Swal.fire('Offline Mode', 'Showing cached data', 'info');
        } else {
            document.getElementById('patients-list').innerHTML = '<p style="color: #ef4444;">Error loading patients</p>';
        }
    }
}

function renderPatientsTable(patients) {
    document.getElementById('patients-list').innerHTML = patients.length > 0 ? `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>DOB</th>
                        <th>Gender</th>
                        <th>Allergies</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${patients.map(p => `
                        <tr>
                            <td>#${p.id}</td>
                            <td onclick="navigate('patient-detail', {id: ${p.id}})" style="cursor: pointer;"><strong>${p.first_name} ${p.last_name}</strong></td>
                            <td>${p.email || 'N/A'}</td>
                            <td>${p.phone_number || 'N/A'}</td>
                            <td>${p.date_of_birth || 'N/A'}</td>
                            <td><span class="badge badge-info">${p.gender}</span></td>
                            <td>${p.allergies?.length > 0 ? p.allergies.join(', ') : 'None'}</td>
                            <td><button class="btn btn-secondary" onclick="event.stopPropagation(); updatePatient(${p.id})" style="padding: 0.4rem 0.8rem; margin-right: 0.5rem;">Edit</button><button class="btn" onclick="event.stopPropagation(); deletePatient(${p.id})" style="padding: 0.4rem 0.8rem; background: #ef4444; color: white;">Delete</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : `
            <div class="empty-state">
                <div class="empty-icon">${icons.patients}</div>
                <h3>No patients found</h3>
                <p>Start by adding your first patient or adjust your search</p>
                <button class="btn btn-primary" onclick="showModal('createPatient')" style="margin-top: 1rem;">
                    ${icons.plus} Add Patient
                </button>
            </div>
        `;
}

let searchTimeout;
function searchPatients(value) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => loadPatients(value), 300);
}

function viewPatientDetails(id) {
    Swal.fire('Patient Details', `Viewing patient #${id}`, 'info');
}

async function viewEncounterDetails(id) {
    try {
        const encounter = await apiCall(`/encounters/${id}`);
        const meds = encounter.encounter_medications || [];
        const tests = encounter.encounter_tests || [];
        const interactions = encounter.drug_interactions || [];
        
        Swal.fire({
            title: `Encounter #${id}`,
            html: `
                <div style="text-align: left; max-height: 500px; overflow-y: auto;">
                    <h4 style="color: #0ea5e9; margin-top: 0;">Patient Information</h4>
                    <p><strong>Patient:</strong> ${encounter.patient_name || `#${encounter.patient}`}</p>
                    <p><strong>Date:</strong> ${new Date(encounter.created_at).toLocaleString()}</p>
                    
                    <h4 style="color: #0ea5e9; margin-top: 1.5rem;">Vitals</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                        ${encounter.weight ? `<p><strong>Weight:</strong> ${encounter.weight} kg</p>` : ''}
                        ${encounter.height ? `<p><strong>Height:</strong> ${encounter.height} cm</p>` : ''}
                        ${encounter.bmi ? `<p><strong>BMI:</strong> ${encounter.bmi}</p>` : ''}
                        ${encounter.blood_pressure ? `<p><strong>BP:</strong> ${encounter.blood_pressure}</p>` : ''}
                        ${encounter.heart_rate ? `<p><strong>Heart Rate:</strong> ${encounter.heart_rate} bpm</p>` : ''}
                        ${encounter.temperature ? `<p><strong>Temperature:</strong> ${encounter.temperature}°C</p>` : ''}
                    </div>
                    
                    ${encounter.symptoms ? `<h4 style="color: #0ea5e9; margin-top: 1.5rem;">Symptoms</h4><p>${encounter.symptoms}</p>` : ''}
                    ${encounter.diagnosis ? `<h4 style="color: #0ea5e9; margin-top: 1.5rem;">Diagnosis</h4><p>${encounter.diagnosis}</p>` : ''}
                    ${encounter.consultation_reason ? `<h4 style="color: #0ea5e9; margin-top: 1.5rem;">Consultation Reason</h4><p>${encounter.consultation_reason}</p>` : ''}
                    ${encounter.medical_history ? `<h4 style="color: #0ea5e9; margin-top: 1.5rem;">Medical History</h4><p>${encounter.medical_history}</p>` : ''}
                    ${encounter.note ? `<h4 style="color: #0ea5e9; margin-top: 1.5rem;">Clinical Notes</h4><p>${encounter.note}</p>` : ''}
                    ${encounter.summary ? `<h4 style="color: #0ea5e9; margin-top: 1.5rem;">Summary</h4><p>${encounter.summary}</p>` : ''}
                    ${encounter.follow_up ? `<h4 style="color: #0ea5e9; margin-top: 1.5rem;">Follow-up</h4><p>${encounter.follow_up}</p>` : ''}
                    
                    ${interactions.length > 0 ? `
                        <h4 style="color: #ef4444; margin-top: 1.5rem; display: flex; align-items: center; gap: 0.5rem;"><i class="fas fa-exclamation-triangle"></i> Drug Interactions Detected</h4>
                        <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                            ${interactions.map(int => `
                                <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #fecaca;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                        <strong style="color: #991b1b;">${int.drug1} + ${int.drug2}</strong>
                                        <span style="padding: 0.25rem 0.75rem; background: ${
                                            int.severity === 'Major' ? '#dc2626' : 
                                            int.severity === 'Moderate' ? '#d97706' : 
                                            int.severity === 'Minor' ? '#2563eb' : '#6b7280'
                                        }; color: white; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">${int.severity || 'Unknown'}</span>
                                    </div>
                                    <p style="color: #7f1d1d; font-size: 0.9rem; margin: 0;">${int.description || 'Drug interaction detected. Please review medication combination.'}</p>
                                    ${int.clinical_effects ? `<p style="color: #991b1b; font-size: 0.85rem; margin-top: 0.5rem;"><strong>Clinical Effects:</strong> ${int.clinical_effects}</p>` : ''}
                                    ${int.management ? `<p style="color: #991b1b; font-size: 0.85rem; margin-top: 0.5rem;"><strong>Management:</strong> ${int.management}</p>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${meds.length > 0 ? `
                        <h4 style="color: #0ea5e9; margin-top: 1.5rem;">Medications</h4>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead><tr style="background: #f1f5f9;"><th style="padding: 0.5rem; text-align: left;">Name</th><th style="padding: 0.5rem; text-align: left;">Dosage</th><th style="padding: 0.5rem; text-align: left;">Frequency</th></tr></thead>
                            <tbody>
                                ${meds.map(m => `<tr><td style="padding: 0.5rem;">${m.name}</td><td style="padding: 0.5rem;">${m.dosage || 'N/A'}</td><td style="padding: 0.5rem;">${m.frequency || 'N/A'}</td></tr>`).join('')}
                            </tbody>
                        </table>
                    ` : ''}
                    
                    ${tests.length > 0 ? `
                        <h4 style="color: #0ea5e9; margin-top: 1.5rem;">Lab Tests</h4>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead><tr style="background: #f1f5f9;"><th style="padding: 0.5rem; text-align: left;">Test</th><th style="padding: 0.5rem; text-align: left;">Result</th></tr></thead>
                            <tbody>
                                ${tests.map(t => `<tr><td style="padding: 0.5rem;">${t.name}</td><td style="padding: 0.5rem;">${t.result || 'Pending'}</td></tr>`).join('')}
                            </tbody>
                        </table>
                    ` : ''}
                </div>
            `,
            width: '800px',
            confirmButtonText: 'Close'
        });
    } catch (error) {
        Swal.fire('Error', 'Failed to load encounter details', 'error');
    }
}

function AppointmentsPage() {
    return `
        ${Sidebar()}
        <main class="main-content">
            <div class="data-section" style="margin-bottom: 2rem;">
                <div class="section-header">
                    <h2>Appointment Calendar</h2>
                    <button class="btn btn-secondary" onclick="showImportExportModal('appointments')">
                        ${icons.arrow} Import/Export
                    </button>
                </div>
                <div id="appointments-calendar">
                    <div class="loading"><div class="spinner"></div></div>
                </div>
            </div>
            
            <div class="data-section">
                <div class="section-header">
                    <h2>Appointments</h2>
                    <button class="btn btn-primary" onclick="showModal('createAppointment')">
                        ${icons.plus} Schedule Appointment
                    </button>
                </div>
                <div id="appointments-list">
                    <div class="loading"><div class="spinner"></div><p>Loading appointments...</p></div>
                </div>
            </div>
        </main>
        ${Footer()}
    `;
}

async function loadAppointments() {
    try {
        const cached = typeof loadCachedData === 'function' ? loadCachedData('appointments') : null;
        if (cached && navigator.onLine === false) {
            renderAppointmentsData(cached.results);
            return;
        }
        const data = await apiCall('/appointments');
        const appointments = data.results || [];
        if (typeof saveAppointmentsCache === 'function') saveAppointmentsCache(appointments);
        renderAppointmentsData(appointments);
    } catch (error) {
        const cached = typeof loadCachedData === 'function' ? loadCachedData('appointments') : null;
        if (cached) {
            renderAppointmentsData(cached.results);
            Swal.fire('Offline Mode', 'Showing cached data', 'info');
        } else {
            document.getElementById('appointments-list').innerHTML = '<p style="color: #ef4444;">Error loading appointments</p>';
        }
    }
}

function renderAppointmentsData(appointments) {
        
        const appointmentsByDate = {};
        appointments.forEach(a => {
            const date = new Date(a.date).toLocaleDateString();
            const time = new Date(a.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            if (!appointmentsByDate[date]) appointmentsByDate[date] = [];
            appointmentsByDate[date].push({...a, time});
        });
        
        const sortedDates = Object.keys(appointmentsByDate).sort((a, b) => new Date(a) - new Date(b));
        
        document.getElementById('appointments-calendar').innerHTML = sortedDates.length > 0 ? `
            <div style="display: grid; gap: 1rem;">
                ${sortedDates.map(date => `
                    <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1)); border-radius: 12px; padding: 1.5rem; border-left: 4px solid #10b981;">
                        <div style="font-weight: 700; color: #10b981; font-size: 1.1rem; margin-bottom: 1rem;"><i class="fas fa-calendar-day"></i> ${date}</div>
                        <div style="display: grid; gap: 0.75rem;">
                            ${appointmentsByDate[date].map(a => `
                                <div style="background: rgba(30, 41, 59, 0.4); padding: 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <div style="font-weight: 600; color: #3b82f6; margin-bottom: 0.25rem;"><i class="fas fa-clock"></i> ${a.time}</div>
                                        <div style="color: #94a3b8; font-size: 0.9rem;">${a.patient_name || `Patient #${a.patient}`} - ${a.reason || 'General Checkup'}</div>
                                    </div>
                                    <span class="badge ${a.status === 'active' ? 'badge-success' : 'badge-warning'}">${a.status}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : '<p style="padding: 2rem; text-align: center; color: #6b7280;">No upcoming appointments</p>';
        
        document.getElementById('appointments-list').innerHTML = appointments.length > 0 ? `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Patient</th>
                        <th>Date & Time</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Summary</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${appointments.map(a => `
                        <tr>
                            <td>#${a.id}</td>
                            <td><strong>${a.patient_name || `#${a.patient}`}</strong></td>
                            <td>${new Date(a.date).toLocaleString()}</td>
                            <td>${a.reason || 'N/A'}</td>
                            <td><span class="badge ${a.status === 'active' ? 'badge-success' : 'badge-warning'}">${a.status}</span></td>
                            <td>${a.summary || 'N/A'}</td>
                            <td><button class="btn btn-secondary" onclick="updateAppointment(${a.id})" style="padding: 0.4rem 0.8rem; margin-right: 0.5rem;">Edit</button><button class="btn" onclick="deleteAppointment(${a.id})" style="padding: 0.4rem 0.8rem; background: #ef4444; color: white;">Delete</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : `
            <div class="empty-state">
                <div class="empty-icon">${icons.appointments}</div>
                <h3>No appointments scheduled</h3>
                <p>Schedule your first appointment to get started</p>
                <button class="btn btn-primary" onclick="showModal('createAppointment')" style="margin-top: 1rem;">
                    ${icons.plus} Schedule Appointment
                </button>
            </div>
        `;
}

function EncountersPage() {
    return `
        ${Sidebar()}
        <main class="main-content">
            <div class="data-section">
                <div class="section-header">
                    <h2>Medical Encounters</h2>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" onclick="showImportExportModal('encounters')">
                            ${icons.arrow} Import/Export
                        </button>
                        <button class="btn btn-primary" onclick="showModal('createEncounter')">
                            ${icons.plus} New Encounter
                        </button>
                    </div>
                </div>
                <div id="encounters-list">
                    <div class="loading"><div class="spinner"></div><p>Loading encounters...</p></div>
                </div>
            </div>
        </main>
        ${Footer()}
    `;
}

async function loadEncounters() {
    try {
        const cached = typeof loadCachedData === 'function' ? loadCachedData('encounters') : null;
        if (cached && navigator.onLine === false) {
            renderEncountersData(cached.results);
            return;
        }
        const data = await apiCall('/encounters');
        const encounters = data.results || [];
        if (typeof saveEncountersCache === 'function') saveEncountersCache(encounters);
        renderEncountersData(encounters);
    } catch (error) {
        const cached = typeof loadCachedData === 'function' ? loadCachedData('encounters') : null;
        if (cached) {
            renderEncountersData(cached.results);
            Swal.fire('Offline Mode', 'Showing cached data', 'info');
        } else {
            document.getElementById('encounters-list').innerHTML = '<p style="color: #ef4444;">Error loading encounters</p>';
        }
    }
}

function renderEncountersData(encounters) {
        
        document.getElementById('encounters-list').innerHTML = encounters.length > 0 ? `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Patient</th>
                        <th>Date</th>
                        <th>Vitals</th>
                        <th>Diagnosis</th>
                        <th>Interactions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${encounters.map(e => `
                        <tr>
                            <td>#${e.id}</td>
                            <td><strong>${e.patient_name || `#${e.patient}`}</strong></td>
                            <td>${new Date(e.created_at).toLocaleDateString()}</td>
                            <td style="font-size: 0.85rem;">
                                ${e.blood_pressure ? `BP: ${e.blood_pressure}<br>` : ''}
                                ${e.temperature ? `Temp: ${e.temperature}°C<br>` : ''}
                                ${e.heart_rate ? `HR: ${e.heart_rate} bpm` : ''}
                            </td>
                            <td>${e.diagnosis || 'N/A'}</td>
                            <td>${e.drug_interactions && e.drug_interactions.length > 0 ? `<span class="badge" style="background: #ef4444; color: white;"><i class="fas fa-exclamation-triangle"></i> ${e.drug_interactions.length}</span>` : '<span style="color: #10b981;"><i class="fas fa-check"></i> None</span>'}</td>
                            <td><button class="btn btn-secondary" onclick="viewEncounterDetails(${e.id})" style="padding: 0.5rem 1rem;">View Details</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : `
            <div class="empty-state">
                <div class="empty-icon">${icons.encounters}</div>
                <h3>No encounters recorded</h3>
                <p>Create your first medical encounter</p>
                <button class="btn btn-primary" onclick="showModal('createEncounter')" style="margin-top: 1rem;">
                    ${icons.plus} New Encounter
                </button>
            </div>
        `;
}

function EmergencyPage() {
    return `
        ${Sidebar()}
        <main class="main-content">
            <div class="section-header">
                <h2><i class="fas fa-ambulance"></i> Emergency Response Center</h2>
                <button class="btn btn-secondary" onclick="loadEmergencies()">
                    ${icons.search} Refresh
                </button>
            </div>
            
            <div id="emergency-alerts" style="margin-bottom: 2rem;">
                <div class="loading"><div class="spinner"></div></div>
            </div>
        </main>
        ${Footer()}
    `;
}

async function loadEmergencies() {
    try {
        const emergenciesRef = window.sosDatabase.ref('emergencies').orderByChild('timestamp').limitToLast(20);
        const snapshot = await emergenciesRef.once('value');
        const emergencies = [];
        
        snapshot.forEach((child) => {
            emergencies.push({ id: child.key, ...child.val() });
        });
        
        emergencies.reverse();
        const activeEmergencies = emergencies.filter(e => e.status === 'ACTIVE');
        const pastEmergencies = emergencies.filter(e => e.status !== 'ACTIVE');
        
        document.getElementById('emergency-alerts').innerHTML = `
            ${activeEmergencies.length > 0 ? `
                <div class="data-section" style="background: linear-gradient(135deg, rgba(239,68,68,0.1), rgba(220,38,38,0.05)); border-left: 4px solid #dc2626; margin-bottom: 2rem;">
                    <div class="section-header">
                        <h3 style="color: #dc2626;"><i class="fas fa-ambulance"></i> Active Emergencies (${activeEmergencies.length})</h3>
                    </div>
                    <div style="display: grid; gap: 1rem; padding: 1rem;">
                        ${activeEmergencies.map(e => `
                            <div style="background: white; border-radius: 12px; padding: 1.5rem; border-left: 4px solid #dc2626; cursor: pointer;" onclick="viewEmergencyDetails('${e.id}')">
                                <div style="display: flex; justify-content: between; align-items: start; gap: 1rem;">
                                    <div style="flex: 1;">
                                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                                            <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #ef4444, #dc2626); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;"><i class="fas fa-exclamation-triangle"></i></div>
                                            <div>
                                                <h4 style="margin: 0; color: #1f2937; font-size: 1.1rem;">${e.patient.name}</h4>
                                                <p style="margin: 0; color: #6b7280; font-size: 0.9rem;">${e.patient.age} years • ${e.patient.gender}</p>
                                            </div>
                                        </div>
                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                                            <div>
                                                <p style="margin: 0; color: #6b7280; font-size: 0.85rem;"><i class="fas fa-map-marker-alt"></i> Location</p>
                                                <p style="margin: 0; color: #1f2937; font-weight: 500; font-size: 0.9rem;">${e.location.address}</p>
                                            </div>
                                            <div>
                                                <p style="margin: 0; color: #6b7280; font-size: 0.85rem;"><i class="fas fa-phone"></i> Contact</p>
                                                <p style="margin: 0; color: #1f2937; font-weight: 500; font-size: 0.9rem;">${e.patient.phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                        ${e.patient.allergies?.length > 0 ? `
                                            <div style="margin-bottom: 1rem;">
                                                <p style="margin: 0 0 0.5rem 0; color: #dc2626; font-size: 0.85rem; font-weight: 600;"><i class="fas fa-exclamation-circle"></i> Allergies:</p>
                                                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                                    ${e.patient.allergies.map(a => `<span style="background: #fee2e2; color: #dc2626; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">${a}</span>`).join('')}
                                                </div>
                                            </div>
                                        ` : ''}
                                        <div style="background: #f9fafb; padding: 1rem; border-radius: 8px;">
                                            <p style="margin: 0; color: #6b7280; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem;"><i class="fas fa-robot"></i> AI Prediction:</p>
                                            <p style="margin: 0; color: #374151; font-size: 0.85rem; line-height: 1.6;">${e.aiPrediction.substring(0, 150)}...</p>
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <span style="background: #dc2626; color: white; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin-bottom: 0.5rem;">ACTIVE</span>
                                        <p style="margin: 0; color: #6b7280; font-size: 0.75rem;">${new Date(e.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="data-section">
                <div class="section-header">
                    <h3><i class="fas fa-history"></i> Emergency History</h3>
                </div>
                ${pastEmergencies.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Location</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pastEmergencies.map(e => `
                                <tr>
                                    <td><strong>${e.patient.name}</strong><br><small style="color: #6b7280;">${e.patient.age} years • ${e.patient.gender}</small></td>
                                    <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${e.location.address}</td>
                                    <td>${new Date(e.timestamp).toLocaleString()}</td>
                                    <td><span class="badge" style="background: ${e.status === 'RESOLVED' ? '#10b981' : '#6b7280'}; color: white;">${e.status}</span></td>
                                    <td><button class="btn btn-secondary" onclick="viewEmergencyDetails('${e.id}')" style="padding: 0.5rem 1rem;">View Details</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p style="padding: 2rem; text-align: center; color: #6b7280;">No emergency history</p>'}
            </div>
        `;
    } catch (error) {
        console.error('Error loading emergencies:', error);
        document.getElementById('emergency-alerts').innerHTML = '<p style="color: #ef4444; padding: 2rem;">Error loading emergencies</p>';
    }
}

window.viewEmergencyDetails = async function(emergencyId) {
    try {
        const snapshot = await window.sosDatabase.ref(`emergencies/${emergencyId}`).once('value');
        const emergency = snapshot.val();
        
        if (!emergency) {
            Swal.fire('Error', 'Emergency not found', 'error');
            return;
        }
        
        const modalRoot = document.getElementById('modal-root');
        modalRoot.innerHTML = `
            <div class="modal-overlay">
                <div class="modal" style="max-width: 1400px; height: 90vh; display: flex; flex-direction: column;">
                    <div class="modal-header">
                        <h2><i class="fas fa-ambulance"></i> Emergency Details</h2>
                        <button class="close-btn" onclick="closeModal()">✕</button>
                    </div>
                    <div style="flex: 1; display: grid; grid-template-columns: 1fr 450px; gap: 1.5rem; padding: 1.5rem; overflow: hidden;">
                        <div style="position: relative; border-radius: 12px; overflow: hidden; border: 2px solid #e5e7eb;">
                            <div id="emergency-detail-map" style="width: 100%; height: 100%;"></div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 1rem; overflow-y: auto;">
                            <div style="background: linear-gradient(135deg, #fee2e2, #fecaca); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #dc2626;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <h3 style="color: #991b1b; margin: 0;">Status: ${emergency.status}</h3>
                                    ${emergency.status === 'ACTIVE' ? `
                                        <button onclick="resolveEmergency('${emergencyId}')" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-weight: 600;">Mark Resolved</button>
                                    ` : ''}
                                </div>
                                <p style="color: #7f1d1d; margin: 0.5rem 0 0 0; font-size: 0.9rem;">${new Date(emergency.timestamp).toLocaleString()}</p>
                            </div>
                            
                            <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid #e5e7eb;">
                                <h4 style="color: #374151; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;"><i class="fas fa-user"></i> Patient Information</h4>
                                <div style="display: grid; gap: 0.75rem; font-size: 0.9rem;">
                                    <div><strong>Name:</strong> ${emergency.patient.name}</div>
                                    <div><strong>Age:</strong> ${emergency.patient.age} • <strong>Gender:</strong> ${emergency.patient.gender}</div>
                                    <div><strong>Email:</strong> ${emergency.patient.email}</div>
                                    <div><strong>Phone:</strong> ${emergency.patient.phone || 'N/A'}</div>
                                    <div><strong>Address:</strong> ${emergency.patient.address || 'N/A'}</div>
                                    ${emergency.patient.allergies?.length > 0 ? `
                                        <div>
                                            <strong style="color: #dc2626;"><i class="fas fa-exclamation-circle"></i> Allergies:</strong>
                                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                                                ${emergency.patient.allergies.map(a => `<span style="background: #fee2e2; color: #dc2626; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">${a}</span>`).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid #e5e7eb;">
                                <h4 style="color: #374151; margin: 0 0 1rem 0;"><i class="fas fa-map-marker-alt"></i> Location</h4>
                                <p style="margin: 0 0 0.5rem 0; color: #1f2937; font-weight: 500;">${emergency.location.address}</p>
                                <p style="margin: 0; color: #6b7280; font-size: 0.85rem;">Coordinates: ${emergency.location.latitude.toFixed(6)}, ${emergency.location.longitude.toFixed(6)}</p>
                                <p style="margin: 0.5rem 0 0 0; color: #6b7280; font-size: 0.85rem;">Accuracy: ±${Math.round(emergency.location.accuracy)}m</p>
                            </div>
                            
                            <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid #e5e7eb;">
                                <h4 style="color: #374151; margin: 0 0 1rem 0;"><i class="fas fa-pills"></i> Current Medications</h4>
                                <div style="max-height: 150px; overflow-y: auto;">
                                    ${emergency.medicalHistory?.medications?.length > 0 ? 
                                        emergency.medicalHistory.medications.map(m => `
                                            <div style="padding: 0.75rem; background: #f9fafb; border-radius: 8px; margin-bottom: 0.5rem;">
                                                <strong style="color: #1f2937;">${m.name}</strong>
                                                <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #6b7280;">${m.dosage || ''} ${m.frequency || ''}</p>
                                            </div>
                                        `).join('') : 
                                        '<p style="color: #6b7280; margin: 0;">No current medications</p>'
                                    }
                                </div>
                            </div>
                            
                            <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid #e5e7eb;">
                                <h4 style="color: #374151; margin: 0 0 1rem 0;"><i class="fas fa-file-medical"></i> Recent Encounters</h4>
                                <div style="max-height: 150px; overflow-y: auto;">
                                    ${emergency.medicalHistory?.encounters?.length > 0 ? 
                                        emergency.medicalHistory.encounters.map(e => `
                                            <div style="padding: 0.75rem; background: #f9fafb; border-radius: 8px; margin-bottom: 0.5rem;">
                                                <strong style="color: #1f2937;">${e.diagnosis || 'N/A'}</strong>
                                                <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #6b7280;">${e.symptoms || 'No symptoms recorded'}</p>
                                            </div>
                                        `).join('') : 
                                        '<p style="color: #6b7280; margin: 0;">No recent encounters</p>'
                                    }
                                </div>
                            </div>
                            
                            <div style="background: #dbeafe; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6;">
                                <h4 style="color: #1e40af; margin: 0 0 1rem 0;"><i class="fas fa-robot"></i> AI Emergency Prediction</h4>
                                <div style="max-height: 250px; overflow-y: auto; font-size: 0.85rem; color: #1e3a8a; white-space: pre-wrap; line-height: 1.6;">
                                    ${emergency.aiPrediction}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(() => initEmergencyDetailMap(emergency), 100);
    } catch (error) {
        console.error('Error loading emergency details:', error);
        Swal.fire('Error', 'Failed to load emergency details', 'error');
    }
}

function initEmergencyDetailMap(emergency) {
    const MAPS_API_KEY = window.GOOGLE_MAPS_API_KEY || 'AIzaSyC_zk6RFUUqiuSuVOTZVhYQDx_E_wfGpIY';
    
    if (typeof google === 'undefined') {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&loading=async&callback=renderDetailMap`;
        script.async = true;
        script.defer = true;
        window.emergencyData = emergency;
        document.head.appendChild(script);
    } else {
        renderDetailMap();
    }
    
    window.renderDetailMap = function() {
        const data = window.emergencyData || emergency;
        const map = new google.maps.Map(document.getElementById('emergency-detail-map'), {
            center: { lat: data.location.latitude, lng: data.location.longitude },
            zoom: 16
        });
        
        new google.maps.Marker({
            position: { lat: data.location.latitude, lng: data.location.longitude },
            map: map,
            title: data.patient.name,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 15,
                fillColor: '#dc2626',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3
            }
        });
        
        new google.maps.Circle({
            map: map,
            center: { lat: data.location.latitude, lng: data.location.longitude },
            radius: data.location.accuracy,
            fillColor: '#dc2626',
            fillOpacity: 0.2,
            strokeColor: '#dc2626',
            strokeOpacity: 0.5,
            strokeWeight: 2
        });
    };
}

window.resolveEmergency = async function(emergencyId) {
    const result = await Swal.fire({
        title: 'Resolve Emergency?',
        text: 'Mark this emergency as resolved?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Resolve',
        confirmButtonColor: '#10b981'
    });
    
    if (result.isConfirmed) {
        await window.sosDatabase.ref(`emergencies/${emergencyId}`).update({ status: 'RESOLVED' });
        Swal.fire('Resolved', 'Emergency marked as resolved', 'success');
        closeModal();
        loadEmergencies();
    }
}

function AIPage() {
    setTimeout(() => {
        const form = document.querySelector('.access-code-form');
        if (form) {
            form.addEventListener('submit', handleAccessCode);
        }
        loadPatientsList();
        loadDoctorMessages();
    }, 100);
    
    return `
        ${Sidebar()}
        <main class="main-content">
            <div class="section-header">
                <h2>Doctor Portal</h2>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; height: calc(100vh - 200px);">
                <div class="data-section" style="display: flex; flex-direction: column; height: 100%;">
                    <div class="section-header">
                        <h3>Patients</h3>
                    </div>
                    <div id="patients-chat-list" style="flex: 1; overflow-y: auto;">
                        <div class="loading"><div class="spinner"></div></div>
                    </div>
                </div>
                
                <div class="data-section" style="display: flex; flex-direction: column; height: 100%;">
                    <div class="section-header">
                        <h3 id="chat-patient-name">Select a patient</h3>
                    </div>
                    <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 1rem; background: rgba(15, 23, 42, 0.5); border-radius: 8px; margin-bottom: 1rem;">
                        <p style="text-align: center; color: #6b7280; padding: 2rem;">Select a patient to start messaging</p>
                    </div>
                    <form id="chat-form" onsubmit="sendMessage(event)" style="display: none;">
                        <div style="display: flex; gap: 1rem;">
                            <input type="text" id="chat-input" class="form-input" placeholder="Type your message..." required style="flex: 1;">
                            <button type="submit" class="btn btn-primary">
                                ${icons.check} Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <div class="data-section" style="max-width: 800px; margin: 2rem auto 0;">
                <div style="text-align: center; padding: 3rem 2rem;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: white; font-size: 32px;">
                        ${icons.ai}
                    </div>
                    <h3 style="font-size: 2rem; margin-bottom: 1rem; color: #fff;">Video Consultation</h3>
                    <p style="color: #94a3b8; font-size: 1.1rem; margin-bottom: 2rem;">Secure video consultation with patients</p>
                    
                    <form class="access-code-form" style="max-width: 400px; margin: 0 auto;">
                        <div class="form-group">
                            <input type="text" id="access-code" class="form-input" placeholder="Enter 6-digit access code" maxlength="6" required style="text-align: center; letter-spacing: 2px; text-transform: uppercase;">
                        </div>
                        <button type="submit" id="connect-btn" class="btn btn-primary" style="width: 100%;">
                            ${icons.check} Start Video Call
                        </button>
                    </form>
                    
                    <div style="margin-top: 2rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: var(--primary); font-size: 0.9rem;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
                        </svg>
                        <span>End-to-end encrypted connection</span>
                    </div>
                </div>
            </div>
        </main>
        ${Footer()}
    `;
}



function PatientDetailPage() {
    return `
        ${Sidebar()}
        <main class="main-content">
            <div id="patient-detail-content">
                <div class="loading"><div class="spinner"></div><p>Loading patient details...</p></div>
            </div>
        </main>
        ${Footer()}
    `;
}

async function loadPatientDetail() {
    const patientId = currentData.id;
    try {
        const [patient, appointments, encounters, medications, tests] = await Promise.all([
            apiCall(`/patients/${patientId}`),
            apiCall(`/patients/${patientId}/appointments`),
            apiCall(`/patients/${patientId}/encounters`),
            apiCall(`/patients/${patientId}/medications`),
            apiCall(`/patients/${patientId}/tests`)
        ]);
        
        const appointmentsList = appointments.results || [];
        const encountersList = encounters.results || [];
        const medicationsList = medications.results || [];
        const testsList = tests.results || [];
        
        document.getElementById('patient-detail-content').innerHTML = `
            <div class="section-header" style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2>${patient.first_name} ${patient.last_name}</h2>
                    <p style="color: #94a3b8; margin-top: 0.5rem;">Patient ID: #${patient.id} | ${patient.age} years old</p>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn btn-primary" onclick="editPatient(${patient.id})">
                        Edit Patient
                    </button>
                    <button class="btn btn-secondary" onclick="navigate('patients')">
                        Back to Patients
                    </button>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
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
                        <p style="margin-top: 1rem;"><strong>Health Conditions:</strong></p>
                        <div id="patient-conditions" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            <p style="color: #94a3b8;">Loading...</p>
                        </div>
                        <p style="margin-top: 1rem;"><strong>Created:</strong> ${new Date(patient.created_at).toLocaleDateString()}</p>
                        <p><strong>Last Updated:</strong> ${new Date(patient.updated_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            
            <div class="data-section" style="margin-bottom: 2rem;">
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
            
            <div class="data-section" style="margin-bottom: 2rem;">
                <div class="section-header">
                    <h3>Appointments (${appointmentsList.length})</h3>
                </div>
                ${appointmentsList.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date & Time</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Summary</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${appointmentsList.map(a => `
                                <tr>
                                    <td>#${a.id}</td>
                                    <td>${new Date(a.date).toLocaleString()}</td>
                                    <td>${a.reason || 'N/A'}</td>
                                    <td><span class="badge ${a.status === 'active' ? 'badge-success' : 'badge-warning'}">${a.status}</span></td>
                                    <td>${a.summary || 'N/A'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p style="color: #94a3b8; text-align: center; padding: 2rem;">No appointments scheduled</p>'}
            </div>
            
            <div class="data-section" style="margin-bottom: 2rem;">
                <div class="section-header">
                    <h3>Medical Encounters (${encountersList.length})</h3>
                </div>
                ${encountersList.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Vitals</th>
                                <th>Diagnosis</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${encountersList.map(e => `
                                <tr>
                                    <td>#${e.id}</td>
                                    <td>${new Date(e.created_at).toLocaleDateString()}</td>
                                    <td style="font-size: 0.85rem;">
                                        ${e.blood_pressure ? `BP: ${e.blood_pressure}<br>` : ''}
                                        ${e.temperature ? `Temp: ${e.temperature}°C<br>` : ''}
                                        ${e.heart_rate ? `HR: ${e.heart_rate}` : ''}
                                    </td>
                                    <td>${e.diagnosis || 'N/A'}</td>
                                    <td><button class="btn btn-secondary" onclick="viewEncounterDetails(${e.id})" style="padding: 0.5rem 1rem;">View</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p style="color: #94a3b8; text-align: center; padding: 2rem;">No encounters recorded</p>'}
            </div>
            
            <div class="data-section" style="margin-bottom: 2rem;">
                <div class="section-header">
                    <h3>Medications (${medicationsList.length})</h3>
                </div>
                ${medicationsList.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Dosage</th>
                                <th>Frequency</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${medicationsList.map(m => `
                                <tr>
                                    <td>#${m.id}</td>
                                    <td><strong>${m.name}</strong></td>
                                    <td>${m.dosage || 'N/A'}</td>
                                    <td>${m.frequency || 'N/A'}</td>
                                    <td>${m.start_date ? new Date(m.start_date).toLocaleDateString() : 'N/A'}</td>
                                    <td>${m.end_date ? new Date(m.end_date).toLocaleDateString() : 'Ongoing'}</td>
                                    <td>${m.duration || 'N/A'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p style="color: #94a3b8; text-align: center; padding: 2rem;">No medications prescribed</p>'}
            </div>
            
            <div class="data-section">
                <div class="section-header">
                    <h3>Lab Tests (${testsList.length})</h3>
                </div>
                ${testsList.length > 0 ? `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Test Name</th>
                                <th>Result</th>
                                <th>Notes</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${testsList.map(t => `
                                <tr>
                                    <td>#${t.id}</td>
                                    <td><strong>${t.name}</strong></td>
                                    <td><span class="badge" style="background: ${t.result ? '#10b981' : '#f59e0b'}; color: white;">${t.result || 'Pending'}</span></td>
                                    <td style="font-size: 0.85rem; max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${t.notes || 'N/A'}</td>
                                    <td>${new Date(t.created_at).toLocaleDateString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p style="color: #94a3b8; text-align: center; padding: 2rem;">No lab tests ordered</p>'}
            </div>
        `;
        // Load patient conditions from Firebase
        setTimeout(async () => {
            const conditionsDiv = document.getElementById('patient-conditions');
            if (!conditionsDiv) return;
            try {
                if (patient.email) {
                    const usersSnapshot = await window.sosDatabase.ref('health_profiles').once('value');
                    let conditions = [];
                    usersSnapshot.forEach((child) => {
                        const profile = child.val();
                        if (profile.email === patient.email) {
                            conditions = profile.conditions || [];
                        }
                    });
                    
                    if (conditions.length > 0) {
                        const tagMap = {};
                        healthProfileTags.forEach(t => tagMap[t.value] = t);
                        conditionsDiv.innerHTML = conditions.map(c => {
                            const tag = tagMap[c];
                            return tag ? `<span class="badge" style="background: ${tag.color}; color: #fff; margin-right: 0.5rem; margin-bottom: 0.5rem;">${tag.label}</span>` : '';
                        }).join('');
                    } else {
                        conditionsDiv.innerHTML = '<p style="color: #94a3b8; margin: 0;">No conditions recorded</p>';
                    }
                } else {
                    conditionsDiv.innerHTML = '<p style="color: #94a3b8; margin: 0;">No conditions recorded</p>';
                }
            } catch (e) {
                console.error('Error loading conditions:', e);
                conditionsDiv.innerHTML = '<p style="color: #94a3b8; margin: 0;">No conditions recorded</p>';
            }
        }, 200);
    } catch (error) {
        document.getElementById('patient-detail-content').innerHTML = '<p style="color: #ef4444;">Error loading patient details</p>';
    }
}


window.updatePatient = async function(id) {
    try {
        const patient = await apiCall(`/patients/${id}`);
        Swal.fire({
            title: 'Edit Patient',
            html: `
                <form id="update-form" style="text-align: left;">
                    <div class="form-group"><label class="form-label">First Name</label><input type="text" class="form-input" name="first_name" value="${patient.first_name || ''}"></div>
                    <div class="form-group"><label class="form-label">Last Name</label><input type="text" class="form-input" name="last_name" value="${patient.last_name || ''}"></div>
                    <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" name="email" value="${patient.email || ''}"></div>
                    <div class="form-group"><label class="form-label">Phone</label><input type="tel" class="form-input" name="phone_number" value="${patient.phone_number || ''}"></div>
                    <div class="form-group"><label class="form-label">Date of Birth</label><input type="date" class="form-input" name="date_of_birth" value="${patient.date_of_birth || ''}"></div>
                    <div class="form-group"><label class="form-label">Gender</label><select class="form-select" name="gender"><option value="Male" ${patient.gender === 'Male' ? 'selected' : ''}>Male</option><option value="Female" ${patient.gender === 'Female' ? 'selected' : ''}>Female</option><option value="Other" ${patient.gender === 'Other' ? 'selected' : ''}>Other</option></select></div>
                    <div class="form-group"><label class="form-label">Address</label><textarea class="form-textarea" name="address">${patient.address || ''}</textarea></div>
                    <div class="form-group"><label class="form-label">Allergies (comma separated)</label><input type="text" class="form-input" name="allergies" value="${patient.allergies?.join(', ') || ''}"></div>
                </form>
            `,
            width: '600px',
            showCancelButton: true,
            confirmButtonText: 'Update',
            preConfirm: async () => {
                const form = document.getElementById('update-form');
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => {
                    if (value) data[key] = key === 'allergies' ? value.split(',').map(a => a.trim()).filter(a => a) : value;
                });
                try {
                    await apiCall(`/patients/${id}`, 'PATCH', data);
                    return true;
                } catch (error) {
                    Swal.showValidationMessage('Failed to update');
                    return false;
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Success!', 'Patient updated', 'success');
                loadPatients();
            }
        });
    } catch (error) {
        Swal.fire('Error', 'Failed to load patient', 'error');
    }
}

window.deletePatient = async function(id) {
    Swal.fire({
        title: 'Delete Patient?',
        text: 'This action cannot be undone',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#ef4444'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await apiCall(`/patients/${id}`, 'DELETE');
                Swal.fire('Deleted!', 'Patient deleted', 'success');
                loadPatients();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete patient', 'error');
            }
        }
    });
}

window.updateAppointment = async function(id) {
    try {
        const appt = await apiCall(`/appointments/${id}`);
        Swal.fire({
            title: 'Edit Appointment',
            html: `
                <form id="update-appt-form" style="text-align: left;">
                    <div class="form-group"><label class="form-label">Patient ID</label><input type="number" class="form-input" name="patient" value="${appt.patient}" readonly></div>
                    <div class="form-group"><label class="form-label">Date & Time</label><input type="datetime-local" class="form-input" name="date" value="${appt.date?.slice(0, 16) || ''}"></div>
                    <div class="form-group"><label class="form-label">Reason</label><textarea class="form-textarea" name="reason">${appt.reason || ''}</textarea></div>
                    <div class="form-group"><label class="form-label">Summary</label><textarea class="form-textarea" name="summary">${appt.summary || ''}</textarea></div>
                    <div class="form-group"><label class="form-label">Status</label><select class="form-select" name="status"><option value="active" ${appt.status === 'active' ? 'selected' : ''}>Active</option><option value="completed" ${appt.status === 'completed' ? 'selected' : ''}>Completed</option></select></div>
                </form>
            `,
            width: '600px',
            showCancelButton: true,
            confirmButtonText: 'Update',
            preConfirm: async () => {
                const form = document.getElementById('update-appt-form');
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => { if (value) data[key] = value; });
                try {
                    await apiCall(`/appointments/${id}`, 'PATCH', data);
                    return true;
                } catch (error) {
                    Swal.showValidationMessage('Failed to update');
                    return false;
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Success!', 'Appointment updated', 'success');
                loadAppointments();
            }
        });
    } catch (error) {
        Swal.fire('Error', 'Failed to load appointment', 'error');
    }
}

window.deleteAppointment = async function(id) {
    Swal.fire({
        title: 'Delete Appointment?',
        text: 'This action cannot be undone',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#ef4444'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await apiCall(`/appointments/${id}`, 'DELETE');
                Swal.fire('Deleted!', 'Appointment deleted', 'success');
                loadAppointments();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete appointment', 'error');
            }
        }
    });
}

async function editPatient(id) {
    try {
        const patient = await apiCall(`/patients/${id}`);
        
        Swal.fire({
            title: 'Edit Patient',
            html: `
                <form id="edit-patient-form" style="text-align: left;">
                    <div class="form-group">
                        <label class="form-label">First Name</label>
                        <input type="text" class="form-input" name="first_name" value="${patient.first_name || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Last Name</label>
                        <input type="text" class="form-input" name="last_name" value="${patient.last_name || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" name="email" value="${patient.email || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone</label>
                        <input type="tel" class="form-input" name="phone_number" value="${patient.phone_number || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date of Birth</label>
                        <input type="date" class="form-input" name="date_of_birth" value="${patient.date_of_birth || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Gender</label>
                        <select class="form-select" name="gender">
                            <option value="Male" ${patient.gender === 'Male' ? 'selected' : ''}>Male</option>
                            <option value="Female" ${patient.gender === 'Female' ? 'selected' : ''}>Female</option>
                            <option value="Other" ${patient.gender === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Address</label>
                        <textarea class="form-textarea" name="address">${patient.address || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Allergies (comma separated)</label>
                        <input type="text" class="form-input" name="allergies" value="${patient.allergies?.join(', ') || ''}">
                    </div>
                </form>
            `,
            width: '600px',
            showCancelButton: true,
            confirmButtonText: 'Update Patient',
            cancelButtonText: 'Cancel',
            preConfirm: async () => {
                const form = document.getElementById('edit-patient-form');
                const formData = new FormData(form);
                const data = {};
                
                formData.forEach((value, key) => {
                    if (value) {
                        if (key === 'allergies') {
                            data[key] = value.split(',').map(a => a.trim()).filter(a => a);
                        } else {
                            data[key] = value;
                        }
                    }
                });
                
                try {
                    await apiCall(`/patients/${id}`, 'PATCH', data);
                    return true;
                } catch (error) {
                    Swal.showValidationMessage('Failed to update patient');
                    return false;
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Success!', 'Patient updated successfully', 'success');
                loadPatientDetail();
            }
        });
    } catch (error) {
        Swal.fire('Error', 'Failed to load patient data', 'error');
    }
}


function PharmaVigilancePage() {
    return `
        ${Sidebar()}
        <main class="main-content">
            <div class="section-header">
                <h2>PharmaVigilance Monitoring</h2>
                <button class="btn btn-secondary" onclick="toggleNotifications()" id="notif-toggle-btn">
                    <i class="fas fa-bell"></i> Enable Notifications
                </button>
            </div>
            
            <div class="data-section" style="margin-bottom: 2rem; background: linear-gradient(135deg, rgba(239,68,68,0.1), rgba(220,38,38,0.05)); border-left: 4px solid #ef4444;">
                <div style="padding: 1.5rem;">
                    <h3 style="color: #dc2626; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-exclamation-triangle"></i> Drug Interaction Monitoring Active
                    </h3>
                    <p style="color: #991b1b; margin-bottom: 1rem; line-height: 1.6;">
                        The system automatically monitors all prescribed medications for potential drug interactions. 
                        Interactions are detected in real-time when medications are prescribed during encounters.
                    </p>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center;">
                            <div style="font-size: 0.85rem; color: #6b7280; margin-bottom: 0.5rem;">Detection Method</div>
                            <div style="font-weight: 600; color: #0ea5e9;">Real-time API</div>
                        </div>
                        <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center;">
                            <div style="font-size: 0.85rem; color: #6b7280; margin-bottom: 0.5rem;">Coverage</div>
                            <div style="font-weight: 600; color: #10b981;">All Encounters</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <div class="data-section">
                    <div class="section-header">
                        <h3>Webhook Configuration</h3>
                    </div>
                    <form onsubmit="registerWebhook(event)" style="padding: 1rem;">
                        <div class="form-group">
                            <label class="form-label">Webhook URL</label>
im                            <input type="url" class="form-input" id="webhook-url" value="https://us-central1-festive-firefly-465918-t9.cloudfunctions.net/drugInteractionWebhook" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            ${icons.check} Register Webhook
                        </button>
                        <p style="margin-top: 1rem; color: #6b7280; font-size: 0.85rem; text-align: center;">Webhook will automatically receive alerts when drug interactions are detected</p>
                    </form>
                    <div id="webhook-status" style="padding: 1rem;"></div>
                </div>
                
                <div class="data-section">
                    <div class="section-header">
                        <h3>Alert Statistics</h3>
                    </div>
                    <div id="alert-stats" style="padding: 1rem;">
                        <div class="loading"><div class="spinner"></div></div>
                    </div>
                </div>
            </div>
            
            <div class="data-section">
                <div class="section-header">
                    <h3>Drug Interaction Alerts</h3>
                    <button class="btn btn-secondary" onclick="loadPharmaAlerts()">
                        ${icons.search} Refresh
                    </button>
                </div>
                <div id="pharma-alerts">
                    <div class="loading"><div class="spinner"></div></div>
                </div>
            </div>
        </main>
        ${Footer()}
    `;
}

window.registerWebhook = async function(event) {
    event.preventDefault();
    const url = document.getElementById('webhook-url').value;
    
    try {
        const result = await apiCall('/auth/webhook/register', 'POST', { url });
        Swal.fire('Success!', 'Webhook registered successfully', 'success');
        document.getElementById('webhook-status').innerHTML = `
            <div style="padding: 1rem; background: #dcfce7; border-radius: 8px; color: #166534;">
                <strong>✓ Webhook Active</strong><br>
                <small>${url}</small>
            </div>
        `;
        localStorage.setItem('webhook_url', url);
    } catch (error) {
        console.error('Register webhook error:', error);
        Swal.fire('Error', `Failed to register webhook: ${error.message}`, 'error');
    }
}



window.loadPharmaAlerts = async function() {
    console.log('📊 Loading pharma alerts...');
    let allAlerts = [];
    let stats = { major: 0, moderate: 0, minor: 0, unknown: 0 };
    
    try {
        const data = await apiCall('/pharmavigilance/interactions');
        const apiInteractions = data.results || [];
        const localAlerts = JSON.parse(localStorage.getItem('pharma_alerts') || '[]');
        console.log('Local alerts from storage:', localAlerts.length);
        
        allAlerts = [...apiInteractions.map(int => ({
            event: 'DrugInteraction',
            severity: int.severity || 'Unknown',
            details: int.description || 'Drug interaction detected',
            resource: 'Encounter',
            resource_id: int.encounter_id || int.id,
            timestamp: new Date(int.created_at || Date.now()).getTime(),
            drug1: int.drug1,
            drug2: int.drug2,
            clinical_effects: int.clinical_effects,
            management: int.management,
            patient_name: int.patient_name
        })), ...localAlerts];
    } catch (error) {
        console.error('Error loading pharma alerts:', error);
        allAlerts = JSON.parse(localStorage.getItem('pharma_alerts') || '[]');
    }
    console.log('Total alerts to display:', allAlerts.length);
    
    stats = {
        major: allAlerts.filter(a => a.severity === 'Major').length,
        moderate: allAlerts.filter(a => a.severity === 'Moderate').length,
        minor: allAlerts.filter(a => a.severity === 'Minor').length,
        unknown: allAlerts.filter(a => a.severity === 'Unknown').length
    };
    
    document.getElementById('alert-stats').innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div style="padding: 1rem; background: #fee2e2; border-radius: 8px; text-align: center;">
                <div style="font-size: 2rem; font-weight: 600; color: #dc2626;">${stats.major}</div>
                <div style="font-size: 0.875rem; color: #991b1b;">Major</div>
            </div>
            <div style="padding: 1rem; background: #fef3c7; border-radius: 8px; text-align: center;">
                <div style="font-size: 2rem; font-weight: 600; color: #d97706;">${stats.moderate}</div>
                <div style="font-size: 0.875rem; color: #92400e;">Moderate</div>
            </div>
            <div style="padding: 1rem; background: #dbeafe; border-radius: 8px; text-align: center;">
                <div style="font-size: 2rem; font-weight: 600; color: #2563eb;">${stats.minor}</div>
                <div style="font-size: 0.875rem; color: #1e40af;">Minor</div>
            </div>
            <div style="padding: 1rem; background: #f3f4f6; border-radius: 8px; text-align: center;">
                <div style="font-size: 2rem; font-weight: 600; color: #6b7280;">${stats.unknown}</div>
                <div style="font-size: 0.875rem; color: #374151;">Unknown</div>
            </div>
        </div>
    `;
    
    document.getElementById('pharma-alerts').innerHTML = allAlerts.length > 0 ? `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Drugs</th>
                    <th>Severity</th>
                    <th>Resource</th>
                    <th>Details</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${allAlerts.map((a, i) => `
                    <tr>
                        <td>${new Date(a.timestamp).toLocaleString()}</td>
                        <td>${a.patient_name || 'N/A'}</td>
                        <td style="font-size: 0.85rem;">${a.drug1 && a.drug2 ? `${a.drug1} + ${a.drug2}` : 'N/A'}</td>
                        <td><span class="badge" style="background: ${
                            a.severity === 'Major' ? '#dc2626' : 
                            a.severity === 'Moderate' ? '#d97706' : 
                            a.severity === 'Minor' ? '#2563eb' : '#6b7280'
                        }; color: white;">${a.severity}</span></td>
                        <td>${a.resource} #${a.resource_id}</td>
                        <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis;">${a.details}</td>
                        <td>
                            <button class="btn btn-secondary" onclick="viewDetailedAlert(${i})" style="padding: 0.4rem 0.8rem;">View</button>
                            <button class="btn" onclick="dismissAlert(${i})" style="padding: 0.4rem 0.8rem; background: #ef4444; color: white;">Dismiss</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    ` : '<p style="padding: 2rem; text-align: center; color: #6b7280;">No drug interactions detected</p>';
    
    // Store merged alerts for view functions
    window.currentPharmaAlerts = allAlerts;
    
    const savedUrl = localStorage.getItem('webhook_url');
    if (savedUrl) {
        document.getElementById('webhook-url').value = savedUrl;
        document.getElementById('webhook-status').innerHTML = `
            <div style="padding: 1rem; background: #dcfce7; border-radius: 8px; color: #166534;">
                <strong>✓ Webhook Active</strong><br>
                <small>${savedUrl}</small>
            </div>
        `;
    }
    
    // Update notification button
    updateNotificationButton();
}

window.toggleNotifications = async function() {
    if (typeof window.areNotificationsEnabled === 'function' && window.areNotificationsEnabled()) {
        Swal.fire('Enabled', 'Push notifications are already enabled', 'info');
    } else if (typeof window.requestNotificationPermission === 'function') {
        const enabled = await window.requestNotificationPermission();
        if (enabled) {
            Swal.fire('Success!', 'Push notifications enabled', 'success');
            updateNotificationButton();
        } else {
            Swal.fire('Denied', 'Notification permission denied', 'error');
        }
    }
}

function updateNotificationButton() {
    const btn = document.getElementById('notif-toggle-btn');
    if (btn && typeof window.areNotificationsEnabled === 'function') {
        if (window.areNotificationsEnabled()) {
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Notifications Enabled';
            btn.style.background = '#10b981';
        } else {
            btn.innerHTML = '<i class="fas fa-bell"></i> Enable Notifications';
            btn.style.background = '';
        }
    }
}

window.viewDetailedAlert = function(index) {
    const alerts = window.currentPharmaAlerts || JSON.parse(localStorage.getItem('pharma_alerts') || '[]');
    const alert = alerts[index];
    
    const severityColor = alert.severity === 'Major' ? '#dc2626' : 
                         alert.severity === 'Moderate' ? '#d97706' : 
                         alert.severity === 'Minor' ? '#2563eb' : '#6b7280';
    
    Swal.fire({
        title: `<i class="fas fa-exclamation-triangle"></i> Drug Interaction Alert`,
        html: `
            <div style="text-align: left; line-height: 1.6;">
                <div style="background: linear-gradient(135deg, rgba(239,68,68,0.1), rgba(220,38,38,0.1)); padding: 1rem; border-radius: 8px; border-left: 4px solid ${severityColor}; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <strong style="font-size: 1.1rem; color: ${severityColor};">${alert.drug1 && alert.drug2 ? `${alert.drug1} + ${alert.drug2}` : 'Drug Interaction'}</strong>
                        <span style="padding: 0.25rem 0.75rem; background: ${severityColor}; color: white; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">${alert.severity}</span>
                    </div>
                </div>
                
                ${alert.patient_name ? `<p><strong>Patient:</strong> ${alert.patient_name}</p>` : ''}
                <p><strong>Resource:</strong> ${alert.resource} #${alert.resource_id}</p>
                <p><strong>Detected:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
                
                <div style="margin-top: 1rem; padding: 1rem; background: #f9fafb; border-radius: 8px;">
                    <p style="margin: 0 0 0.5rem 0;"><strong>Description:</strong></p>
                    <p style="margin: 0; color: #374151;">${alert.details}</p>
                </div>
                
                ${alert.clinical_effects ? `
                    <div style="margin-top: 1rem; padding: 1rem; background: #fef3c7; border-radius: 8px; border-left: 3px solid #f59e0b;">
                        <p style="margin: 0 0 0.5rem 0;"><strong>💊 Clinical Effects:</strong></p>
                        <p style="margin: 0; color: #92400e;">${alert.clinical_effects}</p>
                    </div>
                ` : ''}
                
                ${alert.management ? `
                    <div style="margin-top: 1rem; padding: 1rem; background: #dbeafe; border-radius: 8px; border-left: 3px solid #3b82f6;">
                        <p style="margin: 0 0 0.5rem 0;"><strong>👨‍⚕️ Management:</strong></p>
                        <p style="margin: 0; color: #1e40af;">${alert.management}</p>
                    </div>
                ` : ''}
                
                <div style="margin-top: 1rem; padding: 0.75rem; background: #fee2e2; border-radius: 8px; text-align: center;">
                    <small style="color: #991b1b;"><strong>Action Required:</strong> Review medication combination and consult with prescribing physician if necessary.</small>
                </div>
            </div>
        `,
        width: '700px',
        confirmButtonText: 'Close',
        confirmButtonColor: severityColor
    });
}

// Keep old function for backward compatibility
window.viewAlert = window.viewDetailedAlert;

window.dismissAlert = function(index) {
    const alerts = JSON.parse(localStorage.getItem('pharma_alerts') || '[]');
    alerts.splice(index, 1);
    localStorage.setItem('pharma_alerts', JSON.stringify(alerts));
    loadPharmaAlerts();
    Swal.fire('Dismissed', 'Alert removed', 'success');
}

window.handleWebhookEvent = function(event) {
    console.log('⚠️ handleWebhookEvent called with:', event);
    const alerts = JSON.parse(localStorage.getItem('pharma_alerts') || '[]');
    const newAlert = { ...event, timestamp: event.timestamp || Date.now() };
    alerts.unshift(newAlert);
    localStorage.setItem('pharma_alerts', JSON.stringify(alerts));
    console.log('✅ Alert saved to localStorage. Total alerts:', alerts.length);
    
    // Send push notification
    if (typeof window.sendPushNotification === 'function') {
        window.sendPushNotification({
            title: `${event.severity} Drug Interaction Alert`,
            body: event.details,
            severity: event.severity,
            tag: `drug-interaction-${event.resource_id}`
        });
    }
    
    Swal.fire({
        title: `${event.severity} Drug Interaction!`,
        html: `
            <div style="text-align: left;">
                <p><strong>Resource:</strong> ${event.resource} #${event.resource_id}</p>
                <p>${event.details}</p>
            </div>
        `,
        icon: event.severity === 'Major' ? 'error' : 'warning',
        confirmButtonText: 'View Alerts'
    }).then(() => {
        if (currentPage === 'pharma') {
            console.log('🔄 Reloading pharma alerts...');
            loadPharmaAlerts();
        }
    });
}


let selectedPatientId = null;
const db = firebase.database(); // WebRTC database
const sosDb = window.sosDatabase; // SOS Emergency database

async function loadPatientsList() {
    try {
        const data = await apiCall('/patients');
        const patients = data.results || [];
        
        document.getElementById('patients-chat-list').innerHTML = patients.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${patients.map(p => `
                    <div onclick="selectPatient(${p.id}, '${p.first_name} ${p.last_name}')" 
                         style="padding: 1rem; background: ${selectedPatientId === p.id ? 'rgba(14, 165, 233, 0.2)' : 'rgba(30, 41, 59, 0.4)'}; 
                         border-radius: 8px; cursor: pointer; border-left: 3px solid ${selectedPatientId === p.id ? '#0ea5e9' : 'transparent'};"
                         onmouseover="this.style.background='rgba(14, 165, 233, 0.1)'" 
                         onmouseout="this.style.background='${selectedPatientId === p.id ? 'rgba(14, 165, 233, 0.2)' : 'rgba(30, 41, 59, 0.4)'}'">
                        <div style="font-weight: 600; color: #fff; margin-bottom: 0.25rem;">${p.first_name} ${p.last_name}</div>
                        <div style="font-size: 0.85rem; color: #94a3b8;">ID: #${p.id}</div>
                    </div>
                `).join('')}
            </div>
        ` : '<p style="padding: 1rem; color: #6b7280; text-align: center;">No patients found</p>';
    } catch (error) {
        document.getElementById('patients-chat-list').innerHTML = '<p style="color: #ef4444; padding: 1rem;">Error loading patients</p>';
    }
}

window.selectPatient = function(patientId, patientName) {
    selectedPatientId = patientId;
    document.getElementById('chat-patient-name').textContent = patientName;
    document.getElementById('chat-form').style.display = 'flex';
    loadPatientsList();
    loadDoctorMessages();
}

function loadDoctorMessages() {
    if (!selectedPatientId) return;
    
    const messagesRef = db.ref(`messages/${selectedPatientId}`);
    messagesRef.on('value', (snapshot) => {
        const messages = [];
        snapshot.forEach((child) => {
            messages.push({ id: child.key, ...child.val() });
        });
        
        messages.sort((a, b) => a.timestamp - b.timestamp);
        
        document.getElementById('chat-messages').innerHTML = messages.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${messages.map(m => `
                    <div style="display: flex; justify-content: ${m.sender === 'doctor' ? 'flex-end' : 'flex-start'};">
                        <div style="max-width: 70%; padding: 0.75rem 1rem; background: ${m.sender === 'doctor' ? 'linear-gradient(135deg, #0ea5e9, #0c4a6e)' : 'rgba(30, 41, 59, 0.6)'}; 
                             border-radius: 12px; color: #fff;">
                            <div style="font-size: 0.9rem;">${m.text}</div>
                            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.25rem; text-align: right;">
                                ${new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : '<p style="text-align: center; color: #6b7280; padding: 2rem;">No messages yet. Start the conversation!</p>';
        
        const chatDiv = document.getElementById('chat-messages');
        chatDiv.scrollTop = chatDiv.scrollHeight;
    });
}

window.sendMessage = async function(event) {
    event.preventDefault();
    
    if (!selectedPatientId) {
        Swal.fire('Error', 'Please select a patient first', 'error');
        return;
    }
    
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    
    if (!text) return;
    
    const message = {
        text: text,
        sender: 'doctor',
        timestamp: Date.now(),
        patientId: selectedPatientId
    };
    
    try {
        await db.ref(`messages/${selectedPatientId}`).push(message);
        input.value = '';
    } catch (error) {
        Swal.fire('Error', 'Failed to send message', 'error');
    }
}


// Test drug interaction with Aspirin + Amlodipine
window.testDrugInteraction = async function() {
    Swal.fire({
        title: 'Test Drug Interaction',
        html: `
            <div style="text-align: left;">
                <p style="margin-bottom: 1rem;">This will create a test encounter with Aspirin and Amlodipine to demonstrate drug interaction detection.</p>
                <div style="background: #fef3c7; padding: 1rem; border-radius: 8px; border-left: 3px solid #f59e0b; margin-bottom: 1rem;">
                    <p style="margin: 0; color: #92400e; font-size: 0.9rem;"><strong>Note:</strong> You need to manually prescribe both medications to an encounter to trigger the interaction detection.</p>
                </div>
                <ol style="line-height: 1.8; color: #374151;">
                    <li>Go to <strong>Encounters</strong> page</li>
                    <li>Create or select an encounter</li>
                    <li>Prescribe <strong>Aspirin</strong></li>
                    <li>Prescribe <strong>Amlodipine</strong></li>
                    <li>View the encounter details to see detected interactions</li>
                    <li>Check this PharmaVigilance page for the alert</li>
                </ol>
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#0ea5e9'
    });
}

// Update dismiss to work with merged alerts
window.dismissAlert = function(index) {
    const alerts = window.currentPharmaAlerts || JSON.parse(localStorage.getItem('pharma_alerts') || '[]');
    
    Swal.fire({
        title: 'Dismiss Alert?',
        text: 'This will remove the alert from your local view',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Dismiss',
        confirmButtonColor: '#ef4444'
    }).then((result) => {
        if (result.isConfirmed) {
            // Only remove from local storage, API alerts will persist
            const localAlerts = JSON.parse(localStorage.getItem('pharma_alerts') || '[]');
            const alert = alerts[index];
            
            // Find and remove from local if it exists there
            const localIndex = localAlerts.findIndex(a => 
                a.timestamp === alert.timestamp && 
                a.resource_id === alert.resource_id
            );
            
            if (localIndex !== -1) {
                localAlerts.splice(localIndex, 1);
                localStorage.setItem('pharma_alerts', JSON.stringify(localAlerts));
            }
            
            Swal.fire('Dismissed', 'Alert removed from view', 'success');
            loadPharmaAlerts();
        }
    });
}


// Settings Page
function SettingsPage() {
    return `
        ${Sidebar()}
        <main class="main-content">
            <div class="section-header">
                <h2><i class="fas fa-cog"></i> Settings</h2>
            </div>
            
            <div style="display: grid; gap: 2rem; max-width: 1200px; margin: 0 auto;">
                <!-- Profile Settings -->
                <div class="data-section">
                    <div class="section-header">
                        <h3><i class="fas fa-user"></i> Profile Settings</h3>
                    </div>
                    <div style="padding: 1.5rem;">
                        <form id="profile-form" onsubmit="saveProfile(event)">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group">
                                    <label class="form-label">Display Name</label>
                                    <input type="text" class="form-input" id="display-name" placeholder="Your Name">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-input" id="profile-email" readonly>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                ${icons.check} Save Profile
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Notification Settings -->
                <div class="data-section">
                    <div class="section-header">
                        <h3><i class="fas fa-bell"></i> Notification Settings</h3>
                    </div>
                    <div style="padding: 1.5rem;">
                        <div style="display: grid; gap: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(30, 41, 59, 0.4); border-radius: 8px;">
                                <div>
                                    <div style="font-weight: 600; color: #fff; margin-bottom: 0.25rem;">Push Notifications</div>
                                    <div style="font-size: 0.85rem; color: #94a3b8;">Receive browser notifications for alerts</div>
                                </div>
                                <button onclick="togglePushNotifications()" class="btn btn-secondary" id="push-notif-btn">
                                    Enable
                                </button>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(30, 41, 59, 0.4); border-radius: 8px;">
                                <div>
                                    <div style="font-weight: 600; color: #fff; margin-bottom: 0.25rem;">Email Notifications</div>
                                    <div style="font-size: 0.85rem; color: #94a3b8;">Get email alerts for appointments</div>
                                </div>
                                <label style="position: relative; display: inline-block; width: 50px; height: 24px;">
                                    <input type="checkbox" id="email-notif" onchange="saveSettings()" style="opacity: 0; width: 0; height: 0;">
                                    <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #64748b; border-radius: 24px; transition: 0.3s;"></span>
                                </label>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(30, 41, 59, 0.4); border-radius: 8px;">
                                <div>
                                    <div style="font-weight: 600; color: #fff; margin-bottom: 0.25rem;">Sound Alerts</div>
                                    <div style="font-size: 0.85rem; color: #94a3b8;">Play sound for critical alerts</div>
                                </div>
                                <label style="position: relative; display: inline-block; width: 50px; height: 24px;">
                                    <input type="checkbox" id="sound-alerts" onchange="saveSettings()" style="opacity: 0; width: 0; height: 0;">
                                    <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #64748b; border-radius: 24px; transition: 0.3s;"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Feature Permissions -->
                <div class="data-section">
                    <div class="section-header">
                        <h3><i class="fas fa-lock"></i> Permissions</h3>
                    </div>
                    <div style="padding: 1.5rem;">
                        <div style="display: grid; gap: 1rem;">
                            <div style="padding: 1rem; background: rgba(30, 41, 59, 0.4); border-radius: 8px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <div style="font-weight: 600; color: #fff; margin-bottom: 0.25rem;"><i class="fas fa-map-marker-alt"></i> Location Access</div>
                                        <div style="font-size: 0.85rem; color: #94a3b8;">Required for SOS Emergency features</div>
                                    </div>
                                    <button onclick="requestLocationPermission()" class="btn btn-secondary" id="location-perm-btn">
                                        Grant
                                    </button>
                                </div>
                            </div>
                            <div style="padding: 1rem; background: rgba(30, 41, 59, 0.4); border-radius: 8px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <div style="font-weight: 600; color: #fff; margin-bottom: 0.25rem;"><i class="fas fa-microphone"></i> Microphone Access</div>
                                        <div style="font-size: 0.85rem; color: #94a3b8;">For voice input and video calls</div>
                                    </div>
                                    <button onclick="requestMicrophonePermission()" class="btn btn-secondary" id="mic-perm-btn">
                                        Grant
                                    </button>
                                </div>
                            </div>
                            <div style="padding: 1rem; background: rgba(30, 41, 59, 0.4); border-radius: 8px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <div style="font-weight: 600; color: #fff; margin-bottom: 0.25rem;"><i class="fas fa-video"></i> Camera Access</div>
                                        <div style="font-size: 0.85rem; color: #94a3b8;">For video consultations</div>
                                    </div>
                                    <button onclick="requestCameraPermission()" class="btn btn-secondary" id="camera-perm-btn">
                                        Grant
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Platform Features -->
                <div class="data-section">
                    <div class="section-header">
                        <h3><i class="fas fa-star"></i> Platform Features</h3>
                    </div>
                    <div style="padding: 1.5rem;">
                        <div style="display: grid; gap: 1.5rem;">
                            ${[
                                { icon: 'fa-users', title: 'Patient Management', desc: 'AI-powered patient registration with natural language input, comprehensive records, allergy tracking' },
                                { icon: 'fa-calendar-alt', title: 'Smart Appointments', desc: 'Intelligent scheduling with automated reminders, conflict detection, calendar integration' },
                                { icon: 'fa-file-medical', title: 'Medical Encounters', desc: 'Complete documentation with vitals tracking, diagnosis recording, clinical notes' },
                                { icon: 'fa-pills', title: 'Medication Management', desc: 'Prescribing system with dosage tracking, allergy checking, medication history' },
                                { icon: 'fa-flask', title: 'Laboratory Tests', desc: 'Test ordering, result tracking, pending tests management' },
                                { icon: 'fa-exclamation-triangle', title: 'PharmaVigilance', desc: 'Real-time drug interaction monitoring with severity classification and alerts' },
                                { icon: 'fa-heartbeat', title: 'Wellness Tracking', desc: 'Log symptoms, meals, moods, workouts with guided meditation and exercises' },
                                { icon: 'fa-video', title: 'Video Consultations', desc: 'Secure WebRTC video calls with chat, screen sharing, device selection' },
                                { icon: 'fa-ambulance', title: 'SOS Emergency', desc: 'One-click emergency alerts with live GPS tracking and AI prediction' },
                                { icon: 'fa-running', title: 'Google Fit Integration', desc: 'Sync steps, heart rate, calories, sleep data automatically' },
                                { icon: 'fa-robot', title: 'AI Features', desc: 'Gemini 2.0 Flash for patient creation, appointments, encounters, voice input' },
                                { icon: 'fa-globe', title: 'Multi-language Support', desc: 'English, French, Swahili, Arabic, Amharic, Zulu, Afrikaans, Yoruba, Hausa, Igbo' }
                            ].map(f => `
                                <div style="display: flex; gap: 1rem; padding: 1rem; background: rgba(30, 41, 59, 0.4); border-radius: 8px; border-left: 3px solid #10b981;">
                                    <div style="font-size: 2rem; color: #10b981;"><i class="fas ${f.icon}"></i></div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600; color: #fff; margin-bottom: 0.25rem;">${f.title}</div>
                                        <div style="font-size: 0.85rem; color: #94a3b8; line-height: 1.5;">${f.desc}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Data Management -->
                <div class="data-section">
                    <div class="section-header">
                        <h3><i class="fas fa-database"></i> Data Management</h3>
                    </div>
                    <div style="padding: 1.5rem;">
                        <div style="display: grid; gap: 1rem;">
                            <button onclick="clearCache()" class="btn btn-secondary" style="width: 100%;">
                                <i class="fas fa-trash"></i> Clear Cache
                            </button>
                            <button onclick="exportAllData()" class="btn btn-secondary" style="width: 100%;">
                                <i class="fas fa-download"></i> Export All Data
                            </button>
                            <button onclick="showDataStats()" class="btn btn-secondary" style="width: 100%;">
                                <i class="fas fa-chart-bar"></i> View Data Statistics
                            </button>
                        </div>
                    </div>
                </div>

                <!-- About -->
                <div class="data-section">
                    <div class="section-header">
                        <h3><i class="fas fa-info-circle"></i> About MediCore</h3>
                    </div>
                    <div style="padding: 1.5rem;">
                        <div style="text-align: center; margin-bottom: 1.5rem;">
                            <div style="font-size: 3rem; margin-bottom: 1rem; color: #0ea5e9;"><i class="fas fa-hospital"></i></div>
                            <h3 style="color: #0ea5e9; margin-bottom: 0.5rem;">MediCore Health Platform</h3>
                            <p style="color: #94a3b8; margin-bottom: 1rem;">Version 1.0.0</p>
                            <p style="color: #94a3b8; line-height: 1.6;">Revolutionary healthcare platform built for the A.H.E.A.D Hackathon 2025. Empowering African healthcare with cutting-edge technology.</p>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                            <div style="text-align: center; padding: 1rem; background: rgba(30, 41, 59, 0.4); border-radius: 8px;">
                                <div style="font-size: 1.5rem; font-weight: 600; color: #10b981;">50+</div>
                                <div style="font-size: 0.85rem; color: #94a3b8;">Features</div>
                            </div>
                            <div style="text-align: center; padding: 1rem; background: rgba(30, 41, 59, 0.4); border-radius: 8px;">
                                <div style="font-size: 1.5rem; font-weight: 600; color: #3b82f6;">20+</div>
                                <div style="font-size: 0.85rem; color: #94a3b8;">API Endpoints</div>
                            </div>
                            <div style="text-align: center; padding: 1rem; background: rgba(30, 41, 59, 0.4); border-radius: 8px;">
                                <div style="font-size: 1.5rem; font-weight: 600; color: #8b5cf6;">10+</div>
                                <div style="font-size: 0.85rem; color: #94a3b8;">Languages</div>
                            </div>
                            <div style="text-align: center; padding: 1rem; background: rgba(30, 41, 59, 0.4); border-radius: 8px;">
                                <div style="font-size: 1.5rem; font-weight: 600; color: #f59e0b;">24/7</div>
                                <div style="font-size: 0.85rem; color: #94a3b8;">Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        ${Footer()}
    `;
}

// Settings Functions
window.loadSettings = function() {
    const user = firebase.auth().currentUser;
    const settings = JSON.parse(localStorage.getItem('app_settings') || '{}');
    
    if (user) {
        document.getElementById('profile-email').value = user.email;
        document.getElementById('display-name').value = user.displayName || '';
    }
    
    document.getElementById('email-notif').checked = settings.emailNotifications || false;
    document.getElementById('sound-alerts').checked = settings.soundAlerts || false;
    
    updatePermissionButtons();
}

window.saveProfile = async function(event) {
    event.preventDefault();
    const user = firebase.auth().currentUser;
    const displayName = document.getElementById('display-name').value;
    
    try {
        await user.updateProfile({ displayName });
        Swal.fire('Success!', 'Profile updated', 'success');
    } catch (error) {
        Swal.fire('Error', 'Failed to update profile', 'error');
    }
}

window.saveSettings = function() {
    const settings = {
        emailNotifications: document.getElementById('email-notif').checked,
        soundAlerts: document.getElementById('sound-alerts').checked
    };
    localStorage.setItem('app_settings', JSON.stringify(settings));
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Settings saved', showConfirmButton: false, timer: 2000 });
}

window.togglePushNotifications = async function() {
    if (typeof window.requestNotificationPermission === 'function') {
        const enabled = await window.requestNotificationPermission();
        updatePermissionButtons();
    } else {
        Swal.fire('Error', 'Notification API not available', 'error');
    }
}

window.requestLocationPermission = async function() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        Swal.fire('Success!', 'Location access granted', 'success');
        updatePermissionButtons();
    } catch (error) {
        Swal.fire('Denied', 'Location access denied', 'error');
    }
}

window.requestMicrophonePermission = async function() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        Swal.fire('Success!', 'Microphone access granted', 'success');
        updatePermissionButtons();
    } catch (error) {
        Swal.fire('Denied', 'Microphone access denied', 'error');
    }
}

window.requestCameraPermission = async function() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        Swal.fire('Success!', 'Camera access granted', 'success');
        updatePermissionButtons();
    } catch (error) {
        Swal.fire('Denied', 'Camera access denied', 'error');
    }
}

function updatePermissionButtons() {
    // Push notifications
    const pushBtn = document.getElementById('push-notif-btn');
    if (pushBtn) {
        if (Notification.permission === 'granted') {
            pushBtn.innerHTML = '<i class="fas fa-check-circle"></i> Enabled';
            pushBtn.style.background = '#10b981';
            pushBtn.disabled = true;
        }
    }
    
    // Location
    navigator.permissions?.query({ name: 'geolocation' }).then(result => {
        const locBtn = document.getElementById('location-perm-btn');
        if (locBtn && result.state === 'granted') {
            locBtn.innerHTML = '<i class="fas fa-check-circle"></i> Granted';
            locBtn.style.background = '#10b981';
            locBtn.disabled = true;
        }
    });
}

window.clearCache = function() {
    Swal.fire({
        title: 'Clear Cache?',
        text: 'This will remove all cached data',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Clear',
        confirmButtonColor: '#ef4444'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('patients_cache');
            localStorage.removeItem('appointments_cache');
            localStorage.removeItem('encounters_cache');
            Swal.fire('Cleared!', 'Cache cleared successfully', 'success');
        }
    });
}

window.exportAllData = async function() {
    Swal.fire({ title: 'Exporting...', text: 'Gathering all data', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    
    try {
        const [patientsRes, appointmentsRes, encountersRes] = await Promise.all([
            fetch(`${API_BASE}/patients`).then(r => r.json()).catch(() => []),
            fetch(`${API_BASE}/appointments`).then(r => r.json()).catch(() => []),
            fetch(`${API_BASE}/encounters`).then(r => r.json()).catch(() => [])
        ]);
        
        console.log('Patients Response:', JSON.stringify(patientsRes, null, 2));
        console.log('Appointments Response:', JSON.stringify(appointmentsRes, null, 2));
        console.log('Encounters Response:', JSON.stringify(encountersRes, null, 2));
        
        const patients = Array.isArray(patientsRes) ? patientsRes : (patientsRes?.data || patientsRes?.patients || []);
        const appointments = Array.isArray(appointmentsRes) ? appointmentsRes : (appointmentsRes?.data || appointmentsRes?.appointments || []);
        const encounters = Array.isArray(encountersRes) ? encountersRes : (encountersRes?.data || encountersRes?.encounters || []);
        
        console.log('Extracted - Patients:', patients.length, 'Appointments:', appointments.length, 'Encounters:', encounters.length);
        if (patients.length === 0) console.warn('No patients found! Check if API_BASE is correct:', API_BASE);
        
        const medications = [], tests = [];
        for (const patient of patients) {
            try {
                const [meds, labs] = await Promise.all([
                    fetch(`${API_BASE}/patients/${patient.id}/medications`).then(r => r.json()).catch(() => []),
                    fetch(`${API_BASE}/patients/${patient.id}/tests`).then(r => r.json()).catch(() => [])
                ]);
                medications.push(...meds.map(m => ({ ...m, patientId: patient.id })));
                tests.push(...labs.map(t => ({ ...t, patientId: patient.id })));
            } catch (e) {}
        }
        
        const wellness = JSON.parse(localStorage.getItem('wellness_logs') || '[]');
        const pharma = JSON.parse(localStorage.getItem('pharma_alerts') || '[]');
        const now = new Date();
        
        // Demographics Analytics
        const ageGroups = { '0-18': 0, '19-35': 0, '36-50': 0, '51-65': 0, '65+': 0 };
        const genderDist = {};
        (patients || []).forEach(p => {
            const age = p.dateOfBirth ? Math.floor((now - new Date(p.dateOfBirth)) / 31557600000) : 0;
            if (age <= 18) ageGroups['0-18']++;
            else if (age <= 35) ageGroups['19-35']++;
            else if (age <= 50) ageGroups['36-50']++;
            else if (age <= 65) ageGroups['51-65']++;
            else ageGroups['65+']++;
            genderDist[p.gender] = (genderDist[p.gender] || 0) + 1;
        });
        
        // Appointment Temporal Analytics
        const apptByHour = Array(24).fill(0);
        const apptByDay = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        const apptByMonth = {};
        const apptByStatus = {};
        appointments.forEach(a => {
            const d = new Date(a.appointmentDate);
            apptByHour[d.getHours()]++;
            apptByDay[['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]]++;
            const month = d.toISOString().slice(0, 7);
            apptByMonth[month] = (apptByMonth[month] || 0) + 1;
            apptByStatus[a.status] = (apptByStatus[a.status] || 0) + 1;
        });
        
        // Encounter Analytics
        const diagnosisDist = {};
        const symptomDist = {};
        const vitalRanges = { bp: [], hr: [], temp: [], weight: [] };
        encounters.forEach(e => {
            if (e.diagnosis) diagnosisDist[e.diagnosis] = (diagnosisDist[e.diagnosis] || 0) + 1;
            if (e.symptoms) symptomDist[e.symptoms] = (symptomDist[e.symptoms] || 0) + 1;
            if (e.bloodPressure) vitalRanges.bp.push(e.bloodPressure);
            if (e.heartRate) vitalRanges.hr.push(e.heartRate);
            if (e.temperature) vitalRanges.temp.push(e.temperature);
            if (e.weight) vitalRanges.weight.push(e.weight);
        });
        
        // Medication Analytics
        const medFrequency = {};
        const medByPatient = {};
        medications.forEach(m => {
            medFrequency[m.medicationName] = (medFrequency[m.medicationName] || 0) + 1;
            medByPatient[m.patientId] = (medByPatient[m.patientId] || 0) + 1;
        });
        
        // Lab Test Analytics
        const testTypes = {};
        tests.forEach(t => testTypes[t.testName] = (testTypes[t.testName] || 0) + 1);
        
        // Wellness Analytics
        const wellnessByType = {};
        wellness.forEach(w => wellnessByType[w.type] = (wellnessByType[w.type] || 0) + 1);
        
        // Pharma Alert Analytics
        const alertBySeverity = {};
        pharma.forEach(p => alertBySeverity[p.severity] = (alertBySeverity[p.severity] || 0) + 1);
        
        const data = {
            exportInfo: {
                exportDate: now.toISOString(),
                exportTimestamp: now.getTime(),
                version: '1.0.0',
                platform: 'MediCore Health',
                dataFormat: 'AI Training Ready',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            rawData: {
                patients: patients,
                appointments: appointments,
                encounters: encounters,
                medications: medications,
                labTests: tests,
                wellnessLogs: wellness,
                pharmaAlerts: pharma,
                settings: JSON.parse(localStorage.getItem('app_settings') || '{}')
            },
            analytics: {
                demographics: {
                    totalPatients: patients.length,
                    ageDistribution: ageGroups,
                    genderDistribution: genderDist,
                    averageAge: patients.reduce((sum, p) => sum + (p.dateOfBirth ? Math.floor((now - new Date(p.dateOfBirth)) / 31557600000) : 0), 0) / patients.length || 0
                },
                appointments: {
                    total: appointments.length,
                    byHourOfDay: apptByHour,
                    byDayOfWeek: apptByDay,
                    byMonth: apptByMonth,
                    byStatus: apptByStatus,
                    peakHour: apptByHour.indexOf(Math.max(...apptByHour)),
                    peakDay: Object.keys(apptByDay).reduce((a, b) => apptByDay[a] > apptByDay[b] ? a : b, 'Mon')
                },
                encounters: {
                    total: encounters.length,
                    topDiagnoses: Object.entries(diagnosisDist).sort((a, b) => b[1] - a[1]).slice(0, 10),
                    topSymptoms: Object.entries(symptomDist).sort((a, b) => b[1] - a[1]).slice(0, 10),
                    vitalStatistics: {
                        bloodPressure: { count: vitalRanges.bp.length, values: vitalRanges.bp },
                        heartRate: { count: vitalRanges.hr.length, values: vitalRanges.hr },
                        temperature: { count: vitalRanges.temp.length, values: vitalRanges.temp },
                        weight: { count: vitalRanges.weight.length, values: vitalRanges.weight }
                    }
                },
                medications: {
                    total: medications.length,
                    uniqueMedications: Object.keys(medFrequency).length,
                    topPrescribed: Object.entries(medFrequency).sort((a, b) => b[1] - a[1]).slice(0, 10),
                    averagePerPatient: medications.length / patients.length || 0,
                    medicationsByPatient: medByPatient
                },
                labTests: {
                    total: tests.length,
                    uniqueTests: Object.keys(testTypes).length,
                    testDistribution: testTypes,
                    averagePerPatient: tests.length / patients.length || 0
                },
                wellness: {
                    total: wellness.length,
                    byType: wellnessByType,
                    recentActivity: wellness.filter(w => new Date(w.timestamp) > new Date(now - 7*86400000)).length
                },
                pharmaVigilance: {
                    total: pharma.length,
                    bySeverity: alertBySeverity,
                    criticalAlerts: pharma.filter(p => p.severity === 'Major' || p.severity === 'Critical').length
                }
            },
            aiTrainingMetadata: {
                dataQuality: 'production',
                recordCount: patients.length + appointments.length + encounters.length + medications.length + tests.length,
                temporalRange: {
                    earliest: appointments.length ? new Date(Math.min(...appointments.map(a => new Date(a.appointmentDate)))).toISOString() : null,
                    latest: appointments.length ? new Date(Math.max(...appointments.map(a => new Date(a.appointmentDate)))).toISOString() : null
                },
                features: ['demographics', 'temporal_patterns', 'clinical_outcomes', 'medication_patterns', 'lab_results', 'wellness_tracking'],
                useCases: ['appointment_prediction', 'diagnosis_assistance', 'medication_recommendation', 'patient_risk_assessment', 'resource_optimization']
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medicore-ai-training-export-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        const msg = data.analytics.demographics.totalPatients > 0 
            ? `Exported ${data.analytics.demographics.totalPatients} patients, ${data.analytics.appointments.total} appointments with temporal analytics, peak hour: ${data.analytics.appointments.peakHour}:00`
            : 'Export completed but no data found. Check console for API response details.';
        Swal.fire('Success!', msg, data.analytics.demographics.totalPatients > 0 ? 'success' : 'warning');
    } catch (error) {
        Swal.fire('Error', 'Export failed: ' + error.message, 'error');
    }
}

// Keep old name for compatibility
window.exportData = window.exportAllData;

window.showDataStats = function() {
    const wellness = JSON.parse(localStorage.getItem('wellness_logs') || '[]');
    const pharma = JSON.parse(localStorage.getItem('pharma_alerts') || '[]');
    Swal.fire({
        title: 'Data Statistics',
        html: `<p><strong>Wellness:</strong> ${wellness.length}</p><p><strong>Pharma:</strong> ${pharma.length}</p><p><strong>Storage:</strong> ${(JSON.stringify(localStorage).length / 1024).toFixed(2)} KB</p>`,
        icon: 'info'
    });
}

window.showImportExportModal = function(type) {
    Swal.fire({
        title: `Export ${type}`,
        text: `Export ${type} data as JSON`,
        showCancelButton: true,
        confirmButtonText: 'Export'
    }).then((result) => {
        if (result.isConfirmed) {
            const data = { type, exported: new Date().toISOString() };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            Swal.fire('Success', 'Exported', 'success');
        }
    });
}
