const User = require("../models/User");
const Project = require("../models/project/project");
const Job = require("../models/Job");
const Interview = require("../models/Interview");

// Get Global Stats
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalInterviews = await Interview.countDocuments();
        const totalRevenue = 125000; // Mock revenue for demo

        res.json({
            totalUsers,
            totalProjects,
            totalJobs,
            totalInterviews,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: "Stats fetch failed" });
    }
};

// Get All Users (with pagination)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Users fetch failed" });
    }
};

// Delete User (Ban)
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
};

// Get All Projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("owner", "username").sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Projects fetch failed" });
    }
};

// Delete Project
exports.deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
};
