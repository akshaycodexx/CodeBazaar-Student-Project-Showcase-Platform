const express = require("express");
const router = express.Router();
const createRazorpayInstance = require("../utils/createRazorpayInstance");
const crypto = require("crypto");
require("dotenv").config();
const { protect } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const User = require("../models/User");
const Project = require("../models/project/project");

// Create Order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    const razorpay = createRazorpayInstance();

    const options = {
      amount: amount * 100, // amount in paisa
      currency: "INR",
      receipt: "receipt_" + new Date().getTime(),
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error("Razorpay Order Creation Error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Verify Payment
// Verify Payment & Create Order
router.post("/verify-payment", protect, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, projects, amount } = req.body;
  // projects: array of project IDs

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === razorpay_signature) {
    try {
      // Create Order
      const newOrder = new Order({
        user: req.user._id,
        projects: projects,
        amount: amount,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: "completed"
      });
      await newOrder.save();

      // Clear Cart if purchase successful
      // We remove purchased projects from cart
      const user = await User.findById(req.user._id);

      // Filter out purchased projects from cart
      user.cart = user.cart.filter(cartItemId => !projects.includes(cartItemId.toString()));
      await user.save();

      res.status(200).json({ status: "success", message: "Payment Verified & Order Placed", orderId: newOrder._id });
    } catch (err) {
      console.error("Order Save Error:", err);
      res.status(200).json({ status: "success", message: "Payment Verified but order save failed", error: err.message }); // Don't fail the payment on frontend if money deducted
    }
  } else {
    res.status(400).json({ status: "failure", message: "Payment Verification Failed" });
  }
});

module.exports = router;
