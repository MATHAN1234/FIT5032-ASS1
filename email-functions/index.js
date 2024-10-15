const functions = require("firebase-functions");
const sendgridMail = require("@sendgrid/mail");
require("dotenv").config();
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

sendgridMail.setApiKey(SENDGRID_API_KEY);

exports.sendWelcomeEmail = functions.https.onCall(async (data, context) => {
  const {email} = data;

  const msg = {
    to: email,
    from: "math0008@student.monash.edu", // Replace with your verified sender
    subject: "Welcome to ElderCare!",
    text: "Welcome to ElderCare! We are glad to have you with us.",
  };

  try {
    await sendgridMail.send(msg);
    console.log(`Email sent successfully to ${email}`);
    return {success: true, message: "Email sent successfully"};
  } catch (error) {
    console.error("Error sending email:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
