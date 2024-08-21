import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASSWORD } from "../config/config.js";

const smtpConfig = {  //nodemailer
  EMAIL: EMAIL_USER,
  PASSWORD: EMAIL_PASSWORD,
  HOST: "smtp.gmail.com",
  PORT: 587,
  FROM_EMAIL: EMAIL_USER,
};

const transporter = nodemailer.createTransport(
  {
    host: smtpConfig.HOST,
    port: smtpConfig.PORT,
    secure: false,
    auth: {
      user: smtpConfig.EMAIL,
      pass: smtpConfig.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  { sendmail: true }
);

async function sendEmail(mailOptions) {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.response);
  } catch (err) {
    console.log("Error sending email: ", err);
  }
}

export { sendEmail };
