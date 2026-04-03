const multer = require("multer");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const { sendEmailWithScreenshot } = require("../helpers/applied");
const Timesheet = require("../models/Timesheet");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("screenshot"), async (req, res) => {
  try {
    const { userId, weekEnding, jobId } = req.body;
    const file = fs.readFileSync(req.file.path);
    const base64Image = file.toString("base64");

    // 1. Save to Database
    const newTimesheet = await Timesheet.create({
      userId,
      jobId,
      weekEnding,
      screenshot: base64Image,
      status: "Pending"
    });

    // 2. Send email with screenshot attached
    await sendEmailWithScreenshot(base64Image);

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: "Timesheet submitted successfully!", id: newTimesheet.id });
  } catch (error) {
    console.error("Error submitting screenshot:", error);
    res.status(500).send("Failed to submit screenshot.");
  }
});

// GET all timesheets (for Admin)
router.get("/", async (req, res) => {
  try {
    const timesheets = await Timesheet.findAll();
    res.json(timesheets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// BATCH UPDATE (Productivity Booster)
router.patch("/batch", async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid IDs provided" });
    }
    await Timesheet.update({ status }, { where: { id: ids } });
    res.json({ message: `Successfully updated ${ids.length} timesheets.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
