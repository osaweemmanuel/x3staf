require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
  console.log('Testing email sending with:');
  console.log('Host:', process.env.EMAIL_HOST);
  console.log('User:', process.env.SENDER_EMAIL);
  console.log('Port:', 587);

  let transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    },
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: process.env.RECIPIENT_EMAIL || process.env.SENDER_EMAIL,
    subject: "SMTP Test Email",
    text: "This is a test email to verify SMTP configuration.",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

testEmail();
