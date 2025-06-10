// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBFnWDy9L9bgyWCT5BXdhsKIx7ajVUSPI0",
  authDomain: "eduforecast-691d7.firebaseapp.com",
  projectId: "eduforecast-691d7",
  storageBucket: "eduforecast-691d7.appspot.com", // ❗fixed `.app` typo
  messagingSenderId: "441369817818",
  appId: "1:441369817818:web:b9f0661ab9015517912be3",
  measurementId: "G-GM3VJM6N1Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth instance
const auth = getAuth(app);
const useauth = getAuth(app);


// Conditionally load Analytics in browser
const analyticsPromise =
  typeof window !== "undefined"
    ? isSupported().then((yes) => (yes ? getAnalytics(app) : null))
    : Promise.resolve(null);

export { app, auth, analyticsPromise };
export const firebaseApp = initializeApp(firebaseConfig);