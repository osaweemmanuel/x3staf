const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Get notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit: 10
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark as read
router.patch("/read/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.update({ isRead: true }, { where: { id } });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create notification (usually called internally)
router.post("/", async (req, res) => {
  try {
    const { userId, message, type } = req.body;
    const newNotif = await Notification.create({ userId, message, type });
    res.status(201).json(newNotif);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
