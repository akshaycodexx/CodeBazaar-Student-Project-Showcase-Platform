const User = require("../models/User");

// Get All Mentors
// Fetches all users with role 'mentor'
exports.getAllMentors = async (req, res) => {
    try {
        const mentors = await User.find({ role: 'mentor' })
            .select("fullName role designation companyName skills linkedin profilePicture pricePerSession createdAt");

        // Map to match frontend expectations or update frontend. 
        // Let's return raw users and update frontend to map them.
        res.json(mentors);
    } catch (error) {
        console.error("Fetch mentors error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Create Mentor is irrelevant if we use Signup flow. 
// If Admin needs to manually add, we can keep logic but point to User model.
// But mostly we rely on Signup. 
// I'll assume users sign up as mentors.

// Delete Mentor (Admin only) - keeps deleting user
exports.deleteMentor = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Mentor deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
