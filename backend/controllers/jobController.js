const Job = require("../models/Job");
const User = require("../models/User");

// Create Job (Recruiter Only)
exports.createJob = async (req, res) => {
    try {
        const { title, description, type, location, salary, skills } = req.body;

        // Ensure user is recruiter (middleware check preferred, but double check here if needed)
        // Assuming 'protect' middleware adds req.user

        const job = new Job({
            recruiter: req.user.id,
            companyName: req.user.companyName || "Unknown Company",
            title,
            description,
            type,
            location,
            salary,
            skills
        });

        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: "Job creation failed" });
    }
};

// Get All Jobs
exports.getAllJobs = async (req, res) => {
    try {
        const { type, location } = req.query;
        let query = {};
        if (type) query.type = type;
        if (location) query.location = { $regex: location, $options: "i" };

        const jobs = await Job.find(query).sort({ createdAt: -1 }).populate("recruiter", "fullName email profilePicture");
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};

// Apply for Job (Student Only)
exports.applyForJob = async (req, res) => {
    try {
        const { resume } = req.body;
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Check if already applied
        const alreadyApplied = job.applicants.some(app => app.user.toString() === req.user.id);
        if (alreadyApplied) {
            return res.status(400).json({ message: "You have already applied for this position." });
        }

        job.applicants.push({
            user: req.user.id,
            resume: resume || "",
            status: "Applied"
        });

        await job.save();
        res.json({ message: "Application submitted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Application failed" });
    }
};

// Get Job with Applicants (Recruiter Only)
exports.getJobApplicants = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate("applicants.user", "fullName email profilePicture headline");
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Ensure strictly only the recruiter can see this
        if (job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        res.json(job.applicants);
    } catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};

// Update Application Status
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { userId, status } = req.body;
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const applicant = job.applicants.find(app => app.user.toString() === userId);
        if (!applicant) return res.status(404).json({ message: "Applicant not found" });

        applicant.status = status;
        await job.save();

        res.json({ message: "Status updated", status });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};
