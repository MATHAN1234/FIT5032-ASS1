<template>
  <div>
    <!-- Include Header -->
    <Header />

    <div class="container">
      <div class="auth-container">
        <div class="auth-toggle">
          <button @click="toggleForm(true)" :class="{ active: showLogin }">Login</button>
          <button @click="toggleForm(false)" :class="{ active: !showLogin }">Sign Up</button>
        </div>

        <!-- Login Form -->
        <div v-if="showLogin" class="auth-form dark-background">
          <h2>Login</h2>
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" v-model="email" @blur="validateEmail" required />
              <span class="error" v-if="emailError">{{ emailError }}</span>
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" v-model="password" @blur="validatePassword" required />
              <span class="error" v-if="passwordError">{{ passwordError }}</span>
            </div>
            <button type="submit">Login</button>
          </form>
        </div>

        <!-- Sign Up Form -->
        <div v-else class="auth-form dark-background">
          <h2>Sign Up</h2>
          <form @submit.prevent="handleSignup">
            <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" v-model="name" @blur="validateName" required />
              <span class="error" v-if="nameError">{{ nameError }}</span>
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" v-model="email" @blur="validateEmail" required />
              <span class="error" v-if="emailError">{{ emailError }}</span>
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" v-model="password" @blur="validatePassword" required />
              <span class="error" v-if="passwordError">{{ passwordError }}</span>
            </div>
            <div class="form-group">
              <label for="role">Role:</label>
              <select v-model="role" required>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Include Footer -->
    <Footer />
  </div>
</template>

<script>
import { state } from '../state'; // Assuming you have a state file for managing global state
import Header from './Header.vue';
import Footer from './Footer.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Header,
    // eslint-disable-next-line vue/no-reserved-component-names
    Footer,
  },
  data() {
    return {
      showLogin: true,
      name: '',
      email: '',
      password: '',
      role: 'User', // Default role
      nameError: '',
      emailError: '',
      passwordError: '',
      users: [], // To store user data dynamically
    };
  },
  methods: {
    toggleForm(isLogin) {
      this.showLogin = isLogin;
      this.resetForm();
    },
    resetForm() {
      this.name = '';
      this.email = '';
      this.password = '';
      this.role = 'User';
      this.nameError = '';
      this.emailError = '';
      this.passwordError = '';
    },
    validateName() {
      // Validate name for bad characters
      const nameRegex = /^[a-zA-Z0-9\s]*$/;
      this.nameError = nameRegex.test(this.name) ? '' : 'Name contains invalid characters.';
    },
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailError = emailRegex.test(this.email) ? '' : 'Please enter a valid email address.';
    },
    validatePassword() {
      // Validate password for minimum length and check for bad characters
      const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+=-]*$/; // Allow only specific special characters
      if (this.password.length < 6) {
        this.passwordError = 'Password must be at least 6 characters.';
      } else if (!passwordRegex.test(this.password)) {
        this.passwordError = 'Password contains invalid characters.';
      } else {
        this.passwordError = '';
      }
    },
    handleLogin() {
      this.validateEmail();
      this.validatePassword();
      if (!this.emailError && !this.passwordError) {
        // Simulate a successful login
        const user = this.users.find(
          (u) => u.email === this.email && u.password === this.password
        );
        if (user) {
          state.currentUser = user; // Set the current user globally
          alert(`Welcome ${user.name} (${user.role})!`);
          // Redirect based on role
          this.redirectUser(user.role);
        } else {
          alert('Invalid credentials. Please try again.');
        }
      } else {
        alert('Please correct the errors before submitting.');
      }
    },
    handleSignup() {
      this.validateName();
      this.validateEmail();
      this.validatePassword();
      if (this.name && !this.emailError && !this.passwordError && !this.nameError) {
        // Check if the email already exists
        const userExists = this.users.some((u) => u.email === this.email);
        if (userExists) {
          alert('This user already exists. Please use a different email.');
          return;
        }

        const user = {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role,
        };

        // Add user to global state and localStorage
        this.users.push(user);
        localStorage.setItem('users', JSON.stringify(this.users));

        alert('Signup successful! You are now redirected to the login page.');
        this.toggleForm(true); // Switch to login form after signup
        this.resetForm(); // Reset the form after switching
      } else {
        alert('Please fill in all fields and correct any errors.');
      }
    },
    redirectUser(role) {
      if (role === 'Admin') {
        this.$router.push('/admin');
      } else {
        this.$router.push('/user');
      }
    },
  },
  created() {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers); // Load users from localStorage
    }
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f8f9fa;
}

.auth-toggle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.auth-toggle button {
  flex: 1;
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
}

.auth-toggle button.active {
  background-color: #007bff;
  color: white;
}

.auth-form {
  padding: 20px;
}

.error {
  color: red;
  font-size: 0.9em;
}
</style>
