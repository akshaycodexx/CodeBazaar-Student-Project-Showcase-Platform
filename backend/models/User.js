const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "recruiter", "recuritor", "admin", "mentor"], // Support both spellings and new mentor role
      required: true,
    },
    profilePicture: {
      type: String,
    },

    // Student fields
    collegeName: String,
    branch: String,
    github: String,
    linkedin: String,

    // Recruiter fields
    companyName: String,
    designation: String,
    companyWebsite: String,
    recruiterLinkedin: String,

    // Admin fields
    adminDept: String,
    adminCode: String,

    // Mentor fields
    pricePerSession: Number,
    skills: [String], // or String if comma separated


    // Shopping Cart
    cart: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    }],

    // Gamification
    points: { type: Number, default: 0 },
    badges: [{ type: String }], // 'Verified', 'Top Contributor', 'Hackathon Winner'
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
