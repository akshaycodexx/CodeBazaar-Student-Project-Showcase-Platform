const express = require("express");
const router = express.Router();
const { addToCart, removeFromCart, getCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.delete("/remove/:projectId", protect, removeFromCart);

module.exports = router;
