// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Paste your Firebase config here from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyA0gYfg7qkKg5O3aviAlPldnwdGJR67G00",
  authDomain: "get-craftly.firebaseapp.com",
  projectId: "get-craftly",
  storageBucket: "get-craftly.firebasestorage.app",
  messagingSenderId: "240520915259",
  appId: "1:240520915259:web:8d9f9cf76117f238686f1e",
  measurementId: "G-675350SN84"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
