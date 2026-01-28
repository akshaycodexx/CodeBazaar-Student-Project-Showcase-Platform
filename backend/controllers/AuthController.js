const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");
require("dotenv").config();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Upload image buffer to Cloudinary
const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "CodeBazaarProfilePics" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// ========================
//        SIGNUP
// ========================
const Signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      username,
      password,
      role,
      collegeName,
      branch,
      github,
      linkedin,
      companyName,
      designation,
      companyWebsite,
      recruiterLinkedin,
      adminDept,
      adminCode,
    } = req.body;

    // Check if user email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already exists" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);

    // Upload profile picture to Cloudinary (if file is provided)
    let profilePictureUrl = "";
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      profilePictureUrl = uploaded.secure_url;
    }

    // Create new user object
    const newUser = new User({
      fullName,
      email,
      mobile,
      username,
      password: hashedpass,
      role,
      profilePicture: profilePictureUrl,
      ...(role === "student" && { collegeName, branch, github, linkedin }),
      ...(role === "recuritor" && {
        companyName,
        designation,
        companyWebsite,
        recruiterLinkedin,
      }),
      ...(role === "admin" && { adminDept, adminCode }),
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server Error. Please try again later." });
  }
};

// ========================
//        SIGNIN
// ========================
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Always true for cross-site (Vercel/Render compatibility)
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Send user data back
    res.status(200).json({
      message: "Login Successfully!!",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
        fullName: user.fullName,
        profilePicture: user.profilePicture || "",
      },
    });
  } catch (error) {
    console.error("Signin error:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
};

// ========================
//        LOGOUT
// ========================
const Logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logout successfully !!" });
};

// ========================
//     UPDATE PROFILE
// ========================
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // From auth middleware
    const { fullName, mobile, github, linkedin, collegeName, branch, companyName, designation, companyWebsite } = req.body;

    let updateData = {
      fullName,
      mobile,
      github,
      linkedin,
      collegeName,
      branch,
      companyName,
      designation,
      companyWebsite
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // Handle Profile Picture Upload
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      updateData.profilePicture = uploaded.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

    res.status(200).json({
      message: "Profile updated successfully!",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// ========================
//     GET USER BY ID (Public)
// ========================
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -email -mobile"); // Exclude sensitive info
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

module.exports = { Signup, signin, Logout, updateProfile, getUserById };
