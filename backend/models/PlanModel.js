const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: String, // e.g., 'month', 'year'
        default: 'month',
    },
    features: {
        type: [String],
        default: [],
    },
    recommended: {
        type: Boolean,
        default: false,
    },
    buttonText: {
        type: String,
        default: "Subscribe Now",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Plan", planSchema);
