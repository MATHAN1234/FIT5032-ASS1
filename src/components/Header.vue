<template>
    <header class="blog-header py-3">
      <div class="container">
        <div class="row flex-nowrap justify-content-between align-items-center">
          <div class="col-6 pt-1">
            <a class="blog-header-logo text-dark" href="#">ElderCare</a>
          </div>
          <div class="col-6 d-flex justify-content-end align-items-center">
            <a class="text-muted" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mx-3"
              >
                <circle cx="10.5" cy="10.5" r="7.5"></circle>
                <line x1="21" y1="21" x2="15.8" y2="15.8"></line>
              </svg>
            </a>
            <!-- Show Sign Up button only if no user is logged in -->
            <a v-if="!currentUser" class="btn btn-sm btn-outline-secondary" href="#">Sign up</a>
            <!-- Show Logout button if user is logged in -->
            <a v-if="currentUser" class="btn btn-sm btn-outline-secondary" @click="logout">Logout</a>
            <!-- Show the logged-in user's name and role -->
            <!-- <span v-if="currentUser" class="ml-3 text-muted">
              {{ currentUser.name }} ({{ currentUser.role }})
            </span> -->
          </div>
        </div>
        <hr />
        <div class="nav-scroller py-1 mb-2">
          <nav class="nav d-flex justify-content-between">
            <router-link class="p-2 text-muted" to="/">Home</router-link>
            <router-link class="p-2 text-muted" to="/about">About Us</router-link>
            <router-link class="p-2 text-muted" to="/resources">Resources</router-link>
            <router-link class="p-2 text-muted" to="/support">Support</router-link>
            <router-link class="p-2 text-muted" to="/getinvolved">Get Involved</router-link>
            <router-link class="p-2 text-muted" to="/blog">Blog</router-link>
            <!-- Show Login link only if no user is logged in -->
            <router-link v-if="!currentUser" class="p-2 text-muted" to="/login">Login</router-link>
            <!-- Show Admin Dashboard link only for Admin role -->
            <router-link v-if="currentUser && currentUser.role === 'Admin'" class="p-2 text-muted" to="/admin">Admin Dashboard</router-link>
            <!-- Show User Dashboard link for User and Admin roles -->
            <router-link v-if="currentUser && (currentUser.role === 'User' || currentUser.role === 'Admin')" class="p-2 text-muted" to="/user">User Dashboard</router-link>
          </nav>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  import { state } from '../state'; // Import the global state
  import { useRouter } from 'vue-router';
  
  export default {
    // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
    name: 'Header',
    setup() {
      const router = useRouter(); // Use Vue Router
  
      const logout = () => {
        state.currentUser = null; // Clear the current user
        router.push('/'); // Redirect to home page after logout
      };
  
      return {
        currentUser: state.currentUser, // Bind the state to the template
        logout,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Your existing styles will remain unchanged */
  .blog-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e5e5e5;
  }
  
  .nav-scroller {
    position: relative;
    z-index: 2;
    height: 2.75rem;
    overflow-y: hidden;
  }
  
  .nav {
    display: flex;
    flex-wrap: nowrap;
    padding-bottom: 1rem;
    margin-top: -1px;
    overflow-x: auto;
    text-align: center;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }
  
  .nav-link {
    padding-top: .75rem;
    padding-bottom: .75rem;
    font-size: .875rem;
  }
  </style>
  