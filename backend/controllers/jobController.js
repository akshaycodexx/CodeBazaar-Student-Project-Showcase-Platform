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
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.applicants.includes(req.user.id)) {
            return res.status(400).json({ message: "Already applied" });
        }

        job.applicants.push(req.user.id);
        await job.save();

        res.json({ message: "Application successful" });
    } catch (error) {
        res.status(500).json({ message: "Application failed" });
    }
};
