<template>
  <div class="app-container">
    <!-- Include Header -->
    <Header />

    <!-- Admin Dashboard Layout -->
    <div class="admin-dashboard-container">
      <!-- Sidebar -->
      <div class="sidebar">
        <ul>
          <li>
            <button @click="selectedOption = 'profile'" :class="{ active: selectedOption === 'profile' }">
              Profile
            </button>
          </li>
          <li>
            <button @click="selectedOption = 'users'" :class="{ active: selectedOption === 'users' }">
              Display All Users
            </button>
          </li>
        </ul>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <div v-if="selectedOption === 'profile'">
          <h2>Admin Profile</h2>
          <p><strong>Name:</strong> {{ currentUser.name }}</p>
          <p><strong>Email:</strong> {{ currentUser.email }}</p>
          <p><strong>Role:</strong> {{ currentUser.role }}</p>
        </div>

        <div v-else-if="selectedOption === 'users'">
          <h2>All Users</h2>
          <table v-if="users.length > 0" class="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.email">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else>No users found.</p>
        </div>
      </div>
    </div>

    <!-- Include Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { currentUser, fetchCurrentUser } from '../state'; // Import the global state and function to fetch user
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default {
  name: 'AdminDashboard',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Header,
    // eslint-disable-next-line vue/no-reserved-component-names
    Footer,
  },
  data() {
    return {
      currentUser: currentUser.value, // Get the current user from the global state
      selectedOption: 'profile', // Default to profile view
      users: [], // Array to store users fetched from Firestore
    };
  },
  methods: {
    async fetchAllUsers() {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'users'));
        this.users = querySnapshot.docs.map((doc) => doc.data());
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
  },
  async created() {
    await fetchCurrentUser();
    await this.fetchAllUsers(); // Fetch all users when the component is created
  },
};
</script>

<style scoped>
/* Apply a flex layout to the overall app container */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Admin Dashboard Layout */
.admin-dashboard-container {
  display: flex;
  flex: 1; /* Allow content to grow and push footer to bottom */
}

/* Sidebar */
.sidebar {
  width: 200px; /* Fixed width for sidebar */
  background-color: #f8f9fa;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 58%; /* Adjust the height to match the container */
  margin-top: -20px; /* Align sidebar with the header */
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar ul li {
  margin-bottom: 10px;
}

.sidebar ul li button {
  width: 100%;
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
}

.sidebar ul li button.active {
  background-color: #007bff;
  color: white;
}

/* Main Content */
.main-content {
  flex: 1; /* Take up the remaining space */
  padding: 20px;
}

/* Table Styling */
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.user-table th, .user-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.user-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

/* Footer should stay at the bottom */
footer {
  margin-top: auto; /* Push footer to the bottom of the page */
}

@media (max-width: 768px) {
  .admin-dashboard-container {
    flex-direction: column; /* Stack sidebar and content vertically on smaller screens */
  }

  .sidebar {
    width: 100%; /* Full width on smaller screens */
    padding: 10px;
    height: auto; /* Adjust height on smaller screens */
  }

  .main-content {
    margin-left: 0; /* Reset margin for small screens */
  }
}
</style>
