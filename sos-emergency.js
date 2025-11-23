// SOS Emergency System
console.log('🆘 SOS Emergency System loaded');
const SOS_GEMINI_API_KEY = 'AIzaSyC_zk6RFUUqiuSuVOTZVhYQDx_E_wfGpIY';
const SOS_GOOGLE_MAPS_API_KEY = window.GOOGLE_MAPS_API_KEY || 'AIzaSyC_zk6RFUUqiuSuVOTZVhYQDx_E_wfGpIY';

let sosActive = false;
let locationWatchId = null;
let currentLocation = null;

// Initialize SOS Widget
window.initSOSWidget = function() {
    console.log('🆘 initSOSWidget called');
    const widget = document.createElement('div');
    widget.id = 'sos-widget';
    widget.innerHTML = `
        <button id="sos-button" onclick="triggerSOS()" style="
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.5), rgba(220, 38, 38, 0.5));
            border: none;
            outline: none;
            box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: all 0.3s ease;
            position: relative;
            animation: pulse-sos 2s infinite;
            backdrop-filter: blur(10px);
            -webkit-tap-highlight-color: transparent;
        " onmouseover="this.style.transform='scale(1.1)'; this.style.background='linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))'" onmouseout="this.style.transform='scale(1)'; this.style.background='linear-gradient(135deg, rgba(239, 68, 68, 0.5), rgba(220, 38, 38, 0.5))'">
            <span style="font-weight: 900; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 16px;">SOS</span>
        </button>
    `;
    
    widget.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9997;
    `;
    
    document.body.appendChild(widget);
    
    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-sos {
            0%, 100% { box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4); }
            50% { box-shadow: 0 8px 32px rgba(239, 68, 68, 0.8), 0 0 0 10px rgba(239, 68, 68, 0.2); }
        }
        @media (max-width: 1024px) {
            #sos-widget { bottom: 100px !important; }
        }
    `;
    document.head.appendChild(style);
}

// Trigger SOS Emergency
window.triggerSOS = async function() {
    if (sosActive) {
        Swal.fire('SOS Active', 'Emergency alert already in progress', 'info');
        return;
    }
    
    showSOSCountdown();
}

function showSOSCountdown() {
    let countdown = 8;
    let cancelled = false;
    
    const overlay = document.createElement('div');
    overlay.id = 'sos-countdown-overlay';
    overlay.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); backdrop-filter: blur(20px); z-index: 99999; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center; max-width: 500px; padding: 3rem;">
                <div style="width: 200px; height: 200px; margin: 0 auto 2rem; position: relative;">
                    <svg width="200" height="200" style="transform: rotate(-90deg);">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(239, 68, 68, 0.2)" stroke-width="12"/>
                        <circle id="sos-progress-circle" cx="100" cy="100" r="90" fill="none" stroke="#ef4444" stroke-width="12" stroke-dasharray="565" stroke-dashoffset="0" style="transition: stroke-dashoffset 1s linear;"/>
                    </svg>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 4rem; font-weight: 900; color: #ef4444; text-shadow: 0 0 30px rgba(239, 68, 68, 0.5);" id="sos-countdown-number">8</div>
                </div>
                
                <h2 style="color: #fff; font-size: 2rem; font-weight: 700; margin-bottom: 1rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">Emergency Alert Activating</h2>
                <p style="color: #94a3b8; font-size: 1.1rem; margin-bottom: 2rem; line-height: 1.6;">Rescue team will be notified with your location and medical records</p>
                
                <button onclick="cancelSOSCountdown()" style="padding: 1rem 3rem; background: linear-gradient(135deg, #ef4444, #dc2626); border: none; border-radius: 16px; color: white; font-size: 1.1rem; font-weight: 700; cursor: pointer; box-shadow: 0 8px 30px rgba(239, 68, 68, 0.4); transition: all 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    CANCEL
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    const interval = setInterval(() => {
        countdown--;
        const numberEl = document.getElementById('sos-countdown-number');
        const circleEl = document.getElementById('sos-progress-circle');
        
        if (numberEl) numberEl.textContent = countdown;
        if (circleEl) {
            const offset = (countdown / 8) * 565;
            circleEl.style.strokeDashoffset = offset;
        }
        
        if (countdown <= 0) {
            clearInterval(interval);
            if (!cancelled) {
                overlay.remove();
                activateEmergency();
            }
        }
    }, 1000);
    
    window.cancelSOSCountdown = function() {
        cancelled = true;
        clearInterval(interval);
        overlay.remove();
        
        const toast = document.createElement('div');
        toast.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: rgba(30, 41, 59, 0.95); backdrop-filter: blur(10px); padding: 1rem 1.5rem; border-radius: 12px; border-left: 4px solid #10b981; box-shadow: 0 8px 30px rgba(0,0,0,0.3); z-index: 100000; animation: slideIn 0.3s ease;">
                <div style="color: #10b981; font-weight: 600; font-size: 0.9rem;">✓ Emergency Cancelled</div>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };
}

// Activate Emergency System
async function activateEmergency() {
    console.log('🚨 ===== EMERGENCY ACTIVATION START =====');
    sosActive = true;
    
    Swal.fire({
        title: '🚨 Activating Emergency System',
        html: '<div class="spinner"></div><p>Gathering your information...</p>',
        allowOutsideClick: false,
        showConfirmButton: false
    });
    
    try {
        console.log('📍 Step 1: Getting current location...');
        const location = await getCurrentLocation();
        currentLocation = location;
        console.log('✅ Location obtained:', location);
        
        console.log('📍 Step 2: Starting live location tracking...');
        startLocationTracking();
        console.log('✅ Location tracking started');
        
        console.log('👤 Step 3: Getting user email...');
        const userEmail = firebase.app('sos-emergency').auth().currentUser?.email || localStorage.getItem('userEmail');
        console.log('📧 User email:', userEmail);
        
        if (!userEmail) {
            console.error('❌ No user email found');
            throw new Error('Please login to use emergency services');
        }
        
        console.log('📄 Step 4: Fetching all patients from API...');
        const patients = await apiCall('/patients');
        console.log('✅ Patients fetched. Total:', patients.results?.length || 0);
        console.log('🔍 Step 5: Finding patient with email:', userEmail);
        const patient = patients.results?.find(p => p.email === userEmail);
        
        if (!patient) {
            console.warn('⚠️ Patient not found for email:', userEmail);
            console.log('📋 Creating emergency alert for non-patient user');
            // Create basic user data from Firebase auth
            const basicUser = {
                id: 'guest-' + Date.now(),
                first_name: firebase.auth().currentUser?.displayName?.split(' ')[0] || 'Guest',
                last_name: firebase.auth().currentUser?.displayName?.split(' ').slice(1).join(' ') || 'User',
                email: userEmail,
                age: 'Unknown',
                gender: 'Unknown',
                phone_number: null,
                allergies: [],
                address: null
            };
            console.log('✅ Using basic user data:', basicUser.first_name, basicUser.last_name);
            
            // Create emergency with basic data
            const emergencyData = {
                timestamp: Date.now(),
                patient: {
                    id: basicUser.id,
                    name: `${basicUser.first_name} ${basicUser.last_name}`,
                    age: basicUser.age,
                    gender: basicUser.gender,
                    email: basicUser.email,
                    phone: basicUser.phone_number,
                    allergies: [],
                    address: basicUser.address
                },
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    accuracy: location.accuracy,
                    timestamp: location.timestamp,
                    address: await reverseGeocode(location.latitude, location.longitude)
                },
                medicalHistory: {
                    appointments: 0,
                    encounters: [],
                    medications: [],
                    tests: []
                },
                aiPrediction: 'No medical history available. User is not registered as a patient. Rescue team should assess on arrival.',
                status: 'ACTIVE'
            };
            
            console.log('🔥 Step 9: Saving to Firebase...');
            await saveEmergencyToFirebase(emergencyData);
            console.log('✅ Saved to Firebase successfully');
            
            console.log('🔔 Step 10: Sending notifications...');
            await sendEmergencyNotifications(emergencyData);
            console.log('✅ Notifications sent');
            
            console.log('📺 Step 11: Showing tracking UI...');
            showEmergencyTrackingUI(emergencyData);
            console.log('✅ ===== EMERGENCY ACTIVATION COMPLETE =====');
            return;
        }
        console.log('✅ Patient found:', patient.first_name, patient.last_name, '(ID:', patient.id, ')');
        
        console.log('🏥 Step 6: Gathering medical data for patient ID:', patient.id);
        const [appointments, encounters, medications, tests] = await Promise.all([
            apiCall(`/patients/${patient.id}/appointments`).catch(() => ({results: []})),
            apiCall(`/patients/${patient.id}/encounters`).catch(() => ({results: []})),
            apiCall(`/patients/${patient.id}/medications`).catch(() => ({results: []})),
            apiCall(`/patients/${patient.id}/tests`).catch(() => ({results: []}))
        ]);
        console.log('✅ Medical data gathered:');
        console.log('  - Appointments:', appointments.results?.length || 0);
        console.log('  - Encounters:', encounters.results?.length || 0);
        console.log('  - Medications:', medications.results?.length || 0);
        console.log('  - Tests:', tests.results?.length || 0);
        
        console.log('🤖 Step 7: Getting AI emergency prediction...');
        const prediction = await predictEmergency(patient, encounters.results, medications.results);
        console.log('✅ AI prediction received:', prediction.substring(0, 100) + '...');
        
        console.log('📦 Step 8: Creating emergency data package...');
        const emergencyData = {
            timestamp: Date.now(),
            patient: {
                id: patient.id,
                name: `${patient.first_name} ${patient.last_name}`,
                age: patient.age,
                gender: patient.gender,
                email: patient.email,
                phone: patient.phone_number,
                allergies: patient.allergies || [],
                address: patient.address
            },
            location: {
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy,
                timestamp: location.timestamp,
                address: await reverseGeocode(location.latitude, location.longitude)
            },
            medicalHistory: {
                appointments: appointments.results?.length || 0,
                encounters: encounters.results?.slice(0, 5) || [],
                medications: medications.results || [],
                tests: tests.results || []
            },
            aiPrediction: prediction,
            status: 'ACTIVE'
        };
        console.log('✅ Emergency data package created');
        
        console.log('🔥 Step 9: Saving to Firebase...');
        console.log('Firebase database URL:', window.sosDatabase?.ref()?.toString());
        await saveEmergencyToFirebase(emergencyData);
        console.log('✅ Saved to Firebase successfully');
        
        console.log('🔔 Step 10: Sending notifications...');
        await sendEmergencyNotifications(emergencyData);
        console.log('✅ Notifications sent');
        
        console.log('📺 Step 11: Showing tracking UI...');
        showEmergencyTrackingUI(emergencyData);
        console.log('✅ ===== EMERGENCY ACTIVATION COMPLETE =====');
        
    } catch (error) {
        console.error('❌ ===== EMERGENCY ACTIVATION ERROR =====');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('❌ ===== ERROR END =====');
        sosActive = false;
        Swal.fire('Error', error.message || 'Failed to activate emergency system', 'error');
    }
}

// Get Current Location
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        
        console.log('📍 Requesting high-accuracy location (may take 30-60s)...');
        
        let bestPosition = null;
        let attempts = 0;
        const maxAttempts = 2;
        
        const tryGetLocation = () => {
            attempts++;
            console.log(`🔄 Location attempt ${attempts}/${maxAttempts}`);
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const accuracy = position.coords.accuracy;
                    console.log(`📍 Got location: ${position.coords.latitude}, ${position.coords.longitude}, Accuracy: ${accuracy}m`);
                    
                    if (!bestPosition || accuracy < bestPosition.coords.accuracy) {
                        bestPosition = position;
                        console.log('✅ Better accuracy found:', accuracy + 'm');
                    }
                    
                    // If accuracy is good enough (< 100m) or max attempts reached, resolve
                    if (accuracy < 100 || attempts >= maxAttempts) {
                        localStorage.setItem('location_permission', 'granted');
                        console.log('✅ Final location:', bestPosition.coords.latitude, bestPosition.coords.longitude, 'Accuracy:', bestPosition.coords.accuracy + 'm');
                        resolve({
                            latitude: bestPosition.coords.latitude,
                            longitude: bestPosition.coords.longitude,
                            accuracy: bestPosition.coords.accuracy,
                            timestamp: bestPosition.timestamp
                        });
                    } else {
                        // Try again for better accuracy
                        console.log('⏳ Accuracy not good enough, trying again...');
                        setTimeout(tryGetLocation, 2000);
                    }
                },
                (error) => {
                    console.error('❌ Geolocation error:', error.code, error.message);
                    
                    if (bestPosition) {
                        console.log('⚠️ Using best available position despite error');
                        localStorage.setItem('location_permission', 'granted');
                        resolve({
                            latitude: bestPosition.coords.latitude,
                            longitude: bestPosition.coords.longitude,
                            accuracy: bestPosition.coords.accuracy,
                            timestamp: bestPosition.timestamp
                        });
                    } else {
                        localStorage.setItem('location_permission', 'denied');
                        if (error.code === 1) {
                            reject(new Error('Location permission denied. Click the lock icon in your browser address bar and allow location access.'));
                        } else if (error.code === 2) {
                            reject(new Error('Location unavailable. Please check your device GPS settings.'));
                        } else if (error.code === 3) {
                            reject(new Error('Location request timed out. Please try again.'));
                        } else {
                            reject(new Error('Failed to get location: ' + error.message));
                        }
                    }
                },
                { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
            );
        };
        
        tryGetLocation();
    });
}

// Start Live Location Tracking
function startLocationTracking() {
    if (locationWatchId) return;
    
    locationWatchId = navigator.geolocation.watchPosition(
        async (position) => {
            currentLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp
            };
            
            // Update Firebase with new location
            const emergencyRef = window.sosDatabase.ref('emergencies').orderByChild('status').equalTo('ACTIVE').limitToLast(1);
            emergencyRef.once('value', (snapshot) => {
                snapshot.forEach((child) => {
                    child.ref.update({
                        'location/latitude': currentLocation.latitude,
                        'location/longitude': currentLocation.longitude,
                        'location/timestamp': currentLocation.timestamp
                    });
                });
            });
        },
        (error) => console.error('Location tracking error:', error),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
}

// Stop Location Tracking
function stopLocationTracking() {
    if (locationWatchId) {
        navigator.geolocation.clearWatch(locationWatchId);
        locationWatchId = null;
    }
}

// Predict Emergency Situation using AI
async function predictEmergency(patient, encounters, medications) {
    try {
        const recentEncounters = encounters.slice(0, 3);
        const context = `
Patient: ${patient.first_name} ${patient.last_name}, ${patient.age} years old, ${patient.gender}
Allergies: ${patient.allergies?.join(', ') || 'None'}
Recent Encounters: ${recentEncounters.map(e => `${e.diagnosis || 'N/A'} - ${e.symptoms || 'N/A'}`).join('; ')}
Current Medications: ${medications.map(m => m.name).join(', ') || 'None'}

Based on this medical history, predict the most likely emergency situations this patient might be experiencing right now. Provide:
1. Top 3 possible emergency scenarios (most to least likely)
2. Critical symptoms to watch for
3. Immediate first aid recommendations
4. What the rescue team should prepare

Be concise and medical-focused.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${SOS_GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: context }] }]
            })
        });
        
        const result = await response.json();
        return result.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('AI prediction error:', error);
        return 'Unable to generate prediction. Rescue team will assess on arrival.';
    }
}

// Reverse Geocode Location
async function reverseGeocode(lat, lng) {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${SOS_GOOGLE_MAPS_API_KEY}`);
        const data = await response.json();
        return data.results[0]?.formatted_address || `${lat}, ${lng}`;
    } catch (error) {
        return `${lat}, ${lng}`;
    }
}

// Save Emergency to Firebase
async function saveEmergencyToFirebase(data) {
    console.log('🔥 saveEmergencyToFirebase called');
    console.log('Checking sosDatabase:', typeof window.sosDatabase);
    
    if (!window.sosDatabase) {
        console.error('❌ window.sosDatabase is undefined!');
        throw new Error('SOS Firebase not initialized');
    }
    
    console.log('Creating Firebase reference...');
    const emergencyRef = window.sosDatabase.ref('emergencies').push();
    console.log('Firebase reference created:', emergencyRef.toString());
    
    console.log('Saving data to Firebase...');
    await emergencyRef.set(data);
    console.log('✅ Data saved to Firebase with key:', emergencyRef.key);
    
    // Also save to localStorage as backup
    console.log('Saving to localStorage as backup...');
    const emergencies = JSON.parse(localStorage.getItem('emergency_alerts') || '[]');
    emergencies.unshift(data);
    localStorage.setItem('emergency_alerts', JSON.stringify(emergencies));
    console.log('✅ Saved to localStorage');
    
    return emergencyRef.key;
}

// Send Emergency Notifications
async function sendEmergencyNotifications(data) {
    // Send push notification to all doctors
    if (typeof window.sendPushNotification === 'function') {
        await window.sendPushNotification({
            title: '🚨 EMERGENCY ALERT',
            body: `${data.patient.name} needs immediate assistance at ${data.location.address}`,
            icon: 'logo.jpeg',
            tag: 'emergency-alert',
            requireInteraction: true
        });
    }
    
    // Store in localStorage for doctor dashboard
    const alerts = JSON.parse(localStorage.getItem('emergency_alerts') || '[]');
    alerts.unshift(data);
    localStorage.setItem('emergency_alerts', JSON.stringify(alerts));
}

// Show Emergency Tracking UI
function showEmergencyTrackingUI(data) {
    Swal.fire({
        title: '🚨 Emergency Alert Sent',
        html: `
            <div style="text-align: left; padding: 1rem;">
                <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p style="color: #991b1b; font-weight: 600; margin: 0;">Rescue team has been notified</p>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <strong style="color: #374151;">Your Location:</strong>
                    <p style="color: #6b7280; font-size: 0.9rem; margin: 0.5rem 0;">${data.location.address}</p>
                    <p style="color: #6b7280; font-size: 0.85rem; margin: 0;">📍 ${data.location.latitude.toFixed(6)}, ${data.location.longitude.toFixed(6)}</p>
                </div>
                
                <div style="background: #dbeafe; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong style="color: #1e40af;">🤖 AI Prediction:</strong>
                    <p style="color: #1e3a8a; font-size: 0.85rem; margin: 0.5rem 0; white-space: pre-wrap;">${data.aiPrediction.substring(0, 200)}...</p>
                </div>
                
                <div style="text-align: center; margin-top: 1.5rem;">
                    <div class="spinner" style="margin: 0 auto 1rem;"></div>
                    <p style="color: #10b981; font-weight: 600;">🚑 Help is on the way</p>
                    <p style="color: #6b7280; font-size: 0.85rem;">Your location is being tracked in real-time</p>
                </div>
            </div>
        `,
        icon: 'success',
        confirmButtonText: 'View Tracking',
        showCancelButton: true,
        cancelButtonText: 'Close',
        confirmButtonColor: '#dc2626',
        allowOutsideClick: true
    }).then((result) => {
        if (result.isConfirmed) {
            showLiveTracking(data);
        }
    });
}

// Show Live Tracking Map
function showLiveTracking(data) {
    const modalRoot = document.getElementById('modal-root');
    modalRoot.innerHTML = `
        <div class="modal-overlay" style="background: rgba(0,0,0,0.95);" onclick="closeModal()">
            <div class="modal" style="max-width: 1200px; height: 90vh; display: flex; flex-direction: column;" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2>🚨 Emergency Tracking (Active)</h2>
                    <button class="close-btn" onclick="closeModal()">✕</button>
                </div>
                <div style="flex: 1; display: grid; grid-template-columns: 1fr 400px; gap: 1rem; padding: 1rem; overflow: hidden;">
                    <div style="position: relative; border-radius: 12px; overflow: hidden;">
                        <div id="emergency-map" style="width: 100%; height: 100%;"></div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 1rem; overflow-y: auto;">
                        <div style="background: linear-gradient(135deg, #fee2e2, #fecaca); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #dc2626;">
                            <h3 style="color: #991b1b; margin: 0 0 0.5rem 0;">Status: Active</h3>
                            <p style="color: #7f1d1d; margin: 0; font-size: 0.9rem;">Rescue team notified • Live tracking enabled</p>
                        </div>
                        
                        <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid #e5e7eb;">
                            <h4 style="color: #374151; margin: 0 0 1rem 0;">Patient Information</h4>
                            <div style="display: grid; gap: 0.5rem; font-size: 0.9rem;">
                                <p style="margin: 0;"><strong>Name:</strong> ${data.patient.name}</p>
                                <p style="margin: 0;"><strong>Age:</strong> ${data.patient.age} • <strong>Gender:</strong> ${data.patient.gender}</p>
                                <p style="margin: 0;"><strong>Phone:</strong> ${data.patient.phone || 'N/A'}</p>
                                <p style="margin: 0;"><strong>Allergies:</strong> ${data.patient.allergies?.join(', ') || 'None'}</p>
                            </div>
                        </div>
                        
                        <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid #e5e7eb;">
                            <h4 style="color: #374151; margin: 0 0 1rem 0;">Current Medications</h4>
                            <div style="max-height: 150px; overflow-y: auto;">
                                ${data.medicalHistory.medications.length > 0 ? 
                                    data.medicalHistory.medications.map(m => `
                                        <div style="padding: 0.5rem; background: #f9fafb; border-radius: 6px; margin-bottom: 0.5rem;">
                                            <strong style="color: #1f2937;">${m.name}</strong>
                                            <p style="margin: 0; font-size: 0.85rem; color: #6b7280;">${m.dosage || ''} ${m.frequency || ''}</p>
                                        </div>
                                    `).join('') : 
                                    '<p style="color: #6b7280; margin: 0;">No current medications</p>'
                                }
                            </div>
                        </div>
                        
                        <div style="background: #dbeafe; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6;">
                            <h4 style="color: #1e40af; margin: 0 0 1rem 0;">🤖 AI Prediction</h4>
                            <div style="max-height: 200px; overflow-y: auto; font-size: 0.85rem; color: #1e3a8a; white-space: pre-wrap; line-height: 1.6;">
                                ${data.aiPrediction}
                            </div>
                        </div>
                        
                        <button onclick="closeModal()" style="width: 100%; padding: 0.75rem; background: rgba(255,255,255,0.1); color: #94a3b8; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; font-weight: 600; cursor: pointer; margin-bottom: 0.5rem;">
                            Close Tracking View
                        </button>
                        <button onclick="cancelEmergency()" style="width: 100%; padding: 1rem; background: #dc2626; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            Cancel Emergency
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize map
    setTimeout(() => initEmergencyMap(data), 100);
}

// Initialize Emergency Map
function initEmergencyMap(data) {
    if (window.google && window.google.maps) {
        renderEmergencyMap();
        return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${SOS_GOOGLE_MAPS_API_KEY}&loading=async&callback=renderEmergencyMap`;
    script.async = true;
    script.defer = true;
    
    window.renderEmergencyMap = function() {
        const map = new google.maps.Map(document.getElementById('emergency-map'), {
            center: { lat: data.location.latitude, lng: data.location.longitude },
            zoom: 18,
            mapTypeId: 'hybrid',
            styles: [
                { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                { featureType: 'transit', stylers: [{ visibility: 'off' }] }
            ]
        });
        
        const marker = new google.maps.Marker({
            position: { lat: data.location.latitude, lng: data.location.longitude },
            map: map,
            title: 'Your Location',
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 15,
                fillColor: '#dc2626',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3
            },
            animation: google.maps.Animation.BOUNCE
        });
        
        const circle = new google.maps.Circle({
            map: map,
            center: { lat: data.location.latitude, lng: data.location.longitude },
            radius: data.location.accuracy,
            fillColor: '#dc2626',
            fillOpacity: 0.2,
            strokeColor: '#dc2626',
            strokeOpacity: 0.5,
            strokeWeight: 2
        });
        
        // Update marker position in real-time
        const updateInterval = setInterval(() => {
            if (!sosActive || !currentLocation) {
                clearInterval(updateInterval);
                return;
            }
            
            const newPos = { lat: currentLocation.latitude, lng: currentLocation.longitude };
            marker.setPosition(newPos);
            circle.setCenter(newPos);
            circle.setRadius(currentLocation.accuracy);
            map.panTo(newPos);
        }, 3000);
    };
    
    document.head.appendChild(script);
}

// Cancel Emergency
window.cancelEmergency = async function() {
    const result = await Swal.fire({
        title: 'Cancel Emergency?',
        text: 'Are you sure you want to cancel the emergency alert?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Cancel',
        cancelButtonText: 'No, Keep Active',
        confirmButtonColor: '#dc2626'
    });
    
    if (result.isConfirmed) {
        sosActive = false;
        stopLocationTracking();
        
        // Update Firebase
        const emergencyRef = window.sosDatabase.ref('emergencies').orderByChild('status').equalTo('ACTIVE').limitToLast(1);
        emergencyRef.once('value', (snapshot) => {
            snapshot.forEach((child) => {
                child.ref.update({ status: 'CANCELLED' });
            });
        });
        
        closeModal();
        Swal.fire('Cancelled', 'Emergency alert has been cancelled', 'info');
    }
}

// Initialize immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(window.initSOSWidget, 500);
    });
} else {
    setTimeout(window.initSOSWidget, 500);
}

// Also try after window load
window.addEventListener('load', () => {
    if (!document.getElementById('sos-widget')) {
        window.initSOSWidget();
    }
});
