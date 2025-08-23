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
  createHackathon
);

router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "logoImage", maxCount: 1 },
  ]),
  updateHackathon
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
