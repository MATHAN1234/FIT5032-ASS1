<template>
    <div>
      <!-- Include Header -->
      <Header />
  
      <!-- User Dashboard Content -->
      <!-- User Dashboard Content -->
        <div class="container mt-5">
            <div class="dashboard-content">
                <h2>User Dashboard</h2>
                <div class="user-info">
                <p><strong>Name:</strong> {{ currentUser.name }}</p>
                <p><strong>Email:</strong> {{ currentUser.email }}</p>
                <p><strong>Role:</strong> {{ currentUser.role }}</p>
                </div>
            </div>
        </div>
  
      <!-- Include Footer -->
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from './Header.vue';
  import Footer from './Footer.vue';
  import { state } from '../state'; // Import the global state to get the current user
  
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'UserDashboard',
    components: {
      // eslint-disable-next-line vue/no-reserved-component-names
      Header,
      // eslint-disable-next-line vue/no-reserved-component-names
      Footer,
    },
    data() {
      return {
        currentUser: state.currentUser, // Get the current user from the global state
      };
    },
  };
  </script>
  