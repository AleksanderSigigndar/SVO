import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDBHSQZcsy14ohnw--A8y32Y5X0hXZicv0",
  authDomain: "korochki-3dc65.firebaseapp.com",
  projectId: "korochki-3dc65",
  storageBucket: "korochki-3dc65.firebasestorage.app",
  messagingSenderId: "123815473678",
  appId: "1:123815473678:web:13ab916b7629ba7a35c25f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;