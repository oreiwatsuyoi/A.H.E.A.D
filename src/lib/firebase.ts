import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBLwN1dw4ST8tQRzofUpKoLxYxsTTAGrIk",
  authDomain: "festive-firefly-465918-t9.firebaseapp.com",
  projectId: "festive-firefly-465918-t9",
  storageBucket: "festive-firefly-465918-t9.firebasestorage.app",
  messagingSenderId: "540896450970",
  appId: "1:540896450970:web:84736e343f500b10d5c223",
  measurementId: "G-GCYTCXMX3P"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;