<template>
    <header class="blog-header py-3">
      <div class="container">
        <div class="row flex-nowrap justify-content-between align-items-center">
          <div class="col-6 pt-1">
            <a class="blog-header-logo text-dark" href="#">ElderCare</a>
          </div>
          <div class="col-6 d-flex justify-content-end align-items-center">
            <a class="text-muted" href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-3">
                <circle cx="10.5" cy="10.5" r="7.5"></circle>
                <line x1="21" y1="21" x2="15.8" y2="15.8"></line>
              </svg>
            </a>
            <a class="btn btn-sm btn-outline-secondary" href="#">Sign up</a>
          </div>
        </div>
        <hr>
        <div class="nav-scroller py-1 mb-2">
          <nav class="nav d-flex justify-content-between">
            <router-link class="p-2 text-muted" to="/">Home</router-link>
            <router-link class="p-2 text-muted" to="/about">About Us</router-link>
            <router-link class="p-2 text-muted" to="/resources">Resources</router-link>
            <router-link class="p-2 text-muted" to="/support">Support</router-link>
            <router-link class="p-2 text-muted" to="/getinvolved">Get Involved</router-link>
            <router-link class="p-2 text-muted" to="/blog">Blog</router-link>
            <router-link class="p-2 text-muted" to="/login">Login</router-link>
          </nav>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    // eslint-disable-next-line vue/multi-word-component-names, vue/no-reserved-component-names
    name: 'Header',
  };
  </script>
  
  <style scoped>
 
  </style>
  