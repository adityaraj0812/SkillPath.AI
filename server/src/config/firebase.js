import admin from 'firebase-admin';

let db = null;
let firebaseInitialized = false;

try {
  // Initialize Firebase Admin if not already initialized
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID || 'skillpath-ai-hackathon';
    
    admin.initializeApp({
      projectId: projectId,
    });
  }
  
  db = admin.firestore();
  firebaseInitialized = true;
  console.log('⚡ Firebase Admin initialized successfully.');
} catch (error) {
  console.warn('⚠️ Firebase initialization notice:', error.message);
  console.warn('Backend will continue operating with in-memory persistence.');
}

export { admin, db, firebaseInitialized };
