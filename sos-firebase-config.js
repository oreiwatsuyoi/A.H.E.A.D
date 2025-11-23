// SOS Emergency Firebase Configuration
const sosFirebaseConfig = {
  apiKey: "AIzaSyBLwN1dw4ST8tQRzofUpKoLxYxsTTAGrIk",
  authDomain: "festive-firefly-465918-t9.firebaseapp.com",
  databaseURL: "https://festive-firefly-465918-t9-default-rtdb.firebaseio.com",
  projectId: "festive-firefly-465918-t9",
  storageBucket: "festive-firefly-465918-t9.firebasestorage.app",
  messagingSenderId: "540896450970",
  appId: "1:540896450970:web:84736e343f500b10d5c223",
  measurementId: "G-GCYTCXMX3P"
};

console.log('🔥 SOS Firebase Config:', sosFirebaseConfig.databaseURL);

// Initialize SOS Firebase App
let sosFirebaseApp;
if (!firebase.apps.find(app => app.name === 'sos-emergency')) {
  sosFirebaseApp = firebase.initializeApp(sosFirebaseConfig, 'sos-emergency');
} else {
  sosFirebaseApp = firebase.app('sos-emergency');
}

// Export SOS database reference
window.sosDatabase = sosFirebaseApp.database();
