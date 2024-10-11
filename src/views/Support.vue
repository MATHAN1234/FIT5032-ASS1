<template>
  <div>
    <Header />
    <div class="container mt-4">
      <h1>Upcoming Events and Workshops for the Elderly</h1>
      <p>Browse and register for upcoming events and workshops</p>

      <v-data-table
        :headers="headers"
        :items="filteredRows"
        :items-per-page="10"
        class="elevation-1"
        :search="search"
        multi-sort
      >
        <template v-slot:top>
          <v-text-field
            v-model="search"
            label="Search Events"
            class="mx-4"
            clearable
          ></v-text-field>
        </template>
      </v-data-table>
    </div>
    <Footer />
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import mockData from '@/assets/mockData.json';

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
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Event Name', value: 'eventName' },
        { text: 'Date/Time', value: 'dateTime' },
        { text: 'Location', value: 'location' },
        { text: 'Description', value: 'description' },
        { text: 'Action', value: 'register', sortable: false },
      ],
      rows: mockData,
      search: '',
    };
  },
  computed: {
    filteredRows() {
      return this.rows.filter((row) =>
        Object.values(row).some((val) =>
          val.toString().toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },
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
  margin-bottom: 20px;
}
</style>
