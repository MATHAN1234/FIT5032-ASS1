/* eslint-disable quotes */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
const express = require('express');
admin.initializeApp();

const app = express();

// Middleware to validate API Key
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  // eslint-disable-next-line max-len
  if (apiKey !== 'AIzaSyBbHdk8t35DbkQNd7DbJPbe1dGZcbEKKK0') { // Replace 'your-secret-api-key' with your actual API key
    return res.status(403).send('Forbidden');
  }
  next();
});

// API Route 1: Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const usersSnapshot = await admin.firestore().collection('users').get();
    // eslint-disable-next-line max-len, arrow-parens
    const users = usersSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch users'});
  }
});

// API Route 2: Fetch all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    // eslint-disable-next-line max-len
    const appointmentsSnapshot = await admin.firestore().collection('appointments').get();
    // eslint-disable-next-line max-len
    const appointments = appointmentsSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch appointments'});
  }
});

// Deploy the Express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);

exports.getUserCount = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const usersSnapshot = await admin.firestore().collection('users').get();
      const userCount = usersSnapshot.size;
      res.status(200).send({count: userCount});
    } catch (error) {
      console.error("Error fetching user count:", error);
      res.status(500).send("Error fetching user count");
    }
  });
});
