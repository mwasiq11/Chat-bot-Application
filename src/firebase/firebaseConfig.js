import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBCNpD1D4DzlUT9uSNBvmkeXYydWge_olU",
  authDomain: "botrix-e4772.firebaseapp.com",
  projectId: "botrix-e4772",
  storageBucket: "botrix-e4772.firebasestorage.app",
  messagingSenderId: "554727610274",
  appId: "1:554727610274:web:3a7313c01cb0df690304fb",
  measurementId: "G-4SJPYQ5J47"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)