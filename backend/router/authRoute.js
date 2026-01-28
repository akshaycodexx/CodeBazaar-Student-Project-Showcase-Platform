const express = require("express");
const router = express.Router();
const { Signup, signin, Logout, updateProfile, getUserById } = require("../controllers/AuthController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

router.post(
  "/signup",
  upload.single("profilePicture"),
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["student", "recuritor", "admin"]).withMessage("Invalid role"),
    validate,
  ],
  Signup
);

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").exists().withMessage("Password is required"),
    validate,
  ],
  signin
);

router.get("/logout", Logout);

// Update Profile Route
router.put(
  "/update-profile",
  auth, // Ensure user is logged in
  upload.single("profilePicture"),
  updateProfile
);

// Get User Public Profile
router.get("/user/:id", getUserById);

module.exports = router;
