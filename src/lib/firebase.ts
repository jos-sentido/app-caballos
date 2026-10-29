"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator, type FirebaseStorage } from "firebase/storage";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** `true` cuando las variables de entorno de Firebase están presentes. */
export const firebaseConfigured = Boolean(config.apiKey && config.projectId);

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _emulatorsConnected = false;

/** Inicializa Firebase de forma perezosa (solo en el navegador y si hay config). */
export function getFirebase() {
  if (!firebaseConfigured) {
    throw new Error(
      "Firebase no está configurado. Copia .env.example a .env.local y rellena las variables NEXT_PUBLIC_FIREBASE_*."
    );
  }
  if (!_app) {
    _app = getApps().length ? getApp() : initializeApp(config);
    _auth = getAuth(_app);
    _db = getFirestore(_app);
    _storage = getStorage(_app);

    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "1" && !_emulatorsConnected) {
      connectAuthEmulator(_auth, "http://127.0.0.1:9099", { disableWarnings: true });
      connectFirestoreEmulator(_db, "127.0.0.1", 8080);
      connectStorageEmulator(_storage, "127.0.0.1", 9199);
      _emulatorsConnected = true;
    }
  }
  return { app: _app!, auth: _auth!, db: _db!, storage: _storage! };
}
