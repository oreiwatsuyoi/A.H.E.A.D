// Import/Export functionality for MediCore

window.showImportExportModal = function(type) {
    const templates = {
        patients: {
            csv: 'first_name,last_name,email,phone_number,date_of_birth,gender,address,allergies\nJohn,Doe,john@email.com,+234-801-234-5678,1990-01-15,Male,"123 Main St, Lagos","Penicillin,Peanuts"\nJane,Smith,jane@email.com,+234-802-345-6789,1985-05-20,Female,"456 Oak Ave, Abuja",Shellfish',
            json: `[
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@email.com",
    "phone_number": "+234-801-234-5678",
    "date_of_birth": "1990-01-15",
    "gender": "Male",
    "address": "123 Main St, Lagos",
    "allergies": ["Penicillin", "Peanuts"]
  },
  {
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@email.com",
    "phone_number": "+234-802-345-6789",
    "date_of_birth": "1985-05-20",
    "gender": "Female",
    "address": "456 Oak Ave, Abuja",
    "allergies": ["Shellfish"]
  }
]`
        },
        appointments: {
            csv: 'patient,date,reason,status,summary\n1,2025-01-20T10:00:00,General Checkup,active,Annual physical examination\n2,2025-01-21T14:30:00,Follow-up,active,Post-surgery follow-up',
            json: `[
  {
    "patient": 1,
    "date": "2025-01-20T10:00:00",
    "reason": "General Checkup",
    "status": "active",
    "summary": "Annual physical examination"
  },
  {
    "patient": 2,
    "date": "2025-01-21T14:30:00",
    "reason": "Follow-up",
    "status": "active",
    "summary": "Post-surgery follow-up"
  }
]`
        },
        encounters: {
            csv: 'patient,weight,height,blood_pressure,heart_rate,temperature,symptoms,diagnosis,note\n1,70,175,120/80,72,36.6,Headache and fever,Common cold,Rest and hydration recommended\n2,65,160,130/85,80,37.2,Chest pain,Hypertension,Prescribed medication',
            json: `[
  {
    "patient": 1,
    "weight": 70,
    "height": 175,
    "blood_pressure": "120/80",
    "heart_rate": 72,
    "temperature": 36.6,
    "symptoms": "Headache and fever",
    "diagnosis": "Common cold",
    "note": "Rest and hydration recommended"
  },
  {
    "patient": 2,
    "weight": 65,
    "height": 160,
    "blood_pressure": "130/85",
    "heart_rate": 80,
    "temperature": 37.2,
    "symptoms": "Chest pain",
    "diagnosis": "Hypertension",
    "note": "Prescribed medication"
  }
]`
        }
    };

    const modalRoot = document.getElementById('modal-root');
    modalRoot.innerHTML = `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal" onclick="event.stopPropagation()" style="max-width: 900px;">
                <div class="modal-header">
                    <h2>Import/Export ${type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                    <button class="close-btn" onclick="closeModal()">${icons.close}</button>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                    <div>
                        <h3 style="color: #0ea5e9; margin-bottom: 1rem;">📥 Import Data</h3>
                        <div style="margin-bottom: 1rem;">
                            <label class="form-label">Select Format</label>
                            <select id="import-format" class="form-select" onchange="updateImportUI()">
                                <option value="csv">CSV</option>
                                <option value="json">JSON</option>
                            </select>
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label class="form-label">Upload File</label>
                            <input type="file" id="import-file" class="form-input" accept=".csv,.json" onchange="handleFileUpload('${type}')">
                        </div>
                        <button class="btn btn-primary" onclick="importData('${type}')" style="width: 100%;">
                            ${icons.check} Import Data
                        </button>
                    </div>
                    
                    <div>
                        <h3 style="color: #10b981; margin-bottom: 1rem;">📤 Export Data</h3>
                        <div style="margin-bottom: 1rem;">
                            <label class="form-label">Select Format</label>
                            <select id="export-format" class="form-select">
                                <option value="csv">CSV</option>
                                <option value="json">JSON</option>
                            </select>
                        </div>
                        <button class="btn btn-success" onclick="exportData('${type}')" style="width: 100%; background: #10b981;">
                            ${icons.arrow} Export Data
                        </button>
                    </div>
                </div>
                
                <div style="background: rgba(30, 41, 59, 0.4); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #8b5cf6;">
                    <h3 style="color: #8b5cf6; margin-bottom: 1rem;">📋 Template & Instructions</h3>
                    
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <button onclick="showTemplate('${type}', 'csv')" class="btn btn-secondary" style="flex: 1;">
                                Download CSV Template
                            </button>
                            <button onclick="showTemplate('${type}', 'json')" class="btn btn-secondary" style="flex: 1;">
                                Download JSON Template
                            </button>
                        </div>
                    </div>
                    
                    <div style="background: rgba(15, 23, 42, 0.6); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <h4 style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 0.5rem;">CSV Template:</h4>
                        <pre style="color: #cbd5e1; font-size: 0.75rem; overflow-x: auto; margin: 0;">${templates[type].csv}</pre>
                    </div>
                    
                    <div style="background: rgba(15, 23, 42, 0.6); padding: 1rem; border-radius: 8px;">
                        <h4 style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 0.5rem;">JSON Template:</h4>
                        <pre style="color: #cbd5e1; font-size: 0.75rem; overflow-x: auto; margin: 0;">${templates[type].json}</pre>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.showTemplate = function(type, format) {
    const templates = {
        patients: {
            csv: 'first_name,last_name,email,phone_number,date_of_birth,gender,address,allergies\nJohn,Doe,john@email.com,+234-801-234-5678,1990-01-15,Male,"123 Main St, Lagos","Penicillin,Peanuts"\nJane,Smith,jane@email.com,+234-802-345-6789,1985-05-20,Female,"456 Oak Ave, Abuja",Shellfish',
            json: `[
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@email.com",
    "phone_number": "+234-801-234-5678",
    "date_of_birth": "1990-01-15",
    "gender": "Male",
    "address": "123 Main St, Lagos",
    "allergies": ["Penicillin", "Peanuts"]
  }
]`
        },
        appointments: {
            csv: 'patient,date,reason,status,summary\n1,2025-01-20T10:00:00,General Checkup,active,Annual physical examination',
            json: `[
  {
    "patient": 1,
    "date": "2025-01-20T10:00:00",
    "reason": "General Checkup",
    "status": "active",
    "summary": "Annual physical examination"
  }
]`
        },
        encounters: {
            csv: 'patient,weight,height,blood_pressure,heart_rate,temperature,symptoms,diagnosis,note\n1,70,175,120/80,72,36.6,Headache and fever,Common cold,Rest and hydration recommended',
            json: `[
  {
    "patient": 1,
    "weight": 70,
    "height": 175,
    "blood_pressure": "120/80",
    "heart_rate": 72,
    "temperature": 36.6,
    "symptoms": "Headache and fever",
    "diagnosis": "Common cold",
    "note": "Rest and hydration recommended"
  }
]`
        }
    };

    const content = templates[type][format];
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.${format}`;
    a.click();
    URL.revokeObjectURL(url);
};

let uploadedData = null;

window.handleFileUpload = function(type) {
    const file = document.getElementById('import-file').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const format = document.getElementById('import-format').value;

        try {
            if (format === 'json') {
                uploadedData = JSON.parse(content);
            } else {
                uploadedData = parseCSV(content);
            }
            Swal.fire('Success', `File loaded: ${uploadedData.length} records`, 'success');
        } catch (error) {
            Swal.fire('Error', 'Invalid file format', 'error');
        }
    };
    reader.readAsText(file);
};

function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g).map(v => v.replace(/^"|"$/g, '').trim());
        const obj = {};
        headers.forEach((header, index) => {
            let value = values[index];
            if (header === 'allergies' && value) {
                obj[header] = value.split(',').map(a => a.trim());
            } else if (['weight', 'height', 'heart_rate', 'temperature', 'patient'].includes(header)) {
                obj[header] = parseFloat(value) || value;
            } else {
                obj[header] = value;
            }
        });
        data.push(obj);
    }
    return data;
}

window.importData = async function(type) {
    if (!uploadedData || uploadedData.length === 0) {
        Swal.fire('Error', 'Please upload a file first', 'error');
        return;
    }

    try {
        Swal.fire({ title: 'Importing...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        let successCount = 0;
        let errorCount = 0;

        for (const item of uploadedData) {
            try {
                if (type === 'patients') {
                    await apiCall('/patients/create', 'POST', item);
                } else if (type === 'appointments') {
                    await apiCall('/appointments', 'POST', item);
                } else if (type === 'encounters') {
                    await apiCall('/encounters', 'POST', item);
                }
                successCount++;
            } catch (error) {
                errorCount++;
                console.error('Import error:', error);
            }
        }

        Swal.fire('Import Complete', `Success: ${successCount}, Failed: ${errorCount}`, successCount > 0 ? 'success' : 'error');
        closeModal();
        
        if (type === 'patients') loadPatients();
        else if (type === 'appointments') loadAppointments();
        else if (type === 'encounters') loadEncounters();
        
        uploadedData = null;
    } catch (error) {
        Swal.fire('Error', 'Import failed', 'error');
    }
};

window.exportData = async function(type) {
    try {
        Swal.fire({ title: 'Exporting...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        let data;
        if (type === 'patients') {
            const response = await apiCall('/patients');
            data = response.results || [];
        } else if (type === 'appointments') {
            const response = await apiCall('/appointments');
            data = response.results || [];
        } else if (type === 'encounters') {
            const response = await apiCall('/encounters');
            data = response.results || [];
        }

        const format = document.getElementById('export-format').value;
        let content, mimeType, extension;

        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            extension = 'json';
        } else {
            content = convertToCSV(data);
            mimeType = 'text/csv';
            extension = 'csv';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.${extension}`;
        a.click();
        URL.revokeObjectURL(url);

        Swal.fire('Success', `Exported ${data.length} records`, 'success');
    } catch (error) {
        Swal.fire('Error', 'Export failed', 'error');
    }
};

function convertToCSV(data) {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
        const values = headers.map(header => {
            let value = row[header];
            if (Array.isArray(value)) {
                value = value.join(',');
            }
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            return value ?? '';
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}
