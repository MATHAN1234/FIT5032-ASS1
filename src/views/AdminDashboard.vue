<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-app>
    <Header />
    <v-container>
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
            <p v-if="userCount !== null">Total users: {{ userCount }}</p><br>

            <!-- Export Buttons -->
            <button @click="exportToCSV" class="btn btn-secondary mt-3">Export to CSV</button>
            <button @click="exportToPDF" class="btn btn-secondary mt-3 ml-2">Export to PDF</button>

            <!-- Interactive Data Table using Vuetify -->
            <v-data-table
              :headers="headers"
              :items="users"
              :search="search"
              :items-per-page="10"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-text-field v-model="search" label="Search" class="mx-4" />
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn color="red darken-1" small @click="deleteUser(item.id)">Delete</v-btn>
              </template>
            </v-data-table>
          </div>
        </div>
      </div>
    </v-container>
    <Footer />
  </v-app>
</template>



<script>
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { currentUser, fetchCurrentUser } from '../state';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
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
      search: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Role', value: 'role' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  methods: {
    async fetchUserCount() {
      this.userCount = this.users.length;
    },
    async fetchAllUsers() {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        this.users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async deleteUser(userId) {
      const confirmDelete = confirm('Are you sure you want to delete this user?');

      if (confirmDelete) {
        try {
          const userDoc = doc(db, 'users', userId);
          await deleteDoc(userDoc);
          alert('User deleted successfully');
          this.fetchAllUsers(); // Refresh the users list
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      }
    },
    exportToCSV() {
      const csvContent = [
        ['Name', 'Email', 'Role'],
        ...this.users.map((user) => [user.name, user.email, user.role]),
      ]
        .map((e) => e.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'users_report.csv');
    },
    exportToPDF() {
      const doc = new jsPDF();
      doc.text('User Report', 20, 10);
      doc.autoTable({
        head: [['Name', 'Email', 'Role']],
        body: this.users.map((user) => [user.name, user.email, user.role]),
      });
      doc.save('users_report.pdf');
    },
  },
  async created() {
    await fetchCurrentUser();
    await this.fetchAllUsers(); // Ensure users are fetched on component mount
  },
};
</script>



<style scoped>
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
