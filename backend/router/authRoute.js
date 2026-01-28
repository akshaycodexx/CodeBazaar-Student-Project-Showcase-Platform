const express = require("express");
const router = express.Router();
const { Signup, signin, Logout } = require("../controllers/AuthController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { body } = require("express-validator");
const validate = require("../middleware/validate");

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

module.exports = router;
