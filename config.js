// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyAK2n-ZUqMXgsIpyJ5m6iXjPX-kNlPqvwY",
  authDomain: "webrtc-a141d.firebaseapp.com",
  databaseURL: "https://webrtc-a141d-default-rtdb.firebaseio.com/",
  projectId: "webrtc-a141d",
  storageBucket: "webrtc-a141d.firebasestorage.app",
  messagingSenderId: "207832483278",
  appId: "1:207832483278:web:de9faaf17137d1380d579f",
  measurementId: "G-Y9C195YX01"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}