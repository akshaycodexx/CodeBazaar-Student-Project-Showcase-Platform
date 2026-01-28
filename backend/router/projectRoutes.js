const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");
const Project = require("../models/project/project");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { body } = require("express-validator");
const validate = require("../middleware/validate");

// Helper function to upload to Cloudinary from buffer
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ✅ GET all projects
router.get("/getallprojects", async (req, res) => {
  try {
    const projects = await Project.find().populate("owner", "username profilePicture").sort({ _id: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// ✅ GET single project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// POST - Upload Project
router.post(
  "/uploadproject",
  upload.fields([{ name: "coverImage" }, { name: "logoImage" }]),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").notEmpty().isNumeric().withMessage("Price is required and must be a number"),
    validate
  ],
  async (req, res) => {
    try {
      const { title, description, price, owner, tags, learning, stars } = req.body;

      if (!req.files || !req.files.coverImage || !req.files.logoImage) {
        return res.status(400).json({ message: "Both cover and logo images are required" });
      }

      // Validate owner (convert to ObjectId if your schema expects it)
      let ownerId = owner;
      if (mongoose.Types.ObjectId.isValid(owner)) {
        ownerId = new mongoose.Types.ObjectId(owner);
      }

      // Upload images
      const coverImageUrl = await uploadToCloudinary(req.files.coverImage[0].buffer);
      const logoUrl = await uploadToCloudinary(req.files.logoImage[0].buffer);

      const newProject = new Project({
        title,
        description,
        logoUrl,
        coverImageUrl,
        price,
        owner: ownerId, // Ensure valid ObjectId
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        learning: learning ? learning.split(",").map((l) => l.trim()) : [],
        stars: stars || 0,
        likes: [],
        comments: [], // Correct field name
      });

      await newProject.save();
      res.status(201).json(newProject);
    } catch (error) {
      console.error("Upload error details:", error);
      res.status(500).json({ message: error.message, stack: error.stack });
    }
  }
);


module.exports = router;
