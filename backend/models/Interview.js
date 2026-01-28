const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    topic: {
        type: String,
        enum: ["DSA", "Frontend", "Backend", "System Design"],
        default: "DSA",
    },
    status: {
        type: String,
        enum: ["Scheduled", "Completed", "Cancelled"],
        default: "Scheduled",
    },
    problem: {
        title: String,
        description: String,
        starterCode: String,
    },
    feedback: {
        rating: Number, // 1-5
        comments: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Interview", interviewSchema);
