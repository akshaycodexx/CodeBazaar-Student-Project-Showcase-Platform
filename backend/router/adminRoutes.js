const express = require("express");
const router = express.Router();
const { getStats, getAllUsers, deleteUser, getAllProjects, deleteProject } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

// Middleware to check Admin role
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as admin" });
    }
};

router.get("/stats", protect, admin, getStats);
router.get("/users", protect, admin, getAllUsers);
router.delete("/users/:id", protect, admin, deleteUser);
router.get("/projects", protect, admin, getAllProjects);
router.delete("/projects/:id", protect, admin, deleteProject);

module.exports = router;
