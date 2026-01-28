const express = require("express");
const router = express.Router();
const { createJob, getAllJobs, applyForJob } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createJob);
router.get("/", getAllJobs);
router.post("/:id/apply", protect, applyForJob);

module.exports = router;
