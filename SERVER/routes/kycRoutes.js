const express = require("express");
const router = express.Router();
const KYC = require("../models/KYC");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

// Upload KYC Document
router.post("/upload", upload.single("document"), async (req, res) => {
  try {
    const { userId, documentType, expiryDate } = req.body;
    const file = fs.readFileSync(req.file.path);
    const base64Data = file.toString("base64");

    const kycDoc = await KYC.create({
      userId,
      documentType,
      documentData: base64Data,
      expiryDate,
      status: "Pending"
    });

    fs.unlinkSync(req.file.path);
    res.status(201).json({ message: "Document uploaded successfully", kycDoc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all KYC documents
router.get("/all", async (req, res) => {
  try {
    const docs = await KYC.findAll({ order: [['createdAt', 'DESC']] });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user KYC documents
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const docs = await KYC.findAll({ where: { userId } });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Review
router.patch("/review/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Verified or Rejected
    await KYC.update({ status }, { where: { id } });
    res.json({ message: "KYC status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
