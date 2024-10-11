<template>
  <div class="app-container">
    <Header />
    <div class="admin-dashboard-container">
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
      <div class="main-content">
        <div v-if="selectedOption === 'profile'">
          <h2>Admin Profile</h2>
          <p><strong>Name:</strong> {{ currentUser.name }}</p>
          <p><strong>Email:</strong> {{ currentUser.email }}</p>
          <p><strong>Role:</strong> {{ currentUser.role }}</p>
        </div>
        <div v-else-if="selectedOption === 'users'">
          <h2>All Users</h2>
          <button @click="fetchUserCount" class="btn btn-primary">Get Total User Count</button>
          <p v-if="userCount !== null">Total users: {{ userCount }}</p>
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
    <Footer />
  </div>
</template>

<script>
import axios from 'axios';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { currentUser, fetchCurrentUser } from '../state';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase.js'; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
      currentUser: currentUser.value,
      selectedOption: 'profile',
      users: [],
      userCount: null,
    };
  },
  methods: {
    async fetchUserCount() {
      try {
        const response = await axios.get('https://us-central1-health-charity.cloudfunctions.net/getUserCount');
        this.userCount = response.data.count;
      } catch (error) {
        console.error('Error fetching user count:', error);
        this.userCount = 'Error fetching count';
      }
    },
    async fetchAllUsers() {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        this.users = querySnapshot.docs.map((doc) => doc.data());
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
  },
  async created() {
    await fetchCurrentUser();
    await this.fetchAllUsers();
  },
};
</script>

<style scoped>
/* Your styles remain the same */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-dashboard-container {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 200px;
  background-color: #f8f9fa;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 58%;
  margin-top: -20px;
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

.main-content {
  flex: 1;
  padding: 20px;
}

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

footer {
  margin-top: auto;
}

@media (max-width: 768px) {
  .admin-dashboard-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    padding: 10px;
    height: auto;
  }

  .main-content {
    margin-left: 0;
  }
}
</style>
