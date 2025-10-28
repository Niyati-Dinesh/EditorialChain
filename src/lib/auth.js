// ------------------------------------------------------------------
// THIS IS THE CORRECT FILE IF YOU ARE NOT USING .env.local
// ------------------------------------------------------------------

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- 1. Import Firestore
// ⚠️ SECURITY WARNING: 
// You should not do this. Your API keys are now public.
// Anyone can see them and use your Firebase project.
// Please use the .env.local method as soon as you can.

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "", // <-- The key you pasted
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // <-- 2. Initialize and export db
export const provider = new GoogleAuthProvider();