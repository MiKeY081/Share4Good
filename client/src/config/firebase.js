// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDv6aJ2_gKLzL87lpRrUnnn8N0w4PY76Cs",
  authDomain: "share4good-7c04d.firebaseapp.com",
  projectId: "share4good-7c04d",
  storageBucket: "share4good-7c04d.appspot.com",
  messagingSenderId: "561991906455",
  appId: "1:561991906455:web:e1d03d6885fb9f7350a5d2",
  measurementId: "G-7JH850PRBP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);