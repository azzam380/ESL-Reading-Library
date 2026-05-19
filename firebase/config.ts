import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyABaYS3aKz0Euy81JWkEqNrrg48SvryuTk",
  authDomain: "esl-reading-library.firebaseapp.com",
  projectId: "esl-reading-library",
  storageBucket: "esl-reading-library.firebasestorage.app",
  messagingSenderId: "242886810844",
  appId: "1:242886810844:web:507d59f03f47f516f16819",
  measurementId: "G-XDHW848F9V"
};

export const isDemoEnv = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return true;
    }
  }
  return firebaseConfig.apiKey === 'placeholder-api-key' || !firebaseConfig.apiKey;
};

// Singleton initialization pattern safe for Next.js Fast Refresh
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
