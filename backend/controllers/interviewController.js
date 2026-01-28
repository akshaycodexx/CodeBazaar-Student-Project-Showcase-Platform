const Interview = require("../models/Interview");
const User = require("../models/User");

// Schedule Interview
exports.scheduleInterview = async (req, res) => {
    try {
        const { mentorId, date, topic } = req.body;

        // In a real app, verify mentor availability here

        const interview = new Interview({
            mentor: mentorId,
            student: req.user.id,
            date,
            topic,
            problem: {
                title: "Two Sum",
                description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                starterCode: "function twoSum(nums, target) {\n  // Write your code here\n}"
            }
        });

        await interview.save();
        res.status(201).json(interview);
    } catch (error) {
        res.status(500).json({ message: "Scheduling failed" });
    }
};

// Get My Interviews (Both as Mentor and Student)
exports.getMyInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({
            $or: [{ student: req.user.id }, { mentor: req.user.id }]
        })
            .populate("mentor", "fullName profilePicture")
            .populate("student", "fullName profilePicture")
            .sort({ date: 1 });

        res.json(interviews);
    } catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};

// Get Interview Room Details
exports.getInterviewDetails = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id)
            .populate("mentor", "fullName")
            .populate("student", "fullName");

        if (!interview) return res.status(404).json({ message: "Interview not found" });

        // Security check: only participants can view
        if (interview.student._id.toString() !== req.user.id && interview.mentor._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        res.json(interview);
    } catch (error) {
        res.status(500).json({ message: "Error loading room" });
    }
};
