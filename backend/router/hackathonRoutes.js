const express = require("express");
const router = express.Router();

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
router.get("/:id", getHackathonById);

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

router.delete("/:id", protect, deleteHackathon);

module.exports = router;
