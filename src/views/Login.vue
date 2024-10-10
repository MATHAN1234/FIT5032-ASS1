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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '@/firebase';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';


export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Header,
    // eslint-disable-next-line vue/no-reserved-component-names
    Footer,
  },
  setup() {
    const router = useRouter();
    const showLogin = ref(true);
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const role = ref('User');
    const nameError = ref('');
    const emailError = ref('');
    const passwordError = ref('');

    // Initialize Firestore
    const db = getFirestore();

    const toggleForm = (isLogin) => {
      showLogin.value = isLogin;
      resetForm();
    };

    const resetForm = () => {
      name.value = '';
      email.value = '';
      password.value = '';
      role.value = 'User';
      nameError.value = '';
      emailError.value = '';
      passwordError.value = '';
    };

    const validateName = () => {
      const nameRegex = /^[a-zA-Z0-9\s]*$/;
      nameError.value = nameRegex.test(name.value) ? '' : 'Name contains invalid characters.';
    };

    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      emailError.value = emailRegex.test(email.value) ? '' : 'Please enter a valid email address.';
    };

    const validatePassword = () => {
      const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+=-]*$/;
      if (password.value.length < 6) {
        passwordError.value = 'Password must be at least 6 characters.';
      } else if (!passwordRegex.test(password.value)) {
        passwordError.value = 'Password contains invalid characters.';
      } else {
        passwordError.value = '';
      }
    };

    const handleSignup = async () => {
      validateName();
      validateEmail();
      validatePassword();
      if (name.value && !emailError.value && !passwordError.value && !nameError.value) {
        try {
          // Create user in Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
          const user = userCredential.user;

          // Save additional data in Firestore
          await setDoc(doc(db, 'users', user.uid), {
            name: name.value,
            email: email.value,
            role: role.value
          });

          alert('Signup successful! You are now redirected to the login page.');
          toggleForm(true); // Switch to login form after signup
          resetForm(); // Reset the form after switching
        } catch (error) {
          alert(`Error signing up: ${error.message}`);
        }
      }
    };

    const handleLogin = async () => {
      validateEmail();
      validatePassword();
      if (!emailError.value && !passwordError.value) {
        try {
          // Call the signInWithEmailAndPassword function correctly
          await signInWithEmailAndPassword(auth, email.value, password.value);
          alert(`Login successful!`);
          router.push('/'); // Redirect to the home page or dashboard
        } catch (error) {
          alert(`Error logging in: ${error.message}`);
        }
      }
    };

    return {
      showLogin,
      name,
      email,
      password,
      role,
      nameError,
      emailError,
      passwordError,
      toggleForm,
      validateName,
      validateEmail,
      validatePassword,
      handleSignup,
      handleLogin,
    };
  },
};
</script>

<style scoped>
/* Your styles remain unchanged */
</style>
