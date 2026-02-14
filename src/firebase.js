import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// החלף את הערכים האלה בקונפיגורציה שלך מ-Firebase Console
// https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "AIzaSyCHWrs4PFFV4h7Tfu4oMAEdQbQduzHc2xQ",
  authDomain: "carmannegement501-7eabe.firebaseapp.com",
  projectId: "carmannegement501-7eabe",
  storageBucket: "carmannegement501-7eabe.firebasestorage.app",
  messagingSenderId: "463045939161",
  appId: "1:463045939161:web:7e55d6590a9727aace53c8",
  measurementId: "G-Y39SN2Z09P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
