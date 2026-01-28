const express = require("express");
const router = express.Router();
const Hackathon = require("../models/Hackrathon/HostModel");
const {
  createHackathon,
  getAllHackathons,
  updateHackathon,
  getHackathonById,
  deleteHackathon,
} = require("../controllers/hackathonController");
const { body } = require("express-validator");
const validate = require("../middleware/validate");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

// 📌 Public Route
router.get("/", getAllHackathons);

// 📌 Protected Routes
router.post(
  "/",
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "logoImage", maxCount: 1 },
  ]),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("hostName").notEmpty().withMessage("Host Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("startDate")
      .isISO8601()
      .toDate()
      .withMessage("Start Date is required"),
    body("endDate").isISO8601().toDate().withMessage("End Date is required"),
    body("location").notEmpty().withMessage("Location is required"),
    validate,
  ],
  createHackathon,
);

router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "logoImage", maxCount: 1 },
  ]),
  updateHackathon,
);
// routes/hackathonRoutes.js
router.get("/:id", async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }
    res.json(hackathon);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", protect, deleteHackathon);

module.exports = router;
