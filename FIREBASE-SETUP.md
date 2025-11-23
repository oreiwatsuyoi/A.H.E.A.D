# Firebase Configuration Guide

## Two Separate Firebase Projects

### 1. WebRTC Firebase (config.js)
**Project:** webrtc-a141d  
**Database URL:** https://webrtc-a141d-default-rtdb.firebaseio.com/  
**Used by:**
- ✅ **auth.js** - User authentication (login/signup/logout)
- ✅ **webrtc-integration.js** - Video call signaling
- ✅ **push-notifications.js** - Push notification subscriptions
- ✅ **script.js** - General WebRTC database operations

**Features:**
- Firebase Authentication
- Firebase Realtime Database (for WebRTC signaling)
- Firebase Functions (optional, for push notifications)

---

### 2. SOS Emergency Firebase (sos-firebase-config.js)
**Project:** festive-firefly-465918-t9  
**Database URL:** https://festive-firefly-465918-t9-default-rtdb.firebaseio.com  
**Used by:**
- ✅ **sos-emergency.js** - Emergency alert system
- ✅ **pages.js** - Emergency dashboard (doctor view)

**Features:**
- Firebase Realtime Database (for emergency tracking)
- Real-time location updates
- Emergency status management

---

## How It Works

### Initialization Order (index.html)
```html
<!-- 1. Load Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>

<!-- 2. Initialize WebRTC Firebase (default app) -->
<script src="config.js"></script>

<!-- 3. Initialize SOS Firebase (named app: 'sos-emergency') -->
<script src="sos-firebase-config.js"></script>

<!-- 4. Load other scripts -->
<script src="app.js"></script>
<script src="pages.js"></script>
<script src="sos-emergency.js"></script>
```

### Accessing Databases

**WebRTC Database (default):**
```javascript
firebase.database().ref('path')
firebase.auth()
```

**SOS Emergency Database (named app):**
```javascript
window.sosDatabase.ref('path')
```

---

## Database Structure

### WebRTC Firebase
```
rooms/
  {roomId}/
    hostId: "..."
    participants: {...}
    signals: {...}
```

### SOS Emergency Firebase
```
emergencies/
  {emergencyId}/
    timestamp: 1234567890
    status: "ACTIVE" | "CANCELLED" | "RESOLVED"
    patient: {
      id: "..."
      name: "..."
      age: 25
      gender: "..."
      email: "..."
      phone: "..."
      allergies: [...]
      address: "..."
    }
    location: {
      latitude: 6.5244
      longitude: 3.3792
      accuracy: 10
      timestamp: 1234567890
      address: "..."
    }
    medicalHistory: {
      appointments: 5
      encounters: [...]
      medications: [...]
      tests: [...]
    }
    aiPrediction: "..."
```

---

## AI Integration

**Google Gemini AI** does NOT need Firebase configuration.  
It uses direct API calls with API key:

```javascript
const GEMINI_API_KEY = 'AIzaSyC_zk6RFUUqiuSuVOTZVhYQDx_E_wfGpIY';

fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contents: [...] })
});
```

**Used in:**
- app.js - AI patient creation, appointment booking, encounter documentation
- wellness.js - AI wellness analysis
- sos-emergency.js - AI emergency prediction

---

## Patient Data Source

**Important:** Patient data comes from **Dorra EMR API**, NOT Firebase!

```javascript
// Fetch patients from API
const patients = await apiCall('/patients');

// Fetch patient details
const patient = await apiCall(`/patients/${patientId}`);

// Fetch appointments
const appointments = await apiCall(`/patients/${patientId}/appointments`);

// Fetch encounters
const encounters = await apiCall(`/patients/${patientId}/encounters`);
```

Firebase is ONLY used for:
1. User authentication (WebRTC Firebase)
2. Video call signaling (WebRTC Firebase)
3. Emergency tracking (SOS Firebase)

---

## Troubleshooting

### "PERMISSION_DENIED" Error
- Check which Firebase database you're trying to access
- Make sure you're using the correct reference:
  - `firebase.database()` for WebRTC
  - `window.sosDatabase` for SOS Emergency
- Verify Firebase Realtime Database rules allow read/write

### "sosDatabase is undefined"
- Make sure `sos-firebase-config.js` is loaded before `sos-emergency.js`
- Check browser console for script loading errors
- Verify Firebase SDK is loaded before config files

### Patient Data Not Found
- Patient data comes from Dorra EMR API, not Firebase
- Check API endpoint configuration in `app.js`
- Verify user email matches a patient record in the API

---

## Security Rules

### WebRTC Firebase Rules
```json
{
  "rules": {
    "rooms": {
      ".read": true,
      ".write": true
    }
  }
}
```

### SOS Emergency Firebase Rules
```json
{
  "rules": {
    "emergencies": {
      ".read": true,
      ".write": true,
      ".indexOn": ["status", "timestamp"]
    }
  }
}
```

**Note:** These are development rules. In production, implement proper authentication and authorization.
