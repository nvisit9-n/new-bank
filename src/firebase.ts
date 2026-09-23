import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';
import appletConfig from '../firebase-applet-config.json';

export const firebaseConfig = {
  apiKey: appletConfig.apiKey || "AIzaSyAll7c8qr6tnPwEZjQ3JDUCS5IUrCX1wGo",
  authDomain: appletConfig.authDomain || "plasma-tribute-kf6jr.firebaseapp.com",
  projectId: appletConfig.projectId || "plasma-tribute-kf6jr",
  storageBucket: appletConfig.storageBucket || "plasma-tribute-kf6jr.firebasestorage.app",
  messagingSenderId: appletConfig.messagingSenderId || "159405978608",
  appId: appletConfig.appId || "1:159405978608:web:d377bb91b6b8deb9dc6335",
  measurementId: appletConfig.measurementId || ""
};

export const app: FirebaseApp = getApps().length > 0 
  ? getApp() 
  : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

let rtdbInstance: Database | null = null;
try {
  rtdbInstance = getDatabase(app);
} catch (e) {
  console.warn('Firebase Realtime Database initialization notice:', e);
}
export const rtdb: Database | null = rtdbInstance;

export default app;
