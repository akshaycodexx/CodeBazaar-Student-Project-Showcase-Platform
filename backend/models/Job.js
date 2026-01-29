const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Internship", "Full-time", "Part-time", "Contract"],
        default: "Internship",
    },
    location: {
        type: String, // 'Remote', 'Bangalore', etc.
        required: true,
    },
    salary: {
        type: String, // '5-10 LPA', 'Stipend: 15k/mo'
    },
    skills: [String],
    applicants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
            type: String,
            enum: ["Applied", "Reviewing", "Interview", "Rejected", "Hired"],
            default: "Applied"
        },
        resume: String,
        appliedAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Job", jobSchema);
