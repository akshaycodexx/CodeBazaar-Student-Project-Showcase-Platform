const Plan = require("../models/PlanModel");

// Create Plan
exports.createPlan = async (req, res) => {
    try {
        const { name, price, duration, features, recommended, buttonText } = req.body;

        const newPlan = new Plan({
            name,
            price,
            duration,
            features: features ? (Array.isArray(features) ? features : features.split(',').map(f => f.trim())) : [],
            recommended,
            buttonText
        });

        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get All Plans
exports.getAllPlans = async (req, res) => {
    try {
        const plans = await Plan.find().sort({ price: 1 });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete Plan
exports.deletePlan = async (req, res) => {
    try {
        await Plan.findByIdAndDelete(req.params.id);
        res.json({ message: "Plan deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
