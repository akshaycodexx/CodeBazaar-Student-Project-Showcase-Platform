const express = require("express");
const router = express.Router();
const { createPlan, getAllPlans, deletePlan } = require("../controllers/planController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllPlans);
router.post("/", protect, createPlan);
router.delete("/:id", protect, deletePlan);

module.exports = router;
