const User = require("../models/User");
const Project = require("../models/project/project");
const Job = require("../models/Job");
const Interview = require("../models/Interview");

const Order = require("../models/Order");

// Get Global Stats & Graph Data
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalInterviews = await Interview.countDocuments();

        // Calculate Total Revenue
        const revenueAgg = await Order.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        // Calculate Monthly Revenue for Graph
        const monthlyRevenue = await Order.aggregate([
            { $match: { status: "completed" } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Map month numbers to names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const graphData = monthlyRevenue.map(item => ({
            name: monthNames[item._id - 1],
            revenue: item.revenue
        }));

        // Fill missing months if needed (optional, keeping simple for now)

        res.json({
            totalUsers,
            totalProjects,
            totalJobs,
            totalInterviews,
            totalRevenue,
            graphData
        });
    } catch (error) {
        console.error("Stats Error:", error);
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
