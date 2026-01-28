const express = require("express");
const router = express.Router();
const { createBooking, getMyBookings, getMentorSessions } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.get("/mentor-sessions", protect, getMentorSessions);

module.exports = router;
