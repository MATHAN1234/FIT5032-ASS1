<template>
    <div>
      <!-- Include Header -->
      <Header />
  
      <!-- Main Content -->
      <div class="container">
        <div class="jumbotron p-3 p-md-5 text-white rounded bg-dark">
          <div class="col-md-6 px-0">
            <h1 class="display-4 font-italic">Empowering Elderly Communities Through Digital Innovation</h1>
            <p class="lead my-3">Our platform is designed to enhance the lives of elderly individuals by providing accessible, user-friendly resources tailored to their unique needs.</p>
            <p class="lead mb-0"><a href="#" class="text-white font-weight-bold">Continue reading...</a></p>
          </div>
        </div>
      </div>
  
      <!-- Include Footer -->
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from './Header.vue';
  import Footer from './Footer.vue';
  
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Home',
    components: {
      // eslint-disable-next-line vue/no-reserved-component-names
      Header,
      // eslint-disable-next-line vue/no-reserved-component-names
      Footer,
    },
  };
  </script>
  
  <style scoped>
  </style>
  