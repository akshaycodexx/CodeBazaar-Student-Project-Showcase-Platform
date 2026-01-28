const express = require("express");
const router = express.Router();
const { scheduleInterview, getMyInterviews, getInterviewDetails } = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/schedule", protect, scheduleInterview);
router.get("/my-interviews", protect, getMyInterviews);
router.get("/:id", protect, getInterviewDetails);

module.exports = router;
