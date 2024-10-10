import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import router
import vuetify from './plugins/vuetify'; // Import Vuetify setup

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import custom styles
import './assets/style.css';

createApp(App)
  .use(router) // Use the router
  .use(vuetify) // Use Vuetify
  .mount('#app');
