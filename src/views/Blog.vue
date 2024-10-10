<template>
    <div>
      <!-- Include Header -->
      <Header />
  
      <!-- Main Content -->
      <div class="container mt-4 text-top">
        <h1>Blog Page</h1>
      </div>
  
      <!-- Include Footer -->
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from '../components/Header.vue';
  import Footer from '../components/Footer.vue';

  
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Blog',
    components: {
      // eslint-disable-next-line vue/no-reserved-component-names
      Header,
      // eslint-disable-next-line vue/no-reserved-component-names
      Footer,
    },
  };
  </script>
  
  <style scoped>
  .container {
    min-height: 50vh; /* Ensure there is some space between header and footer */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  h1 {
    margin-bottom: 20px;
  }
  </style>
  