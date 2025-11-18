# A.H.E.A.D Healthcare Platform

**Build for Health. Build for Care. Build for Africa.**

A revolutionary healthcare platform built for the A.H.E.A.D Hackathon 2025, featuring cutting-edge AI technology and comprehensive healthcare management solutions.

## 🏥 Features

### Core Healthcare Solutions
- **Smart Patient Registration** - AI-powered patient registration with structured forms and natural language processing
- **Intelligent Appointment Booking** - Advanced scheduling system with automated SMS/email reminders
- **AI Healthcare Assistant** - Natural language chatbot for patient registration and appointment booking
- **Pharmacy Safety Widget** - Real-time allergy checking before prescribing medications
- **Doctor Dashboard** - Comprehensive view of patient encounters and medical history
- **Patient Portal** - Lightweight portal for patients to view appointments and medical records

### Advanced Features
- **Dorra EMR API Integration** - Foundational, interoperable healthcare platform
- **PharmaVigilance API** - Advanced medication safety and drug interaction detection
- **SMS/Email Reminders** - Automated appointment reminder system
- **Real-time Allergy Checking** - Prevent adverse drug reactions
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **State Management**: React Hooks
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns

## 📋 API Integration

### Dorra EMR API
- Patient management (CRUD operations)
- Appointment scheduling
- Medical encounters
- AI-powered patient creation

### PharmaVigilance API
- Drug interaction checking
- Allergy verification
- Medication safety alerts

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd A.H.E.A.D
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=https://hackathon-api.aheadafrica.org/v1
REACT_APP_AUTH_TOKEN=your_auth_token_here
```

### API Authentication
The application uses token-based authentication. Set your authentication token in localStorage:

```javascript
localStorage.setItem('auth_token', 'your_token_here');
```

## 📱 Usage

### Patient Registration
1. Navigate to `/register-patient`
2. Fill in patient details including allergies
3. Submit to create a new patient record

### Appointment Booking
1. Go to `/appointments`
2. Search and select a patient
3. Choose date, time, and reason for visit
4. Automatic SMS/email reminders are sent

### AI Assistant
1. Access `/ai-chat`
2. Use natural language to register patients or book appointments
3. Examples:
   - "Register John Doe, male, allergic to penicillin"
   - "Book appointment for patient ID 123 tomorrow at 2 PM"

### Doctor Dashboard
1. Visit `/dashboard`
2. View patient statistics, today's appointments, and recent encounters
3. Use the integrated pharmacy widget for medication safety checks

### Patient Portal
1. Navigate to `/patients`
2. Enter patient ID to access personal health information
3. View appointments, medical history, and personal details

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones (#0ea5e9 to #0c4a6e)
- **Health**: Green tones (#22c55e to #14532d)
- **Medical**: Purple/Pink tones (#ec4899 to #831843)

### Typography
- **Primary Font**: Inter (system font)
- **Medical Font**: Poppins

### Components
- Reusable UI components with consistent styling
- Health-themed gradients and animations
- Responsive design patterns
- Accessibility-compliant interfaces

## 🔒 Security Features

- Token-based API authentication
- Input validation and sanitization
- Allergy checking before medication prescription
- Secure patient data handling

## 📊 Performance

- Optimized bundle size with code splitting
- Lazy loading for better performance
- Efficient state management
- Responsive images and assets

## 🌍 Accessibility

- WCAG 2.1 compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Information

**A.H.E.A.D HACKATHON 2025**
- **Theme**: Build for Health. Build for Care. Build for Africa.
- **Duration**: 7 days
- **Location**: Radisson Blu Hotel, Ikeja, Lagos
- **Date**: November 18-25, 2025

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for the future of African healthcare**