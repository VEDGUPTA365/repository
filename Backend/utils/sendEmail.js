import nodemailer from "nodemailer";
import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplet.js";

import path from "path";
import dotenv from "dotenv"

dotenv.config();            // to get access to .env

const __dirname = path.resolve();

// const printEnvVariables = () => {
//   console.log("Environment Variables:");
//   console.log("EMAIL_USER:", process.env.EMAIL_USER);
//   console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
// }
// printEnvVariables(); 

const transporter = nodemailer.createTransport({
  secure: true, // true for port 465, false for other ports
  host: "smtp.gmail.com",
  port: 465,
  // host: "smtp.e..thereal.email",
  // port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,    
  },
});

// ======== send Verification email ========
export const sendVerificationEmail = async (email, verificationToken) => {
  // email = "appylohar@gmail.com";
  // verificationToken = "123455";
  const info = await transporter.sendMail({
    from: '"Ak Advance JwT auth" <appylohar@gmail.com>', // sender address
    to: email,
    subject: "Verification Email", // Subject line
    // text: "Hello world?", // plain text body
    html: VERIFICATION_EMAIL_TEMPLATE.replace( "{verificationCode}", verificationToken ),
  });

  // console.log("Message sent: %s", info);
};

// ======== send Pasword Reset email ========
export const sendPasswordResetEmail = async (email,resetURL) => {
  const info = await transporter.sendMail({
    from: '"Ak Advance JwT auth" <appylohar@gmail.com>', // sender address
    to: email,
    subject: "Reset your Password",
    html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
  });
}

// sendVerificationEmail("appylohar@gmail.com", 123456);
