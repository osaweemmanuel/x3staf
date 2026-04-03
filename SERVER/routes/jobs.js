// routes/jobs.js

const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/JobApp");
const { sendAssignmentEmail, sendNewJobEmail } = require("../helpers/applied");
const { sequelize } = require("../config/database");

// GET all jobs (Filtered by availability + Server-side Pagination)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9; // Default 9 jobs per page
    const offset = (page - 1) * limit;

    // Fetch jobs with pagination and filter by availability
    const { count, rows: jobs } = await Job.findAndCountAll({
      where: { assignedTo: null },
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']] // Newest first
    });

    console.log(`[JOBS_GET] Returning ${jobs.length} jobs (Page ${page}/${Math.ceil(count/limit)})`);

    res.json({
      jobs,
      totalJobs: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(`[JOBS_GET_ERROR] ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// GET a specific job
router.get("/:id", getJob, (req, res) => {
  res.json(res.job);
});

// CREATE a new job
router.post("/", async (req, res) => {
  try {
    const newJob = await Job.create(req.body);
    // Find all users who have applied to at least one job before
    const previousApplicants = await Application.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('userId')), 'userId']]
    });
    const applicantUserIds = previousApplicants.map(app => app.userId);
    
    const userEmails = await User.findAll({ 
      where: { id: applicantUserIds },
      attributes: ['email'] 
    });
    
    const emails = userEmails.map((user) => user.email);
    if (emails.length > 0) {
      await sendNewJobEmail(emails, newJob);
    }
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a job
// PATCH route to update a job by its unique identifier
router.patch("/:id", getJob, async (req, res) => {
  try {
    // Update all fields provided in the request body
    Object.assign(res.job, req.body);
    const updatedJob = await res.job.save();
    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a job
router.delete("/:id", getJob, async (req, res) => {
  try {
    // Ensure that res.job is an instance of the Job model
    if (!(res.job instanceof Job)) {
      return res.status(400).json({ message: "Invalid job object" });
    }

    // Delete all applications associated with the job
    await Application.destroy({ where: { jobId: res.job.id } });

    // Delete the job
    await res.job.destroy();

    res.json({ message: "Job and associated applications deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to fetch job by ID
async function getJob(req, res, next) {
  try {
    const job = await Job.findByPk(req.params.id);
    if (job == null) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.job = job;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Add a new route to assign a job to a user
router.patch("/:id/assign/:userId", getJob, async (req, res) => {
  try {
    // Ensure that the user exists
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Assign the job to the user
    res.job.assignedTo = req.params.userId;
    const updatedJob = await res.job.save();

    // Send congratulations email to the user
    await sendAssignmentEmail(user.email, updatedJob);

    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Modify the route to update a job to include assigning the job to a user
router.patch("/:id", getJob, async (req, res) => {
  try {
    // Update all fields provided in the request body
    Object.assign(res.job, req.body);

    // Optionally, assign the job to a user if specified in the request body
    if (req.body.assignedTo) {
      res.job.assignedTo = req.body.assignedTo;
    }

    const updatedJob = await res.job.save();
    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Optionally, add routes to remove assignments if needed
router.patch("/:id/removeAssignment", getJob, async (req, res) => {
  try {
    res.job.assignedTo = null;
    const updatedJob = await res.job.save();
    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all applications where userId matches
    const applications = await Application.findAll({ where: { userId } });

    // Extract the jobIds from applications
    const jobIds = applications.map((application) => application.jobId);

    // Fetch details of jobs with these jobIds
    const jobs = await Job.findAll({ where: { id: jobIds } });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/applicants/:jobId", async (req, res) => {
  const jobId = req.params.jobId;

  try {
    // Find all job applications for this job
    const jobApplications = await Application.findAll({ where: { jobId } });

    // Extract user IDs from job applications
    const userIds = jobApplications.map((application) => application.userId);

    // Find users who applied for this job
    const users = await User.findAll({ where: { id: userIds } });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting applicants:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
