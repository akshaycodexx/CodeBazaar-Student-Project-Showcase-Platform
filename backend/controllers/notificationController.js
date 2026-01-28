const Notification = require("../models/Notification");

// Get My Notifications
exports.getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};

// Mark as Read
exports.markAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, read: false },
            { $set: { read: true } }
        );
        res.json({ message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

// Internal Helper to Create Notification
exports.createNotification = async (userId, type, message, link) => {
    try {
        const notif = new Notification({ user: userId, type, message, link });
        await notif.save();
    } catch (err) {
        console.error("Notification creation failed", err);
    }
};
