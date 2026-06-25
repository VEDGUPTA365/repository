import { sendPasswordResetEmail } from "./sendEmail.js";

const test = async () => {
  try {
    await sendPasswordResetEmail(
      "appylohar@gmail.com",
      "http://localhost:5173/reset-password/123456789"
    );

    console.log("✅ Email sent successfully!");
  } catch (err) {
    console.error("❌ Failed to send email");
    console.error(err);
  }
};

test();