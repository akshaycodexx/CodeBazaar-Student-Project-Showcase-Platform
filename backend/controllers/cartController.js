const User = require("../models/User");
const Project = require("../models/project/project");

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { projectId } = req.body;
        const user = await User.findById(req.user._id);

        if (user.cart.includes(projectId)) {
            return res.status(400).json({ message: "Item already in cart" });
        }

        user.cart.push(projectId);
        await user.save();

        // Return full cart details
        const populatedUser = await User.findById(req.user._id).populate("cart");
        res.json(populatedUser.cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { projectId } = req.params;
        const user = await User.findById(req.user._id);

        user.cart = user.cart.filter(id => id.toString() !== projectId);
        await user.save();

        const populatedUser = await User.findById(req.user._id).populate("cart");
        res.json(populatedUser.cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get current user's cart
exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("cart");
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
