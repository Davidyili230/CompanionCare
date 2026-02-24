// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSP_g1JrOQ1iB_iFFGEClQl0oCZyd0nJg",
  authDomain: "capstoneproject-fb711.firebaseapp.com",
  projectId: "capstoneproject-fb711",
  storageBucket: "capstoneproject-fb711.firebasestorage.app",
  messagingSenderId: "537283827002",
  appId: "1:537283827002:web:5de5c7f9bd43504dd7ec03",
  measurementId: "G-9MGEPJT2FW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);