// Import the necessary Firebase functions
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration details
const firebaseConfig = {
  apiKey: "AIzaSyBbHdk8t35DbkQNd7DbJPbe1dGZcbEKKK0",
  authDomain: "health-charity.firebaseapp.com",
  projectId: "health-charity",
  storageBucket: "health-charity.appspot.com",
  messagingSenderId: "268829917641",
  appId: "1:268829917641:web:5990916664eda0aa5aa818",
  measurementId: "G-WKTYH1BXEL" // Optional: only needed if you're using Google Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
