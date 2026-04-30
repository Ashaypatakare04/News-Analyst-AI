import * as admin from 'firebase-admin';
import { env } from './env';

const formatPrivateKey = (key?: string) => key ? key.replace(/\\n/g, '\n') : undefined;

if (!admin.apps.length) {
  if (env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: formatPrivateKey(env.FIREBASE_PRIVATE_KEY),
        }),
      });
    } catch (error) {
      console.error('Firebase admin initialization error', error);
    }
  } else {
    console.warn('⚠️ Firebase Admin missing credentials. Admin functions will fail at runtime until FIREBASE_PRIVATE_KEY is set.');
  }
}

export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get: (target, prop) => {
    if (!admin.apps.length) throw new Error("Firebase Admin not initialized. Check your .env.local variables.");
    const db = admin.firestore();
    const value = (db as any)[prop];
    return typeof value === "function" ? value.bind(db) : value;
  }
});

export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get: (target, prop) => {
    if (!admin.apps.length) throw new Error("Firebase Admin not initialized. Check your .env.local variables.");
    const auth = admin.auth();
    const value = (auth as any)[prop];
    return typeof value === "function" ? value.bind(auth) : value;
  }
});
