/* eslint-disable quotes */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

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
