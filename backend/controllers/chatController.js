const Message = require("../models/MessageModel");
const User = require("../models/User");

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;

        if (!text || !receiverId) {
            return res.status(400).json({ message: "Receiver and text are required" });
        }

        const newMessage = new Message({
            sender: req.user._id,
            receiver: receiverId,
            text
        });

        await newMessage.save();

        // Populate sender details for immediate UI update
        await newMessage.populate("sender", "username profilePicture");

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Send Message Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get messages between current user and another user
exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userId },
                { sender: userId, receiver: myId }
            ]
        })
            .sort({ createdAt: 1 })
            .populate("sender", "username profilePicture");

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Get list of users I have chatted with (conversations)
exports.getConversations = async (req, res) => {
    try {
        const myId = req.user._id;

        // Find all messages where I am sender or receiver
        const messages = await Message.find({
            $or: [{ sender: myId }, { receiver: myId }]
        }).populate("sender receiver", "username profilePicture fullName");

        // Extract unique users
        const usersMap = new Map();

        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === myId.toString() ? msg.receiver : msg.sender;
            if (!usersMap.has(otherUser._id.toString())) {
                usersMap.set(otherUser._id.toString(), otherUser);
            }
        });

        res.json(Array.from(usersMap.values()));
    } catch (error) {
        console.error("Get Conversations Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
