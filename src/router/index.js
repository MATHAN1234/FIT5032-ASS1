import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue'; // Import the Home component
import Login from '../components/Login.vue';
import About from '../components/About.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
