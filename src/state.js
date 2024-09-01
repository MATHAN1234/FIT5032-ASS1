// src/state.js

// Define the initial state
export const state = {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null, // Initialize from localStorage or set to null
  };
  
  // Function to update the current user state and localStorage
  export function setCurrentUser(user) {
    state.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  
  // Function to clear the current user state and localStorage
  export function clearCurrentUser() {
    state.currentUser = null;
    localStorage.removeItem('currentUser');
  }
  