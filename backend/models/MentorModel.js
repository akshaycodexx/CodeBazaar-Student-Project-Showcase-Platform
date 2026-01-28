const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String, // e.g., "SDE @ Google"
        required: true,
    },
    company: {
        type: String,
    },
    image: {
        type: String, // URL from Cloudinary
        required: true,
    },
    skills: {
        type: [String],
        default: [],
    },
    linkedin: {
        type: String,
    },
    description: {
        type: String,
    },
    pricePerSession: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Mentor", mentorSchema);
