// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
