import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCaT853B7sHEihR2HRjLiRGKKqSzVn4x-o",
  authDomain: "adivinar-numero-c7081.firebaseapp.com",
  projectId: "adivinar-numero-c7081",
  storageBucket: "adivinar-numero-c7081.firebasestorage.app",
  messagingSenderId: "666385048009",
  appId: "1:666385048009:web:d5ce86f125a852f40d4818",
  measurementId: "G-N3346SS456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

export { db };
