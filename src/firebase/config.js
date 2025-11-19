import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCcNHWmH4eoFCBBxgWa4rwgKEC45ush-kc",
  authDomain: "korki-7382c.firebaseapp.com",
  projectId: "korki-7382c",
  storageBucket: "korki-7382c.firebasestorage.app",
  messagingSenderId: "879107046452",
  appId: "1:879107046452:web:b861c3926179ab6ba7de61",
  measurementId: "G-5YGY1FR5DK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app)
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;