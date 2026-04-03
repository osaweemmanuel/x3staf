const express = require("express");
const multer = require("multer");
const router = express.Router();
const JobModel = require("../models/Job");

const fs = require("fs");
const { promisify } = require("util");

const upload = multer(); // Initialize multer

router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;
    const jobId = req.body.jobId; // Get the job ID from the request body

    // Convert the buffer data to base64
    const base64Pdf = buffer.toString("base64");
    // Find the job by its ID
    const job = await JobModel.findByPk(jobId);
    if (!job) {
      return res.status(404).send("Job not found");
    }

    // Update the job's jobDescriptionPdf field with the base64 PDF data
    job.jobDescriptionPdf = {
      data: base64Pdf,
      contentType: mimetype,
    };
    await job.save();

    res.status(200).send("PDF uploaded successfully");
  } catch (err) {
    console.error("Error uploading PDF:", err);
    res.status(500).send("Internal server error");
  }
});

const UserProfile = require("../models/UserProfile");

router.post(
  "/certifications/:userProfileId",
  upload.single("pdf"),
  async (req, res) => {
    try {
      const { originalname, buffer, mimetype } = req.file;
      const { certType, expiryDate } = req.body;
      const userProfileId = req.params.userProfileId;

      // Convert the buffer data to base64
      const base64Pdf = buffer.toString("base64");

      // Find the userProfile by ID
      const userProfile = await UserProfile.findByPk(userProfileId);
      if (!userProfile) {
        return res.status(404).json({ error: "User profile not found" });
      }

      // Update certifications array
      const currentCerts = userProfile.certifications || [];
      const newCert = { originalname, mimetype, base64Pdf, certType, expiryDate };
      currentCerts.push(newCert);
      
      await userProfile.update({ certifications: currentCerts });

      // Send the updated userProfile or just the added certificate
      res.status(200).json(newCert);
    } catch (err) {
      console.error("Error uploading PDF:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
