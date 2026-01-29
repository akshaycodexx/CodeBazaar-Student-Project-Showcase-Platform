const User = require("../models/User");
const { createNotification } = require("../controllers/notificationController"); // Assuming this exists from previous step

const BADGES = [
    { name: "Squire", threshold: 50, description: "Earned 50 points" },
    { name: "Knight", threshold: 100, description: "Earned 100 points" },
    { name: "Noble", threshold: 500, description: "Earned 500 points" },
    { name: "Legend", threshold: 1000, description: "Earned 1000 points" }
];

exports.awardPoints = async (userId, points, reason) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        user.points = (user.points || 0) + points;

        // Check for new badges
        const newBadges = [];
        for (const badge of BADGES) {
            if (user.points >= badge.threshold && !user.badges.includes(badge.name)) {
                user.badges.push(badge.name);
                newBadges.push(badge.name);
            }
        }

        await user.save();

        // Notify user about points
        // Assuming createNotification handles duplicate checks or is lightweight
        // await createNotification(userId, "system", `You earned ${points} points: ${reason}`, "/leaderboard");

        // Notify about badges
        if (newBadges.length > 0) {
            for (const badgeName of newBadges) {
                await createNotification(userId, "system", `Badge Unlocked: ${badgeName}!`, "/profile/me");
            }
        }

    } catch (err) {
        console.error("Gamification Error:", err);
    }
};
