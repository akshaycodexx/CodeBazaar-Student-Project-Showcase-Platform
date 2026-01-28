const express = require("express");
const router = express.Router();
const { getUserOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getUserOrders);

module.exports = router;
