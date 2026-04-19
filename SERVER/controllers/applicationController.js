// controllers/applicationController.js

const Application = require("../models/JobApp");
const Job = require("../models/Job");
const UserProfileModel = require("../models/UserProfile");
const { sendUserDetails, sendSuccessMessage } = require("../helpers/applied");

// Create a new application (With Document Support)
async function createApplication(req, res) {
  try {
    const User = require("../models/User");
    const { userId, jobId, workEligibility } = req.body;
    
    // 🛡️ Canadian Compliance Interdiction
    const validEligibility = ["Canadian Citizen", "Permanent Resident", "Work Permit"];
    if (!validEligibility.includes(workEligibility)) {
        return res.status(403).json({ 
            message: "Application Interdicted: Only candidates with valid Canadian work authorization are eligible for this position." 
        });
    }

    // Fetch user for name fallback if fullname is not provided
    const user = await User.findByPk(userId);
    const userProfile = await UserProfileModel.findOne({ where: { userId } });
    
    // Populate fullname to satisfy the database constraint
    let fullname = req.body.fullname;
    if (!fullname) {
        if (userProfile && userProfile.firstName) {
            fullname = `${userProfile.firstName} ${userProfile.lastName || ""}`.trim();
        } else if (user && user.username) {
            fullname = user.username;
        } else {
            fullname = "Personnel Hub User";
        }
    }
    
    const appData = {
       userId,
       jobId,
       fullname,
       workEligibility,
       status: "Submitted"
    };

    // Handle File Upload (Resume)
    if (req.file) {
       const { originalname, buffer, mimetype } = req.file;
       appData.resumeUrl = `data:${mimetype};base64,${buffer.toString("base64")}`;
    }

    const application = await Application.create(appData);

    const jobDetails = await Job.findByPk(jobId);

    // Send user details and job details via email
    await sendUserDetails(userProfile, jobDetails);
    await sendSuccessMessage(userProfile, jobDetails);

    res.status(201).json(application);
  } catch (error) {
    console.error("Create application failed:", error);
    res.status(400).json({ message: error.message });
  }
}

// Get all applications
async function getAllApplications(req, res) {
  try {
    const applications = await Application.findAll({
      include: [
        { model: Job, attributes: ['title', 'description', 'department'] },
        { model: require("../models/UserProfile"), required: false }
      ]
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get an application by ID
async function getApplicationById(req, res) {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update an application by ID
async function updateApplication(req, res) {
  try {
    const [updated] = await Application.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Delete an application by ID
async function deleteApplication(req, res) {
  try {
    const deleted = await Application.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json({ message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function checkIfUserApplied(req, res) {
  try {
    const userId = req.params.userId;
    const jobId = req.params.jobId;

    const application = await Application.findOne({ where: { userId, jobId } });

    if (application) {
      res.json({ applied: true });
    } else {
      res.json({ applied: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all jobs applied by a specific user
async function getAppliedJobsByUserId(req, res) {
  try {
    const userId = req.params.userId;
    // Find all applications where userId matches
    const applications = await Application.findAll({ where: { userId } });
    // Extract the jobIds from applications
    const jobIds = applications.map((application) => application.jobId);
    // Fetch details of jobs with these jobIds
    const jobs = await Job.findAll({ where: { id: jobIds } });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getApplicationsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const applications = await Application.findAll({
      where: { userId },
      include: [{ model: Job }]
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  checkIfUserApplied,
  getAppliedJobsByUserId,
  getApplicationsByUserId,
};
