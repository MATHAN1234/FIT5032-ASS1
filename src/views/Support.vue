<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div>
    <!-- Include Header -->
    <Header />

    <div class="container mt-4">
      <h1>Upcoming Events and Workshops for the Elderly</h1>
      <p>Browse and register for upcoming events and workshops</p>

      <!-- Search Field and Table Container -->
      <div class="table-container">
        <div class="search-container">
          <v-text-field
            v-model="search"
            label="Search Events"
            class="search-field"
            solo
            hide-details
          ></v-text-field>
        </div>

        <v-data-table
          :headers="headers"
          :items="rows"
          :items-per-page="10"
          :search="search"
          class="elevation-1"
          multi-sort
        >
          <template v-slot:[`item.register`]="{ item }">
            <v-btn color="primary">Register</v-btn>
          </template>
        </v-data-table>
      </div>
    </div>

    <!-- Include Footer -->
    <Footer />
  </div>
</template>

<script>
import mockData from '@/assets/mockData.json';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Support',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Header,
    // eslint-disable-next-line vue/no-reserved-component-names
    Footer,
  },
  data() {
    return {
      search: '', // Search term
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Event Name', value: 'name' },
        { text: 'Date/Time', value: 'datetime' },
        { text: 'Location', value: 'location' },
        { text: 'Description', value: 'description' },
        { text: 'Register', value: 'register', sortable: false },
      ],
      rows: mockData,
    };
  },
};
</script>

<style scoped>
.container {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

h1 {
  margin-bottom: 10px;
}

p {
  margin-bottom: 20px;
}

.table-container {
  width: 100%;
}

.search-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.search-field {
  max-width: 300px;
}
</style>
