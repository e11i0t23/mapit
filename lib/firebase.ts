// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig =
  process.env.NODE_ENV == "development"
    ? {
        apiKey: "12345",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      }
    : {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      };

// Initialize Firebase

const app = getApps.length === 1 ? getApp() : initializeApp(firebaseConfig);
// const analytics = await isSupported() ? getAnalytics(app) : undefined;

const db = getFirestore(app);
const auth = getAuth(app);

const host = (db.toJSON() as { settings?: { host?: string } }).settings?.host ?? "";
if (process.env.NODE_ENV == "development" && !host.startsWith("localhost")) {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
}

export { db, auth };
