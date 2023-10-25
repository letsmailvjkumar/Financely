// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGXZ5x_qrL-jiXpXX6pZlJfgA6jFqqsik",
  authDomain: "financely-30e67.firebaseapp.com",
  projectId: "financely-30e67",
  storageBucket: "financely-30e67.appspot.com",
  messagingSenderId: "26579432247",
  appId: "1:26579432247:web:e4d11a7552e2f06a04e0b2",
  measurementId: "G-MHZLS8VWE4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider();

export {db, auth, provider, doc, setDoc}
