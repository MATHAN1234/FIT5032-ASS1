import { ref } from 'vue';
import { auth } from '@/firebase';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const db = getFirestore();

// Reactive reference to store the current user
export const currentUser = ref(null);

// Function to set the current user after login/signup
export const setCurrentUser = async (user) => {
  if (user) {
    try {
      // Fetch additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        currentUser.value = { uid: user.uid, ...userDoc.data() };
      } else {
        console.error('No such user in Firestore!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    currentUser.value = null;
  }
};

// Function to clear the current user state
export const clearCurrentUser = () => {
  currentUser.value = null;
};

// Function to fetch the current user from Firebase when the app loads
export const fetchCurrentUser = async () => {
  const user = auth.currentUser;
  if (user) {
    await setCurrentUser(user);
  } else {
    currentUser.value = null;
  }
};

// Function to save user ratings in Firestore
export const saveUserRating = async (userId, rating) => {
  try {
    const userRef = doc(db, 'users', userId);
    // Update the user's document with the new rating using arrayUnion
    await updateDoc(userRef, {
      ratings: arrayUnion(rating),
    });
    console.log('Rating saved successfully');
  } catch (error) {
    console.error('Error saving rating:', error);
  }
};

export default {
  currentUser,
  setCurrentUser,
  clearCurrentUser,
  fetchCurrentUser,
  saveUserRating,
};