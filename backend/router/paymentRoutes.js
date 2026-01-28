const express = require("express");
const router = express.Router();
const createRazorpayInstance = require("../utils/createRazorpayInstance");
const crypto = require("crypto");
require("dotenv").config();

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
router.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === razorpay_signature) {
    res.status(200).json({ status: "success", message: "Payment Verified" });
  } else {
    res.status(400).json({ status: "failure", message: "Payment Verification Failed" });
  }
});

module.exports = router;
