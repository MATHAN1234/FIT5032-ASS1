<template>
  <div>
    <!-- Include Header -->
    <Header />

    <!-- Main Content -->
    <div class="container mt-4">
      <div class="row">
        <!-- User Information Section -->
        <div class="col-12 col-md-6 mb-3">
          <div class="card p-3 d-flex justify-content-center align-items-center text-center h-100">
            <h2>User Information</h2>
            <p><strong>Name:</strong> {{ currentUser.name }}</p>
            <p><strong>Email:</strong> {{ currentUser.email }}</p>
            <p><strong>Role:</strong> {{ currentUser.role }}</p>
          </div>
        </div>

        <!-- Rating Section -->
        <div class="col-12 col-md-6 mb-3">
          <div class="card p-3 d-flex justify-content-center align-items-center text-center h-100">
            <h2>Rate Our Website</h2>

            <!-- User input for rating (1 to 5 stars) -->
            <div class="star-rating-input mb-3">
              <span
                v-for="n in 5"
                :key="n"
                @click="setRating(n)"
                class="star"
                :class="{ filled: n <= newRating }"
              >
                ★
              </span>
            </div>
            <button class="btn btn-primary mb-3" @click="addRating">Submit Rating</button>

            <!-- Display aggregated rating score with stars -->
            <div v-if="ratings.length > 0" class="aggregated-rating">
              <h3>Aggregated Rating: {{ aggregatedScore.toFixed(1) }} Stars</h3>
              <div class="star-display">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="star"
                  :class="{ filled: n <= aggregatedScore }"
                >
                  ★
                </span>
              </div>
            </div>
          </div>
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
import { state } from '../state'; // Import the global state to get the current user

export default {
  name: 'UserDashboard',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Header,
    // eslint-disable-next-line vue/no-reserved-component-names
    Footer,
  },
  data() {
    return {
      currentUser: state.currentUser, // Get the current user from the global state
      newRating: 3, // Default rating value
      ratings: [], // Array to store ratings
    };
  },
  computed: {
    // Calculate the aggregated score (average rating)
    aggregatedScore() {
      const total = this.ratings.reduce((sum, rating) => sum + rating, 0);
      return total / this.ratings.length;
    },
  },
  methods: {
    // Method to add a new rating to the list
    addRating() {
      if (this.newRating >= 1 && this.newRating <= 5) {
        this.ratings.push(this.newRating);
        localStorage.setItem('ratings', JSON.stringify(this.ratings)); // Persist ratings in localStorage
      } else {
        alert('Please select a rating between 1 and 5.');
      }
    },
    // Set the new rating when a star is clicked
    setRating(rating) {
      this.newRating = rating;
    },
  },
  created() {
    // Load ratings from localStorage if available
    const storedRatings = localStorage.getItem('ratings');
    if (storedRatings) {
      this.ratings = JSON.parse(storedRatings);
    }
  },
};
</script>

<style scoped>
/* Star Styling */
.star {
  cursor: pointer;
  font-size: 24px; /* Larger stars */
  color: #ddd; /* Default star color */
  transition: color 0.2s;
}

.star.filled {
  color: #ffd700; /* Gold color for filled stars */
}

.star-rating-input {
  font-size: 24px; /* Larger stars */
}

.star-display {
  font-size: 24px; /* Larger stars for aggregated rating display */
}

.aggregated-rating {
  margin-top: 10px;
  font-size: 18px;
}
</style>
