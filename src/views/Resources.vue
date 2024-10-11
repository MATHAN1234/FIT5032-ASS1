<template>
  <div>
    <Header />
    <div class="container mt-4">
      <div class="instruction">
        <p>
          Welcome to the ElderCare Resources page. Please enter your home address and the address of a nearby hospital. Our platform will calculate the route, estimated distance, and duration for you. Use the Tab key to navigate through fields and buttons.
        </p>
      </div>
      <div ref="map" style="height: 500px; width: 100%;" aria-label="Map displaying your route"></div>

      <!-- Input fields for addresses -->
      <input
        v-model="homeAddress"
        @input="getSuggestions('home')"
        placeholder="Enter your home address"
        list="home-suggestions"
        class="form-control mt-3"
        aria-label="Home address input field"
      />
      <datalist id="home-suggestions">
        <option v-for="suggestion in homeSuggestions" :key="suggestion.id" :value="suggestion.place_name"></option>
      </datalist>

      <input
        v-model="hospitalAddress"
        @input="getSuggestions('hospital')"
        placeholder="Enter the hospital address"
        list="hospital-suggestions"
        class="form-control mt-3"
        aria-label="Hospital address input field"
      />
      <datalist id="hospital-suggestions">
        <option v-for="suggestion in hospitalSuggestions" :key="suggestion.id" :value="suggestion.place_name"></option>
      </datalist>

      <button
        @click="calculateRoute"
        class="btn btn-primary mt-3"
        aria-label="Calculate route button"
      >
        Calculate Route
      </button>

      <!-- Display distance and duration -->
      <div v-if="routeInfo" class="mt-4" aria-live="polite">
        <p><strong>Distance:</strong> {{ routeInfo.distance }} km</p>
        <p><strong>Duration:</strong> {{ routeInfo.duration }} minutes</p>
      </div>
    </div>
    <Footer />
  </div>
</template>


<script>
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Resources',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Header,
    // eslint-disable-next-line vue/no-reserved-component-names
    Footer,
  },
  data() {
    return {
      map: null,
      homeAddress: '',
      hospitalAddress: '',
      homeSuggestions: [],
      hospitalSuggestions: [],
      homeCoordinates: null,
      hospitalCoordinates: null,
      routeInfo: null,
    };
  },
  methods: {
    initializeMap() {
      mapboxgl.accessToken = 'pk.eyJ1IjoibWF0aGFuMTIzIiwiYSI6ImNtMjQ3bWtmZTBlY28ycXBxMmI2bmQ0dDcifQ.1riM7t8rRE1QgDY3cffyMA';
      this.map = new mapboxgl.Map({
        container: this.$refs.map,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [144.9631, -37.8136],
        zoom: 12,
      });
    },
    async getSuggestions(type) {
      try {
        const query = type === 'home' ? this.homeAddress : this.hospitalAddress;
        if (query.length < 3) {
          if (type === 'home') {
            this.homeSuggestions = [];
          } else {
            this.hospitalSuggestions = [];
          }
          return;
        }

        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&autocomplete=true&limit=5`
        );
        if (type === 'home') {
          this.homeSuggestions = response.data.features;
        } else {
          this.hospitalSuggestions = response.data.features;
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    },
    async calculateRoute() {
      try {
        const homeCoords = await this.getCoordinates(this.homeAddress);
        const hospitalCoords = await this.getCoordinates(this.hospitalAddress);

        if (homeCoords && hospitalCoords) {
          this.homeCoordinates = homeCoords;
          this.hospitalCoordinates = hospitalCoords;

          // Display markers
          new mapboxgl.Marker().setLngLat(homeCoords).addTo(this.map);
          new mapboxgl.Marker({ color: 'red' }).setLngLat(hospitalCoords).addTo(this.map);

          // Fetch directions
          const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${homeCoords.join(',')};${hospitalCoords.join(',')}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
          const response = await axios.get(directionsUrl);

          if (response.data.routes.length > 0) {
            const route = response.data.routes[0];
            this.routeInfo = {
              distance: (route.distance / 1000).toFixed(2), // km
              duration: (route.duration / 60).toFixed(2), // minutes
            };

            // Draw the route on the map
            this.displayRoute(route.geometry.coordinates);
          } else {
            console.error('No route found.');
          }
        } else {
          console.error('Error fetching coordinates.');
        }
      } catch (error) {
        console.error('Error calculating route:', error);
      }
    },
    async getCoordinates(address) {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`
        );
        const feature = response.data.features[0];
        return feature ? feature.center : null;
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
      }
    },
    displayRoute(coords) {
      const routeGeoJSON = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coords,
        },
      };

      if (this.map.getSource('route')) {
        this.map.getSource('route').setData(routeGeoJSON);
      } else {
        this.map.addSource('route', {
          type: 'geojson',
          data: routeGeoJSON,
        });

        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3b9ddd',
            'line-width': 5,
          },
        });
      }

      const bounds = new mapboxgl.LngLatBounds();
      coords.forEach((coord) => bounds.extend(coord));
      this.map.fitBounds(bounds, { padding: 20 });
    },
  },
  mounted() {
    this.initializeMap();
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

.instruction {
  margin-bottom: 20px;
  text-align: center;
}

h1 {
  margin-bottom: 20px;
}
</style>
