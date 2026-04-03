const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const multer = require("multer");
const upload = multer(); // Memory storage

// Route to create a new application (Supporting Resume Upload)
router.post("/", upload.single("resume"), applicationController.createApplication);

// Route to get all applications
router.get("/", applicationController.getAllApplications);

// Route to get an application by ID
router.get("/:id", applicationController.getApplicationById);

// Route to update an application by ID
router.put("/:id", applicationController.updateApplication);
router.patch("/:id", applicationController.updateApplication);

// Route to delete an application by ID
router.delete("/:id", applicationController.deleteApplication);

// Route to check if a user has applied for a role
router.get("/:userId/:jobId", applicationController.checkIfUserApplied);

router.get("/:userId/applied", applicationController.getAppliedJobsByUserId);
router.get("/user/:userId", applicationController.getApplicationsByUserId);

module.exports = router;
