# A.H.E.A.D Healthcare Platform

**Build for Health. Build for Care. Build for Africa.**

A revolutionary healthcare platform built for the A.H.E.A.D Hackathon 2025, featuring cutting-edge AI technology, comprehensive healthcare management, and wellness tracking solutions.

## 🏥 Core Features

### Patient Management
- **Smart Patient Registration** - AI-powered patient creation with natural language input or structured forms
- **Patient Search & Filtering** - Real-time search across patient database with instant results
- **Patient Detail View** - Comprehensive patient profiles with demographics, allergies, medical history
- **Patient CRUD Operations** - Full create, read, update, delete functionality with validation
- **Allergy Management** - Track and display patient allergies with visual badges
- **Patient Demographics** - Age calculation, gender, contact information, address management

### Appointment System
- **AI Appointment Booking** - Natural language appointment scheduling with voice input support
- **Appointment Calendar View** - Visual calendar grouping appointments by date with time slots
- **Appointment Management** - Create, edit, delete appointments with status tracking
- **Appointment Search** - Filter appointments by patient, date, or status
- **Automated Reminders** - SMS/email reminder system for upcoming appointments
- **Conflict Detection** - Prevent double-booking and scheduling conflicts

### Medical Encounters
- **AI Encounter Creation** - Natural language encounter documentation with voice input
- **Vitals Tracking** - Blood pressure, heart rate, temperature, weight, height, BMI
- **Diagnosis Recording** - Structured diagnosis entry with clinical notes
- **Symptoms Documentation** - Detailed symptom tracking and history
- **Consultation Reasons** - Track reason for visit and follow-up requirements
- **Medical History** - Comprehensive patient medical history documentation
- **Encounter Details View** - Full encounter information with medications and tests

### Medication Management
- **Medication Prescribing** - Prescribe medications linked to encounters
- **Dosage & Frequency** - Track medication dosage, frequency, and duration
- **Start/End Dates** - Medication timeline management
- **Medication Search** - Autocomplete search from existing medications
- **Patient Medication History** - View all medications prescribed to a patient
- **Allergy Checking** - Real-time allergy verification before prescribing

### Laboratory Tests
- **Test Ordering** - Order lab tests linked to encounters
- **Test Results** - Record and track test results
- **Test History** - Complete laboratory test history per patient
- **Test Search** - Autocomplete search from existing test types
- **Pending Tests** - Track tests awaiting results

### PharmaVigilance Monitoring
- **Drug Interaction Detection** - Real-time monitoring for drug interactions
- **Severity Classification** - Major, Moderate, Minor, Unknown severity levels
- **Webhook Integration** - Register webhooks for real-time alerts
- **Alert Dashboard** - View and manage drug interaction alerts
- **Alert Statistics** - Visual statistics by severity level
- **Alert Notifications** - Pop-up notifications for critical interactions
- **Alert History** - Complete audit trail of all alerts

### AI-Powered Features
- **AI Patient Creation** - Natural language patient registration with Gemini 2.0 Flash
- **AI Appointment Booking** - Conversational appointment scheduling
- **AI Encounter Documentation** - Natural language encounter creation
- **Voice Input** - Speech-to-text for all AI features using Web Speech API
- **Prompt Improvement** - AI-powered prompt enhancement for better results
- **AI Wellness Analysis** - Personalized health insights from wellness logs

### Wellness Tracking System
- **Quick Logging** - Log symptoms, meals, moods, and workouts
- **Guided Meditation** - 3 meditation exercises with timers and instructions
- **Breathing Exercises** - 3 breathing techniques (4-7-8, Box, Alternate Nostril)
- **Stretching Routines** - 3 stretch routines (Desk, Morning, Evening)
- **Exercise Timer** - Countdown timer with pause/resume and progress bar
- **Wellness History** - View logs with today/yesterday/week statistics
- **AI Health Insights** - Automatic analysis of wellness logs with recommendations
- **Wellness Dashboard** - Real-time wellness statistics on dashboard

### Video Consultation
- **WebRTC Integration** - Secure peer-to-peer video calls
- **Access Code System** - 6-digit code for joining consultations
- **Camera & Audio Check** - Pre-call lobby for device testing
- **Device Selection** - Choose microphone and camera before joining
- **In-Call Controls** - Mute audio, disable video, screen sharing
- **Call Timer** - Track consultation duration
- **Chat Panel** - Text chat during video calls
- **End-to-End Encryption** - Secure video connections

### Google Fit Integration
- **OAuth2 Authentication** - Secure Google Fit connection
- **Steps Tracking** - Daily step count from Google Fit
- **Heart Rate Monitoring** - Average heart rate data
- **Calorie Tracking** - Calories burned throughout the day
- **Sleep Tracking** - Sleep duration and quality
- **Fitness Dashboard** - Visual display of all fitness metrics

### Health Education
- **Health Facts Widget** - Rotating health tips and facts (30+ facts)
- **Timed Display** - Facts appear every 32 seconds for 12 seconds
- **Educational Content** - Evidence-based health information
- **FAQ Section** - Comprehensive FAQ covering all features

## 🚀 Technology Stack

### Frontend
- **Vanilla JavaScript** - Pure JavaScript without frameworks for maximum performance
- **Custom CSS** - Handcrafted responsive styles with gradients and animations
- **HTML5** - Semantic markup with modern features

### APIs & Services
- **Dorra EMR API** - Healthcare data management backend
- **PharmaVigilance API** - Drug interaction monitoring
- **Google Gemini 2.0 Flash** - AI-powered natural language processing
- **Google Fit API** - Fitness data integration
- **Web Speech API** - Voice input functionality

### Real-Time Communication
- **WebRTC** - Peer-to-peer video calling
- **Firebase Realtime Database** - Signaling for WebRTC connections
- **Firebase Authentication** - Secure user authentication

### UI Components
- **SweetAlert2** - Beautiful modal dialogs and alerts
- **Font Awesome** - Icon library for UI elements
- **Google Fonts** - Inter font family

### Storage
- **LocalStorage** - Client-side data persistence for wellness logs, alerts, and settings

## 📋 API Integration

### Dorra EMR API Endpoints
- `GET /patients` - List all patients with search
- `POST /patients/create` - Create new patient
- `GET /patients/{id}` - Get patient details
- `PATCH /patients/{id}` - Update patient
- `DELETE /patients/{id}` - Delete patient
- `GET /appointments` - List appointments
- `POST /appointments` - Create appointment
- `PATCH /appointments/{id}` - Update appointment
- `DELETE /appointments/{id}` - Delete appointment
- `GET /encounters` - List encounters
- `GET /encounters/{id}` - Get encounter details
- `POST /patients/{id}/medications` - Prescribe medication
- `GET /patients/{id}/medications` - Get patient medications
- `POST /patients/{id}/tests` - Order lab test
- `GET /patients/{id}/tests` - Get patient tests
- `POST /ai/patient` - AI patient creation
- `POST /ai/emr` - AI appointment/encounter creation

### PharmaVigilance API
- `POST /auth/webhook/register` - Register webhook for alerts
- `POST /auth/webhook/test` - Test webhook connection
- Real-time drug interaction monitoring
- Severity classification (Major, Moderate, Minor, Unknown)

### Google Gemini API
- `POST /v1beta/models/gemini-2.0-flash-exp:generateContent` - AI text generation
- Natural language processing for patient/appointment/encounter creation
- Prompt improvement and enhancement
- Wellness log analysis and health insights

### Google Fit API
- `POST /fitness/v1/users/me/dataset:aggregate` - Aggregate fitness data
- Steps, heart rate, calories, sleep data retrieval
- OAuth2 authentication flow

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd A.H.E.A.D
   ```

2. **Configure API endpoints**
   - Update API base URL in `app.js`
   - Set up proxy in your web server to `/api` endpoint
   - Configure CORS for API access

3. **Set up Firebase (for video calls)**
   - Create Firebase project at https://console.firebase.google.com
   - Enable Realtime Database and Authentication
   - Copy Firebase config to `config.js`

4. **Configure Google APIs**
   - Get Google Fit OAuth2 Client ID
   - Get Google Gemini API key
   - Update credentials in respective files

5. **Deploy**
   - Serve files using any web server (Apache, Nginx, etc.)
   - Or use `python -m http.server 8000` for local testing
   - Access at `http://localhost:8000`

## 🔧 Configuration

### API Configuration
Update in `app.js`:
```javascript
const API_BASE = '/api'; // Your API endpoint
```

### Firebase Configuration
Create `config.js`:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-app.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Google Gemini API
Update in `app.js` and `wellness.js`:
```javascript
const GEMINI_API_KEY = 'your-gemini-api-key';
```

### Google Fit OAuth
Update in `app.js`:
```javascript
const GOOGLE_FIT_CLIENT_ID = 'your-client-id.apps.googleusercontent.com';
```

## 📱 Usage Guide

### Dashboard
- View statistics: Total patients, appointments, encounters
- See recent patients, medications, and lab tests
- Monitor wellness tracking summary (symptoms, meals, moods, workouts)
- Access quick actions for patient and appointment creation

### Patient Management
1. Click "Patients" in sidebar
2. Use search bar to find patients by name or ID
3. Click "Add Patient" for manual entry or "Use AI" for natural language
4. Click patient name to view detailed profile
5. Edit or delete patients using action buttons

### Appointment Scheduling
1. Navigate to "Appointments"
2. View calendar chart showing appointments by date
3. Click "Schedule Appointment" button
4. Search for patient and describe appointment in natural language
5. Use voice input button (🎤) for hands-free entry
6. Click "Improve with AI" to enhance your description

### Medical Encounters
1. Go to "Encounters" section
2. Click "New Encounter" button
3. Search for patient
4. Describe encounter using natural language or voice
5. AI extracts vitals, symptoms, diagnosis automatically
6. View encounter details by clicking "View Details"

### Medication Prescribing
1. From encounter or patient detail page
2. Search for encounter by patient name
3. Enter medication name (autocomplete available)
4. Specify dosage, frequency, start/end dates
5. System checks for allergies automatically

### Lab Test Ordering
1. Similar to medication prescribing
2. Search encounter and enter test name
3. Add notes if needed
4. Track results in patient detail view

### PharmaVigilance Monitoring
1. Navigate to "PharmaWatch" (desktop only)
2. Register webhook URL for real-time alerts
3. Test webhook connection
4. View alert statistics by severity
5. Review and dismiss alerts as needed

### Wellness Tracking
1. Click the "+" button (bottom-left corner)
2. Quick log: symptoms, meals, moods, workouts
3. Guided exercises: meditation, breathing, stretching
4. Use timer for exercises with pause/resume
5. View history with AI-powered health insights

### Video Consultation
1. Click "Doctor" in navigation
2. Enter 6-digit access code
3. Test camera and microphone in lobby
4. Select preferred devices
5. Join session for video call
6. Use in-call controls: mute, video, screen share, chat

### Google Fit Integration
1. Go to patient detail page
2. Click "Connect Google Fit"
3. Authorize access to fitness data
4. View steps, heart rate, calories, sleep automatically

### Voice Input
- Available in all AI features
- Click microphone button (🎤)
- Speak naturally
- Click again to stop recording
- Text appears automatically

### AI Prompt Improvement
- Available in patient, appointment, encounter creation
- Click "✨ Improve with AI" button
- AI enhances your description
- Choose to use improved version or keep original

## 🎨 Design System

### Color Palette
- **Primary Blue**: #0ea5e9 to #0c4a6e (appointments, links)
- **Success Green**: #10b981 to #14532d (wellness, success states)
- **Warning Orange**: #f59e0b (meals, warnings)
- **Danger Red**: #ef4444 (symptoms, errors, major alerts)
- **Purple**: #8b5cf6 (moods, AI features)
- **Pink**: #ec4899 (stretching, secondary actions)
- **Dark Background**: #0f172a (main background)
- **Card Background**: rgba(30, 41, 59, 0.4) (glass morphism)

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Headings**: 700-800 weight
- **Body**: 400-500 weight
- **Small Text**: 300 weight

### UI Patterns
- **Gradient Backgrounds**: Linear gradients for cards and buttons
- **Glass Morphism**: Translucent backgrounds with backdrop blur
- **Colored Borders**: Left border accent on cards (3-4px)
- **Rounded Corners**: 8-16px border radius
- **Shadows**: Layered box shadows for depth
- **Hover Effects**: Transform and color transitions
- **Badges**: Colored pills for status indicators

### Responsive Design
- **Desktop**: Full sidebar navigation, all features visible
- **Mobile (<1024px)**: Bottom navigation bar, desktop-only items hidden
- **Tablet**: Adaptive grid layouts
- **Touch-Friendly**: Large tap targets (44px minimum)

### Components
- **Sidebar**: Fixed navigation with icons and labels
- **Modal System**: Overlay modals with backdrop
- **Data Tables**: Sortable, clickable rows
- **Form Inputs**: Consistent styling with validation
- **Stat Cards**: Gradient cards with icons and values
- **Loading States**: Spinners and skeleton screens
- **Empty States**: Helpful messages with call-to-action
- **Toast Notifications**: SweetAlert2 for alerts

## 🔒 Security & Privacy

### Data Security
- **API Authentication**: Token-based authentication for all API calls
- **Input Validation**: Client-side validation before API submission
- **XSS Prevention**: Sanitized user inputs
- **CORS Configuration**: Restricted API access

### Medical Safety
- **Allergy Checking**: Automatic verification before prescribing
- **Drug Interaction Monitoring**: Real-time PharmaVigilance alerts
- **Severity Classification**: Risk-based alert prioritization

### Privacy
- **Local Storage**: Wellness logs stored locally on device
- **End-to-End Encryption**: WebRTC video calls encrypted
- **No Data Sharing**: Patient data never shared without consent
- **HIPAA Considerations**: Designed with healthcare compliance in mind

### Video Call Security
- **Access Codes**: 6-digit codes for session access
- **Peer-to-Peer**: Direct WebRTC connections
- **Firebase Security Rules**: Restricted database access
- **Temporary Sessions**: Call data not persisted

## 📊 Performance Optimizations

### Frontend Performance
- **Vanilla JavaScript**: No framework overhead, faster load times
- **Minimal Dependencies**: Only essential libraries (SweetAlert2, Font Awesome)
- **Async Loading**: Scripts loaded asynchronously
- **LocalStorage Caching**: Wellness logs and settings cached locally
- **Debounced Search**: 300ms delay on search inputs
- **Lazy Rendering**: Only render visible content

### API Optimization
- **Parallel Requests**: Promise.all for simultaneous API calls
- **Request Batching**: Combine related API calls
- **Error Handling**: Graceful degradation on API failures
- **Timeout Management**: Prevent hanging requests

### Media Optimization
- **WebRTC**: Peer-to-peer reduces server load
- **Video Compression**: Adaptive bitrate for video calls
- **Image Optimization**: SVG icons for scalability
- **Font Subsetting**: Only load required font weights

## 🌍 Accessibility

### WCAG Compliance
- **Color Contrast**: Minimum 4.5:1 ratio for text
- **Focus Indicators**: Visible focus states on interactive elements
- **Alt Text**: Descriptive labels for icons and images
- **Semantic HTML**: Proper heading hierarchy and landmarks

### Keyboard Navigation
- **Tab Navigation**: All interactive elements accessible
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals and overlays
- **Arrow Keys**: Navigate through lists

### Screen Reader Support
- **ARIA Labels**: Descriptive labels for UI elements
- **Role Attributes**: Proper ARIA roles
- **Live Regions**: Announce dynamic content changes
- **Form Labels**: Associated labels for all inputs

### Responsive Accessibility
- **Touch Targets**: Minimum 44x44px tap areas
- **Zoom Support**: Content scales up to 200%
- **Text Resize**: Readable at all sizes
- **Mobile Gestures**: Swipe and tap support

## 📁 Project Structure

```
A.H.E.A.D/
├── index.html              # Main HTML file with WebRTC screens
├── styles.css              # Global styles and responsive design
├── app.js                  # Core app logic, navigation, modals
├── pages.js                # Page components (Patients, Appointments, etc.)
├── wellness.js             # Wellness tracking widget system
├── medications-tests.js    # Medication and lab test management
├── webrtc-integration.js   # Video call functionality
├── script.js               # Additional utilities
├── config.js               # Firebase configuration
└── README.md               # This file
```

## 🔑 Key Features Summary

### Patient Management ✅
- AI-powered registration
- Search and filtering
- CRUD operations
- Allergy tracking
- Detailed profiles

### Appointments ✅
- AI scheduling
- Calendar view
- Status tracking
- Reminders
- Conflict detection

### Medical Records ✅
- Encounter documentation
- Vitals tracking
- Diagnosis recording
- Clinical notes
- Medical history

### Medications ✅
- Prescribing system
- Dosage management
- Allergy checking
- Medication history
- Autocomplete search

### Lab Tests ✅
- Test ordering
- Result tracking
- Test history
- Pending tests

### Safety Monitoring ✅
- Drug interactions
- Real-time alerts
- Severity levels
- Webhook integration
- Alert dashboard

### Wellness ✅
- Quick logging
- Guided exercises
- Exercise timers
- History tracking
- AI insights

### Video Calls ✅
- WebRTC integration
- Device testing
- In-call controls
- Chat functionality
- Screen sharing

### Integrations ✅
- Google Fit
- Google Gemini AI
- Voice input
- Firebase

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Test all features before committing
- Update README for new features
- Ensure mobile responsiveness
- Maintain accessibility standards

## 🐛 Known Issues & Limitations

- API proxy required for CORS (configure in web server)
- WebRTC requires HTTPS in production
- Google Fit requires OAuth consent screen setup
- Voice input only works in Chrome/Edge browsers
- Mobile navigation hides PharmaWatch (desktop only)
- Wellness logs stored locally (not synced across devices)

## 🚀 Future Enhancements

- [ ] Multi-language support (English, French, Swahili)
- [ ] Offline mode with service workers
- [ ] Push notifications for appointments
- [ ] Prescription printing
- [ ] Lab result PDF export
- [ ] Patient mobile app
- [ ] Doctor scheduling system
- [ ] Insurance integration
- [ ] Billing and invoicing
- [ ] Analytics dashboard
- [ ] Telemedicine recording
- [ ] E-prescription system

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Information

**A.H.E.A.D HACKATHON 2025**
- **Theme**: Build for Health. Build for Care. Build for Africa.
- **Duration**: 7 days
- **Location**: Radisson Blu Hotel, Ikeja, Lagos
- **Date**: November 18-25, 2025

## 📞 Support & Contact

For support, questions, or feature requests:
- Create an issue in the repository
- Contact the development team
- Email: support@medicore.health

## 🙏 Acknowledgments

- **A.H.E.A.D Africa** - For organizing the hackathon
- **Dorra EMR** - For providing the healthcare API
- **Google** - For Gemini AI and Fit API
- **Firebase** - For real-time database and authentication
- **Open Source Community** - For amazing tools and libraries

## 📊 Statistics

- **Total Features**: 50+
- **API Endpoints**: 20+
- **Lines of Code**: 5000+
- **Files**: 10+
- **Supported Devices**: Desktop, Tablet, Mobile
- **Supported Browsers**: Chrome, Edge, Firefox, Safari

---

**Built with ❤️ for the future of African healthcare**

*Empowering healthcare providers with technology to deliver better care, improve patient outcomes, and build a healthier Africa.*