<template>
  <div>
    <Header />
    <div class="container mt-4">
      <h2>Get Involved - Appointment Booking</h2>
      <p>Schedule your appointments using the form and calendar below. We manage conflicts to ensure no overlapping bookings.</p>

      <!-- New appointment form -->
      <form @submit.prevent="addAppointment" class="appointment-form">
        <div v-if="newAppointment">
          <input
            v-model="newAppointment.title"
            placeholder="Appointment Title"
            class="form-input"
          />
          <input type="date" v-model="newAppointment.date" class="form-input" :min="new Date().toISOString().split('T')[0]" />
        </div>
        <button type="submit" class="form-button">Add Appointment</button>
      </form>

      <!-- Calendar Component with click handler -->
      <VueCal
        :events="appointments"
        :editable="true"
        @cell-click="handleCellClick"
        class="styled-calendar"
        default-view="month"
        :min-date="new Date()"
      />

      <!-- Display selected appointment information -->
      <div v-if="selectedAppointment" class="appointment-info mt-4">
        <h4>Appointment Details</h4>
        <p><strong>Title:</strong> {{ selectedAppointment.title }}</p>
        <p><strong>Date:</strong> {{ selectedAppointment.date }}</p>
      </div>

      <!-- Appointment Chart -->
      <div class="chart-container mt-4">
        <h2>Appointment Overview - Interactive Chart</h2>
        <canvas v-if="chartData" ref="chartCanvas"></canvas>
        <p v-if="!chartData">Loading chart data...</p> <!-- Show loading message if chart data is missing -->
      </div>

      <Footer />
    </div>
  </div>
</template>

<script>
// Import necessary parts for Chart.js (LineController, LineElement, etc.)
import { ref, onMounted, nextTick } from "vue";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "@/firebase.js"; // Ensure the correct path to Firebase initialization
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js"; // Import necessary chart components
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

// Register chart components
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

export default {
  name: "GetInvolved",
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Header,
    // eslint-disable-next-line vue/no-reserved-component-names
    Footer,
    VueCal,
  },
  setup() {
    const appointments = ref([]);
    const newAppointment = ref({ title: "", date: "" });
    const selectedAppointment = ref(null);
    const chartData = ref(null); // Chart data reference
    const chartCanvas = ref(null); // Canvas reference

    // Render the chart on the canvas
    const renderChart = async () => {
      await nextTick(); // Ensure the canvas has been rendered before chart rendering
      console.log("Checking chart canvas reference...", chartCanvas.value);

      if (!chartCanvas.value) {
        console.error("Chart canvas is not found or initialized.");
        return;
      }

      if (!chartData.value) {
        console.error("Chart data is not prepared yet.");
        return;
      }

      try {
        console.log("Rendering chart with data:", chartData.value);
        new Chart(chartCanvas.value, {
          type: "line", // Chart type
          data: chartData.value,
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      } catch (error) {
        console.error("Error while rendering the chart:", error);
      }
    };

    // Fetch appointments and prepare chart data
    const fetchAppointments = async () => {
      console.log("Fetching appointments...");
      try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        console.log("Fetched appointment documents:", querySnapshot.docs);

        const appointmentCounts = {}; // Count appointments per day

        appointments.value = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            const appointmentDate = new Date(data.date);

            // Skip invalid or past dates
            if (isNaN(appointmentDate.getTime()) || appointmentDate < new Date()) {
              console.warn("Invalid or past appointment date:", appointmentDate);
              return null;
            }

            console.log("Processing valid appointment:", data);
            const dateStr = appointmentDate.toDateString();
            if (appointmentCounts[dateStr]) {
              appointmentCounts[dateStr]++;
            } else {
              appointmentCounts[dateStr] = 1;
            }

            return {
              id: doc.id,
              title: data.title,
              start: appointmentDate,
              end: appointmentDate,
            };
          })
          .filter(Boolean); // Filter out null values

        console.log("Processed appointment counts:", appointmentCounts);

        // Prepare chart data
        const labels = Object.keys(appointmentCounts); // Dates
        const data = Object.values(appointmentCounts); // Appointment counts

        if (labels.length === 0 || data.length === 0) {
          console.warn("No valid chart data to display.");
          return;
        }

        chartData.value = {
          labels, // Dates
          datasets: [
            {
              label: "Appointments Per Day",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              data, // Appointment counts
            },
          ],
        };

        console.log("Chart data prepared:", chartData.value);
        await renderChart(); // Render the chart after data preparation
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    // Add a new appointment
    const addAppointment = async () => {
      if (!auth.currentUser) {
        alert("Please login first to add an appointment.");
        return;
      }

      console.log("Current user UID:", auth.currentUser.uid);

      if (!newAppointment.value.title || !newAppointment.value.date) {
        alert("Please fill out the title and date fields.");
        return;
      }

      try {
        const appointmentDate = new Date(newAppointment.value.date);
        const creatorId = auth.currentUser.uid;

        console.log("Adding new appointment:", {
          title: newAppointment.value.title,
          date: appointmentDate.toISOString(),
          creatorId,
        });

        await addDoc(collection(db, "appointments"), {
          title: newAppointment.value.title,
          date: appointmentDate.toISOString(),
          creatorId,
        });

        newAppointment.value = { title: "", date: "" };
        fetchAppointments(); // Refresh appointments and chart data
      } catch (error) {
        console.error("Error adding appointment:", error);
      }
    };

    const handleCellClick = (event) => {
      const clickedEvent = event.events[0];
      if (clickedEvent) {
        console.log("Appointment clicked:", clickedEvent);
        selectedAppointment.value = {
          title: clickedEvent.title,
          date: clickedEvent.start.toDateString(),
        };
      }
    };

    onMounted(fetchAppointments); // Fetch appointments when the component mounts

    return {
      appointments,
      newAppointment,
      addAppointment,
      selectedAppointment,
      handleCellClick,
      chartData, // Chart data for the template
      chartCanvas, // Canvas reference for the chart
    };
  },
};
</script>

<style scoped>
/* Form styles */
.appointment-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.form-input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.form-button {
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.form-button:hover {
  background-color: #45a049;
}

/* Calendar styling */
.styled-calendar {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  background-color: #ffffff;
}

.styled-calendar .vuecal__cell {
  border: 3px solid #333;
  text-align: center;
  padding: 12px;
  font-size: 18px;
  height: 120px;
  color: #333;
}

.styled-calendar .vuecal__header,
.vuecal__column-header {
  background-color: #333;
  color: white;
  font-weight: bold;
  padding: 18px 0;
  font-size: 20px;
}

.styled-calendar .vuecal__cell-today {
  background-color: #ffcc00;
  font-weight: bold;
  border-radius: 12px;
  border: 3px solid #ff9900;
}

.styled-calendar .vuecal__cell:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}

.vuecal__event {
  background-color: #d9534f;
  color: white;
  padding: 6px;
  border-radius: 8px;
  font-size: 16px;
}

/* Chart styling */
.chart-container {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}

/* Appointment info styling */
.appointment-info {
  padding: 15px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}
</style>
