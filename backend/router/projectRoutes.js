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
const { protect } = require("../middleware/authMiddleware");

// Helper function to upload to Cloudinary from buffer
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ✅ GET all projects with Search, Filter & Pagination
router.get("/getallprojects", async (req, res) => {
  try {
    const { search, tag, sort, page = 1, limit = 10 } = req.query;
    const query = {};

    // Search by title (case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Sort options
    let sortOptions = { _id: -1 }; // Default: Newest first
    if (sort === "oldest") sortOptions = { _id: 1 };
    if (sort === "price_high") sortOptions = { price: -1 };
    if (sort === "price_low") sortOptions = { price: 1 };
    if (sort === "stars") sortOptions = { stars: -1 };

    // Pagination
    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .populate("owner", "username profilePicture")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .lean(); // Optimization: Return plain JS objects

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalProjects: total,
    });
  } catch (error) {
    console.error("Fetch projects error:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// ✅ GET single project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "username profilePicture")
      .lean();
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
    body("price")
      .notEmpty()
      .isNumeric()
      .withMessage("Price is required and must be a number"),
    validate,
  ],
  async (req, res) => {
    try {
      const { title, description, price, owner, tags, learning, stars } =
        req.body;

      if (!req.files || !req.files.coverImage || !req.files.logoImage) {
        return res
          .status(400)
          .json({ message: "Both cover and logo images are required" });
      }

      // Validate owner (convert to ObjectId if your schema expects it)
      let ownerId = owner;
      if (mongoose.Types.ObjectId.isValid(owner)) {
        ownerId = new mongoose.Types.ObjectId(owner);
      }

      // Upload images
      const coverImageUrl = await uploadToCloudinary(
        req.files.coverImage[0].buffer,
      );
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
        stars: stars || 0,
        liveDemoLink: req.body.liveDemoLink || "",
        likes: [],
        comments: [], // Correct field name
        comments: [], // Correct field name
      });

      await newProject.save();
      res.status(201).json(newProject);
    } catch (error) {
      console.error("Upload error details:", error);
      res.status(500).json({ message: error.message, stack: error.stack });
    }
  },
);

// POST - Like a project
router.post("/:id/like", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check if valid user
    if (!req.user || !req.user._id) return res.status(401).json({ message: "Unauthorized" });

    // Check if already liked
    const index = project.likes.indexOf(req.user._id);
    if (index === -1) {
      // Like
      project.likes.push(req.user._id);
    } else {
      // Unlike
      project.likes.splice(index, 1);
    }

    await project.save();
    res.json(project.likes);
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST - Add a comment
router.post("/:id/comment", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const newComment = {
      user: req.user._id,
      text,
      createdAt: new Date()
    };

    project.comments.unshift(newComment);
    await project.save();

    // Populate the user in the new comment to return it
    const updatedProject = await Project.findById(req.params.id).populate("comments.user", "username profilePicture");

    res.json(updatedProject.comments);
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add Devlog Update
router.post("/:id/updates", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    project.updates.push({ title, description });
    await project.save();
    res.json(project.updates);
  } catch (err) {
    res.status(500).json({ message: "Failed to add update" });
  }
});

module.exports = router;
