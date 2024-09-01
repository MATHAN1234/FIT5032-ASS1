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
/* Include necessary styling */
.display-4 {
  font-size: 2.5rem;
}

@media (min-width: 768px) {
  .display-4 {
    font-size: 3rem;
  }
}

.jumbotron {
  background-color: #333; /* Ensure it matches the dark theme */
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.text-white {
  color: white;
}

.font-weight-bold {
  font-weight: bold;
}

.container {
  max-width: 1200px; /* Ensure the container is responsive */
}
</style>
