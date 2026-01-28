const Mentor = require("../models/MentorModel");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

// Upload helper
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "CodeBazaarMentors" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

// Create Mentor
exports.createMentor = async (req, res) => {
    try {
        const { name, role, company, skills, linkedin, description, pricePerSession } = req.body;
        let imageUrl = "";

        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer);
        }

        const newMentor = new Mentor({
            name,
            role,
            company,
            image: imageUrl,
            skills: skills ? skills.split(',').map(s => s.trim()) : [],
            linkedin,
            description,
            pricePerSession
        });

        await newMentor.save();
        res.status(201).json(newMentor);
    } catch (error) {
        console.error("Create Mentor Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get All Mentors
exports.getAllMentors = async (req, res) => {
    try {
        const mentors = await Mentor.find();
        res.json(mentors);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete Mentor
exports.deleteMentor = async (req, res) => {
    try {
        await Mentor.findByIdAndDelete(req.params.id);
        res.json({ message: "Mentor deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
