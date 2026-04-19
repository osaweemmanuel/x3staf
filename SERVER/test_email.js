require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
  console.log('Testing Microsoft 365 email sending with:');
  console.log('Host:', process.env.EMAIL_HOST || 'smtp.office365.com');
  console.log('User:', process.env.SENDER_EMAIL);
  console.log('Port:', 587);

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.office365.com',
    port: 587,
    secure: false, // TLS
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
    subject: "Microsoft 365 SMTP Test Email",
    text: "This is a test email from X3 Staffing server using Microsoft 365.",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Email sending failed:', error);
    console.log('\nTIP: If you have MFA enabled, ensure you are using an "App Password" not your regular login password.');
  }
};

testEmail();
