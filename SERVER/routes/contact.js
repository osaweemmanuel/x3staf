const express = require("express");
const router = express.Router();
const {
  sendEmployerDataEmail,
  sendContactFormEmail,
} = require("../helpers/applied");
const { EmployerRequest, ContactSubmission } = require("../models");
const multer = require("multer");
const upload = multer();

// Define your route handler (JSON based)
router.post("/employer", async (req, res) => {
  try {
    const data = req.body;
    // 1. Save to Database
    await EmployerRequest.create({
      companyName: data.companyName,
      industry: data.industry,
      province: data.province,
      city: data.city,
      jobTitle: data.jobTitle,
      numberOfPositions: parseInt(data.numberOfPositions, 10) || 0,
      skills: data.skills,
      startDate: data.startDate,
      contactPerson: data.fullName,
      email: data.email,
      phone: data.number,
      bestTimeToCall: data.time,
      message: data.message,
    });

    // 2. Prepare & Send Email
    const emailContent = `
      --- New Employer Staffing Request ---
      Company: ${data.companyName}
      Industry: ${data.industry}
      Location: ${data.city}, ${data.province}
      Role: ${data.jobTitle}
      Positions: ${data.numberOfPositions}
      Skills/Certifications: ${data.skills}
      Start Date: ${data.startDate}
      
      Contact: ${data.fullName}
      Email: ${data.email}
      Phone: ${data.number}
      Best Time: ${data.time}
      Additional Details: ${data.message}
    `;
    
    // Only try to send email if helper exists and is configured
    try {
        await sendEmployerDataEmail(emailContent);
    } catch (e) { console.error("Email dispatch failed:", e); }

    res.status(200).json({ success: true, message: "Registry synchronized." });
  } catch (error) {
    console.error("Error submitting employer data:", error);
    res.status(500).json({ message: "An error occurred while submitting." });
  }
});

// Generic Contact Route (JSON based)
router.post("/", async (req, res) => {
  try {
    const { fullName, email, subject, message, userType } = req.body;
    
    // 1. Save to Database
    await ContactSubmission.create({
      name: fullName,
      email: email,
      subject: subject,
      message: message,
      userType: userType,
    });

    // 2. Prepare & Send Email
    const emailContent = `
      --- New Site Contact ---
      Name: ${fullName}
      Email: ${email}
      User Type: ${userType}
      Subject: ${subject}
      Message: ${message}
    `;

    try {
        await sendContactFormEmail(emailContent);
    } catch (e) { console.error("Email dispatch failed:", e); }

    res.status(200).json({ success: true, message: "Message logged." });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "An error occurred." });
  }
});

module.exports = router;
