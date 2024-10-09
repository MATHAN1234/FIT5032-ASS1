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
            <div v-if="averageRating !== null" class="aggregated-rating">
              <h3>Aggregated Rating: {{ averageRating.toFixed(1) }} Stars</h3>
              <div class="star-display">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="star"
                  :class="{ filled: n <= averageRating }"
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
import { currentUser } from '../state';
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { arrayUnion } from 'firebase/firestore';

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
      currentUser: currentUser.value,
      newRating: 3, // Default rating value
      averageRating: null,
    };
  },
  methods: {
    async addRating() {
    if (this.newRating >= 1 && this.newRating <= 5) {
      try {
        const db = getFirestore();
        const userDocRef = doc(db, 'users', this.currentUser.uid);

        // Fetch the user's document
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Log the document data for debugging
          console.log('User document data:', userDoc.data());

          // Update the user's ratings in Firestore (using arrayUnion correctly)
          await updateDoc(userDocRef, {
            ratings: arrayUnion(this.newRating),
          });

          alert('Rating submitted successfully!');
          this.fetchAverageRating(); // Fetch the average rating after updating
        } else {
          console.error('User document does not exist.');
        }
      } catch (error) {
        console.error('Error adding rating:', error);
      }
    } else {
      alert('Please select a rating between 1 and 5.');
    }
  },
    setRating(rating) {
      this.newRating = rating;
    },
    async fetchAverageRating() {
      try {
        const db = getFirestore();
        const ratingsCollection = collection(db, 'users');
        const querySnapshot = await getDocs(ratingsCollection);

        let totalRating = 0;
        let ratingCount = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.ratings && data.ratings.length > 0) {
            totalRating += data.ratings.reduce((acc, rating) => acc + rating, 0);
            ratingCount += data.ratings.length;
          }
        });

        this.averageRating = ratingCount > 0 ? totalRating / ratingCount : null;
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    },
  },
  async created() {
    // Fetch the average rating when the component is created
    await this.fetchAverageRating();
  },
};
</script>

<style scoped>
/* Star Styling */
.star {
  cursor: pointer;
  font-size: 24px;
  color: #ddd;
  transition: color 0.2s;
}

.star.filled {
  color: #ffd700;
}

.star-rating-input {
  font-size: 24px;
}

.star-display {
  font-size: 24px;
}

.aggregated-rating {
  margin-top: 10px;
  font-size: 18px;
}
</style>
