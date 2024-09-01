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
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .dashboard-content {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .user-info-form {
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
  }
  
  input:disabled {
    background-color: #e9ecef;
    color: #495057;
  }
  </style>
  