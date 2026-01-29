const express = require("express");
const router = express.Router();
const { enhanceText, generateSummary } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/enhance", protect, enhanceText);
router.post("/summary", protect, generateSummary);

module.exports = router;
