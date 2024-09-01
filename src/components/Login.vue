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
              <input type="text" v-model="name" required />
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
      this.emailError = '';
      this.passwordError = '';
    },
    validateEmail() {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailError = re.test(this.email) ? '' : 'Please enter a valid email address.';
    },
    validatePassword() {
      this.passwordError = this.password.length >= 6 ? '' : 'Password must be at least 6 characters.';
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
      this.validateEmail();
      this.validatePassword();
      if (this.name && !this.emailError && !this.passwordError) {
        const user = {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role,
        };
        
        state.addUser(user); // Add user to global state

        state.currentUser = user; // Set the current user globally
        alert('Signup successful! You are now logged in.');
        this.toggleForm(true);
        this.redirectUser(user.role);
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
