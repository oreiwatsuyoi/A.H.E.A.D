# 🆘 SOS Emergency System Setup Guide

## Overview
The SOS Emergency System provides real-time emergency response with live location tracking, AI-powered situation prediction, and instant notification to hospital rescue teams.

## Features
- 🆘 **One-Click Emergency Alert** - Red SOS button widget (bottom-left)
- 📍 **Live Location Tracking** - Real-time GPS tracking with accuracy radius
- 🏥 **Complete Medical Data** - Automatic transmission of patient records, medications, allergies
- 🤖 **AI Prediction** - Gemini AI predicts likely emergency scenarios
- 🗺️ **Interactive Maps** - Google Maps integration for rescue team navigation
- 🚑 **Doctor Dashboard** - Real-time emergency monitoring for medical staff
- 📱 **Push Notifications** - Instant alerts to all connected doctors

## Setup Instructions

### 1. Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Maps JavaScript API**
4. Create API credentials (API Key)
5. Restrict the key to your domain (optional but recommended)
6. Copy your API key
7. Open `maps-config.js` and replace:
   ```javascript
   const GOOGLE_MAPS_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

### 2. Firebase Realtime Database
The system uses Firebase for real-time emergency tracking. Your existing Firebase config in `config.js` is already set up.

**Database Structure:**
```
emergencies/
  ├── {emergencyId}/
  │   ├── timestamp: 1234567890
  │   ├── status: "ACTIVE" | "RESOLVED" | "CANCELLED"
  │   ├── patient: { id, name, age, gender, email, phone, allergies, address }
  │   ├── location: { latitude, longitude, accuracy, timestamp, address }
  │   ├── medicalHistory: { appointments, encounters, medications, tests }
  │   └── aiPrediction: "AI-generated emergency analysis"
```

**Firebase Rules (Recommended):**
```json
{
  "rules": {
    "emergencies": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$emergencyId": {
        ".validate": "newData.hasChildren(['timestamp', 'patient', 'location', 'status'])"
      }
    }
  }
}
```

### 3. Patient Setup
For the SOS system to work, patients must:
1. **Be logged in** with Firebase Authentication
2. **Have a patient record** in the API with matching email
3. **Grant location permissions** when prompted

## How It Works

### Patient Side (SOS Button)
1. Patient clicks the red 🆘 button (bottom-left corner)
2. System confirms emergency activation
3. Automatically gathers:
   - Current GPS location (live tracking starts)
   - Patient record from API (by email match)
   - All appointments, encounters, medications, lab tests
   - Allergies and medical history
4. AI analyzes medical history and predicts likely emergency scenarios
5. Data sent to Firebase Realtime Database
6. Push notifications sent to all doctors
7. Patient sees live tracking map with their location
8. Location updates every 3 seconds in real-time

### Doctor Side (Emergency Dashboard)
1. Navigate to **Emergency** page in sidebar (desktop only)
2. View all active emergencies in real-time
3. Click any emergency to see:
   - Live location map with accuracy radius
   - Complete patient information
   - Current medications and allergies
   - Recent medical encounters
   - AI-predicted emergency scenarios
   - Contact information
4. Mark emergency as "Resolved" when handled
5. View emergency history

## AI Prediction System
The AI analyzes:
- Patient age, gender, medical history
- Recent diagnoses and symptoms
- Current medications
- Known allergies

And provides:
1. **Top 3 likely emergency scenarios** (ranked by probability)
2. **Critical symptoms to watch for**
3. **Immediate first aid recommendations**
4. **What rescue team should prepare**

## Location Tracking
- **Initial Location**: Captured when SOS is triggered
- **Live Updates**: Every 3 seconds while emergency is active
- **Accuracy**: Shows GPS accuracy radius on map
- **Address**: Reverse geocoded to human-readable address
- **Privacy**: Tracking stops when emergency is cancelled/resolved

## Notifications
- **Push Notifications**: System-level alerts to doctors
- **Toast Notifications**: In-app alerts
- **Real-time Updates**: Firebase listeners for instant updates

## Testing the System

### Test as Patient:
1. Login with an account that has a matching patient record
2. Click the 🆘 button (bottom-left)
3. Confirm the emergency alert
4. Allow location access if prompted
5. View your live tracking map
6. Cancel emergency when done testing

### Test as Doctor:
1. Navigate to Emergency page
2. View active emergencies
3. Click to see details and live map
4. Mark as resolved

## Troubleshooting

### SOS Button Not Appearing
- Check browser console for errors
- Ensure `sos-emergency.js` is loaded
- Check if wellness widget is blocking it (adjust z-index)

### Location Not Working
- Ensure HTTPS (location requires secure context)
- Check browser location permissions
- Try in Chrome/Edge (best support)

### Map Not Loading
- Verify Google Maps API key in `maps-config.js`
- Check API key restrictions
- Ensure Maps JavaScript API is enabled
- Check browser console for API errors

### Patient Not Found
- Ensure user is logged in
- Verify patient record exists in API
- Check email matches between Firebase auth and patient record

### AI Prediction Failing
- Check Gemini API key is valid
- Verify internet connection
- System will still work without AI prediction

## Security Considerations
- Location data is sensitive - use HTTPS
- Restrict Google Maps API key to your domain
- Implement Firebase security rules
- Consider HIPAA compliance for production
- Encrypt sensitive data in transit

## Cost Considerations
- **Google Maps API**: Free tier includes 28,000 map loads/month
- **Firebase Realtime Database**: Free tier includes 1GB storage, 10GB/month transfer
- **Gemini AI**: Free tier includes 60 requests/minute

## Mobile Responsiveness
- SOS button repositions on mobile (bottom: 180px)
- Maps are fully responsive
- Touch-friendly interface
- Works on iOS and Android browsers

## Future Enhancements
- [ ] SMS alerts to patient emergency contacts
- [ ] Estimated rescue team arrival time
- [ ] Voice call integration
- [ ] Offline emergency mode
- [ ] Wearable device integration
- [ ] Automatic emergency detection (fall detection, heart rate)

## Support
For issues or questions:
1. Check browser console for errors
2. Verify all setup steps completed
3. Test with different browsers
4. Check Firebase and Google Cloud Console for quota/errors

---

**Built with ❤️ for emergency healthcare response**
