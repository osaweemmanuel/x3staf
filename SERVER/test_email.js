require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
  console.log('Testing Microsoft 365 email sending with Port 25:');
  console.log('Host:', process.env.EMAIL_HOST || 'smtp.office365.com');
  console.log('User:', process.env.SENDER_EMAIL);
  console.log('Port: 25');

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.office365.com',
    port: 25,
    secure: false,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: process.env.RECIPIENT_EMAIL || process.env.SENDER_EMAIL,
    subject: "Microsoft 365 Port 25 Test",
    text: "Testing Port 25 connectivity.",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

testEmail();
