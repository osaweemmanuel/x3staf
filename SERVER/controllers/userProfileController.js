// userProfileController.js

const UserProfile = require("../models/UserProfile");

// Create a new user profile
exports.createUserProfile = async (req, res) => {
  try {
    const userProfile = await UserProfile.create(req.body);
    res.status(201).json(userProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user profile by user ID or create a default one if it doesn't exist
exports.getUserProfileByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    let userProfile = await UserProfile.findOne({ where: { userId: userId } });
    
    if (!userProfile) {
      // Lazy creation of a default profile to ensure system stability
      userProfile = await UserProfile.create({
        userId: userId,
        firstName: "X3",
        lastName: "Personnel",
        isGhost: true,
        certifications: []
      });
      console.log(`[X3 SYNC] Default profile initialized for ID: ${userId}`);
    }
    
    res.json(userProfile);
  } catch (error) {
    console.error(`[X3 ERROR] Profile Handshake Failed: ${error.message}`);
    res.status(500).json({ message: "Internal System Handshake Failed", error: error.message });
  }
};

// Update user profile by user ID
exports.updateUserProfileByUserId = async (req, res) => {
  try {
    const index = req.params.index;
    const userId = req.params.userId;

    if (index) {
      const userProfile = await UserProfile.findOne({ where: { userId: userId } });

      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      // Update the certifications array based on the provided index
      userProfile.certifications.splice(index, 1);
      userProfile.changed('certifications', true); // Tell Sequelize JSON changed

      // Save the updated user profile
      const updatedUserProfile = await userProfile.save();

      res.json(updatedUserProfile);
    } else {
      const [updated] = await UserProfile.update(req.body, { where: { userId: userId } });
      if (!updated) {
        return res.status(404).json({ message: "User profile not found" });
      }
      const updatedProfile = await UserProfile.findOne({ where: { userId: userId } });
      res.json(updatedProfile);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user profile by user ID
exports.deleteUserProfileByUserId = async (req, res) => {
  try {
    const deleted = await UserProfile.destroy({
      where: { userId: req.params.userId },
    });
    if (!deleted) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json({ message: "User profile deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
