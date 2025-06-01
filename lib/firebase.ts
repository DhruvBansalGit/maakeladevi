// File: lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
apiKey: "AIzaSyBenqEtXssQmwz4TbCCDFdR6jyp4rHqHtM",
  authDomain: "maakeladevi-f773e.firebaseapp.com",
  projectId: "maakeladevi-f773e",
  storageBucket: "maakeladevi-f773e.firebasestorage.app",
  messagingSenderId: "630418925701",
  appId: "1:630418925701:web:4d19eb8783970b3f5021ec",
  measurementId: "G-947LVRFFJ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Database
export const firedatabase = getDatabase(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

export default app;

// File: lib/cloudinary.ts


// File: lib/services/graniteService.ts


// File: lib/services/imageService.ts
