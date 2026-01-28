const express = require("express");
const router = express.Router();
const { createMentor, getAllMentors, deleteMentor } = require("../controllers/mentorController");
const { protect } = require("../middleware/authMiddleware"); // Use existing protect middleware
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public
router.get("/", getAllMentors);

// Admin / Protected (Assuming protect checks for token, ideally we check for admin role too)
router.post("/", protect, upload.single("image"), createMentor); // In real app, add admin middleware
router.delete("/:id", protect, deleteMentor);

module.exports = router;
