const User = require("../models/User");

exports.getLeaderboard = async (req, res) => {
    try {
        // Simple logic: Sort by points (descending) and limit to top 50
        // In a real app, points could be calculated dynamically or updated via triggers.
        // For now, we assume 'points' field is populated.
        const users = await User.find({ role: "student" }) // Only rank students
            .sort({ points: -1 })
            .limit(50)
            .select("fullName profilePicture points badges role");

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};
