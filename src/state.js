// src/state.js

// Define the initial state
export const state = {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null, // Initialize from localStorage or set to null
    users: JSON.parse(localStorage.getItem('users')) || [], // Load users from localStorage or initialize to an empty array
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
  
  // Function to add a new user to the state and localStorage
  export function addUser(user) {
    state.users.push(user);
    saveUsers(); // Save the updated users list to localStorage
  }
  
  // Function to save users to localStorage
  export function saveUsers() {
    localStorage.setItem('users', JSON.stringify(state.users));
  }
  
  // Function to load users from localStorage
  export function loadUsers() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      state.users = JSON.parse(storedUsers);
    }
  }
  