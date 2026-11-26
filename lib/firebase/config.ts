import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const getFirebaseConfig = () => ({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAw9qwVPn_0O5WLg0yg4NpzIOSZe2lx5Gk',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'okhorayon.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'okhorayon',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'okhorayon.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1019059487398',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1019059487398:web:6b06efa713664510192a67',
});

export const isFirebaseConfigured = (): boolean => {
  return true;
};

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  try {
    return getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
  } catch (err) {
    console.warn('Firebase initializeApp warning:', err);
    return null;
  }
}

export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    return getFirestore(app);
  } catch (err) {
    console.warn('getFirestore warning:', err);
    return null;
  }
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    return getStorage(app);
  } catch (err) {
    console.warn('getStorage warning:', err);
    return null;
  }
}

export const app = getFirebaseApp();
export const db = getFirebaseDb();
export const storage = getFirebaseStorage();

