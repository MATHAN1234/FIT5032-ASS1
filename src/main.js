import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import router

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'jquery/dist/jquery.min.js';

createApp(App)
  .use(router) // Use the router
  .mount('#app');
