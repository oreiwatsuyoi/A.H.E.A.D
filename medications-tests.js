// Medications Page
function MedicationsPage() {
    return `
        ${Sidebar()}
        <main class="main-content">
            <div class="data-section">
                <div class="section-header">
                    <h2>Medication Management</h2>
                    <div class="search-bar">
                        <input type="text" class="search-input" placeholder="Search medications..." 
                               oninput="searchMedications(this.value)">
                        <button class="btn btn-primary" onclick="showModal('createMedication')">
                            ${icons.plus} Add Medication
                        </button>
                    </div>
                </div>
                <div id="medications-list">
                    <div class="loading"><div class="spinner"></div><p>Loading medications...</p></div>
                </div>
            </div>
        </main>
    `;
}

async function loadMedications(search = '') {
    const listEl = document.getElementById('medications-list');
    if (!listEl) return;
    
    try {
        const params = search ? `?search=${encodeURIComponent(search)}` : '';
        const data = await apiCall(`/encounter-medications${params}`);
        const medications = data.results || [];
        
        listEl.innerHTML = medications.length > 0 ? `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Patient ID</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${medications.map(m => `
                        <tr>
                            <td>#${m.id}</td>
                            <td><strong>${m.name}</strong></td>
                            <td>#${m.patient}</td>
                            <td>${m.dosage || 'N/A'}</td>
                            <td>${m.frequency || 'N/A'}</td>
                            <td>${m.start_date ? new Date(m.start_date).toLocaleDateString() : 'N/A'}</td>
                            <td>${m.end_date ? new Date(m.end_date).toLocaleDateString() : 'Ongoing'}</td>
                            <td><span class="badge ${m.status === 'active' ? 'badge-success' : 'badge-warning'}">${m.status || 'active'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : `
            <div class="empty-state">
                <div class="empty-icon">${icons.medications}</div>
                <h3>No medications found</h3>
                <p>Start by adding a medication prescription</p>
                <button class="btn btn-primary" onclick="showModal('createMedication')" style="margin-top: 1rem;">
                    ${icons.plus} Add Medication
                </button>
            </div>
        `;
    } catch (error) {
        if (listEl) listEl.innerHTML = '<p style="color: #ef4444;">Error loading medications</p>';
    }
}

let medicationSearchTimeout;
function searchMedications(value) {
    clearTimeout(medicationSearchTimeout);
    medicationSearchTimeout = setTimeout(() => loadMedications(value), 300);
}

// Lab Tests Page
function TestsPage() {
    return `
        ${Sidebar()}
        <main class="main-content">
            <div class="data-section">
                <div class="section-header">
                    <h2>Laboratory Tests</h2>
                    <div class="search-bar">
                        <input type="text" class="search-input" placeholder="Search tests..." 
                               oninput="searchTests(this.value)">
                        <button class="btn btn-primary" onclick="showModal('createTest')">
                            ${icons.plus} Order Test
                        </button>
                    </div>
                </div>
                <div id="tests-list">
                    <div class="loading"><div class="spinner"></div><p>Loading tests...</p></div>
                </div>
            </div>
        </main>
    `;
}

async function loadTests(search = '') {
    const listEl = document.getElementById('tests-list');
    if (!listEl) return;
    
    try {
        const params = search ? `?search=${encodeURIComponent(search)}` : '';
        const data = await apiCall(`/encounter-tests${params}`);
        const tests = data.results || [];
        
        listEl.innerHTML = tests.length > 0 ? `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Test Name</th>
                        <th>Patient ID</th>
                        <th>Ordered Date</th>
                        <th>Result Date</th>
                        <th>Result</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${tests.map(t => `
                        <tr>
                            <td>#${t.id}</td>
                            <td><strong>${t.test_name}</strong></td>
                            <td>#${t.patient}</td>
                            <td>${new Date(t.ordered_date).toLocaleDateString()}</td>
                            <td>${t.result_date ? new Date(t.result_date).toLocaleDateString() : 'Pending'}</td>
                            <td>${t.result || 'Pending'}</td>
                            <td><span class="badge ${t.status === 'completed' ? 'badge-success' : t.status === 'pending' ? 'badge-warning' : 'badge-info'}">${t.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : `
            <div class="empty-state">
                <div class="empty-icon">${icons.tests}</div>
                <h3>No lab tests found</h3>
                <p>Start by ordering a laboratory test</p>
                <button class="btn btn-primary" onclick="showModal('createTest')" style="margin-top: 1rem;">
                    ${icons.plus} Order Test
                </button>
            </div>
        `;
    } catch (error) {
        if (listEl) listEl.innerHTML = '<p style="color: #ef4444;">Error loading tests</p>';
    }
}

let testSearchTimeout;
function searchTests(value) {
    clearTimeout(testSearchTimeout);
    testSearchTimeout = setTimeout(() => loadTests(value), 300);
}
