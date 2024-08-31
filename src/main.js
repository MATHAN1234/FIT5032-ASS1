import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import router

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import custom styles
import './assets/style.css';

createApp(App)
  .use(router) // Use the router
  .mount('#app');
