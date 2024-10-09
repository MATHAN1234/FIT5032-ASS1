import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import About from '../components/About.vue';
import Blog from '../components/Blog.vue';
import Support from '../components/Support.vue';
import Resources from '../components/Resources.vue';
import Getinvolved from '../components/Getinvolved.vue';
import AdminDashboard from '../components/AdminDashboard.vue';
import UserDashboard from '../components/UserDashboard.vue';
import { currentUser, fetchCurrentUser } from '../state'; // Import the currentUser ref and fetch function

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/about', name: 'About', component: About },
  { path: '/blog', component: Blog },
  { path: '/support', component: Support },
  { path: '/resources', component: Resources },
  { path: '/getinvolved', component: Getinvolved },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ['Admin'] }, // Restricted to Admin role
  },
  {
    path: '/user',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true, roles: ['User', 'Admin'] }, // Accessible to both User and Admin
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard to check for authentication and roles
router.beforeEach(async (to, from, next) => {
  // Ensure we have the latest user data
  await fetchCurrentUser();
  
  const user = currentUser.value; // Get the current user from the reactive reference

  if (to.meta.requiresAuth && !user) {
    next('/login'); // Redirect to login if not authenticated
  } else if (to.meta.roles && (!user || !to.meta.roles.includes(user.role))) {
    next('/'); // Redirect to home if user does not have the required role
  } else {
    next(); // Proceed to the route
  }
});

export default router;
