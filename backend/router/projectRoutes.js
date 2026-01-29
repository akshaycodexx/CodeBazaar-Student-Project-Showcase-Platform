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
        stars: stars || 0,
        liveDemoLink: req.body.liveDemoLink || "",
        githubLink: req.body.githubLink || "",
        likes: [],
        comments: [], // Correct field name
        comments: [], // Correct field name
      });

      await newProject.save();

      // Gamification
      const { awardPoints } = require("../utils/gamification");
      awardPoints(ownerId, 50, "Uploaded a new Project");

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
    const { awardPoints } = require("../utils/gamification");
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check if valid user
    if (!req.user || !req.user._id) return res.status(401).json({ message: "Unauthorized" });

    // Check if already liked
    const index = project.likes.indexOf(req.user._id);
    if (index === -1) {
      // Like
      project.likes.push(req.user._id);
      awardPoints(project.owner, 10, "Your project received a like");
      awardPoints(req.user._id, 2, "Liked a project"); // Small reward for engagement
    } else {
      // Unlike
      project.likes.splice(index, 1);
      // Optional: Deduct points? Maybe not to avoid complexity logic
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
    const { awardPoints } = require("../utils/gamification");
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

    // Gamification
    awardPoints(req.user._id, 5, "Commented on a project");

    // Populate the user in the new comment to return it
    const updatedProject = await Project.findById(req.params.id).populate("comments.user", "username profilePicture");

    res.json(updatedProject.comments);
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add Devlog Update
router.post("/:id/updates", protect, upload.array("images", 5), async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer);
        imageUrls.push(url);
      }
    }

    project.updates.push({ title, description, images: imageUrls });
    await project.save();

    // Notify Followers (Likers)
    const { createNotification } = require("../controllers/notificationController");
    if (project.likes && project.likes.length > 0) {
      const notificationPromises = project.likes.map(userId =>
        createNotification(userId, "system", `New Update on ${project.title}: ${title}`, `/projects/${project._id}`)
      );
      // Fire and forget notifications to not block response
      Promise.all(notificationPromises).catch(console.error);
    }

    res.json(project.updates);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to add update" });
  }
});

// Fetch GitHub Repository Info
router.post("/github-info", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: "GitHub URL is required" });

    // Extract owner/repo from URL
    // Format: https://github.com/owner/repo
    const parts = url.split("github.com/");
    if (parts.length < 2) return res.status(400).json({ message: "Invalid GitHub URL" });

    const repoPath = parts[1].split("/");
    const owner = repoPath[0];
    const repo = repoPath[1]?.replace(".git", ""); // Handle .git extension if present

    if (!owner || !repo) return res.status(400).json({ message: "Invalid Repository Path" });

    // Fetch from GitHub API
    const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!githubRes.ok) return res.status(githubRes.status).json({ message: "Repository not found or private" });

    const data = await githubRes.json();

    res.json({
      title: data.name,
      description: data.description || "",
      tags: data.topics || [], // GitHub topics are arrays
      // stars: data.stargazers_count, // We calculate random stars in frontend currently, maybe use real ones? Using real ones is better!
      realStars: data.stargazers_count
    });

  } catch (err) {
    console.error("GitHub Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch GitHub info" });
  }
});

// GitHub Sync Endpoint
router.post("/:id/sync", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
    if (!project.githubLink) return res.status(400).json({ message: "No GitHub link linked to this project" });

    // Parse Owner/Repo
    const parts = project.githubLink.split("github.com/");
    if (parts.length < 2) return res.status(400).json({ message: "Invalid GitHub URL" });
    const repoPath = parts[1].split("/");
    const owner = repoPath[0];
    const repo = repoPath[1]?.replace(".git", "");

    // Prepare API Headers (Optional: Add Token if rate limits are an issue, for now public access)
    const headers = { "User-Agent": "CodeBazaar-Platform" };

    // 1. Fetch Metadata
    const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!metaRes.ok) throw new Error("GitHub Repo not found");
    const metaData = await metaRes.json();

    // 2. Fetch Readme
    let readmeText = "";
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
      if (readmeRes.ok) {
        const readmeJson = await readmeRes.json();
        // Fetch raw content
        const rawRes = await fetch(readmeJson.download_url);
        readmeText = await rawRes.text();
      }
    } catch (e) { console.warn("Readme fetch failed", e); }

    // 3. Fetch Commits
    let commitData = [];
    try {
      const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, { headers });
      if (commitsRes.ok) {
        const commitsJson = await commitsRes.json();
        commitData = commitsJson.map(c => ({
          message: c.commit.message,
          sha: c.sha,
          date: c.commit.author.date,
          author: c.commit.author.name
        }));
      }
    } catch (e) { console.warn("Commits fetch failed", e); }

    // Update Project
    project.githubMetadata = {
      stars: metaData.stargazers_count,
      forks: metaData.forks_count,
      lastCommit: metaData.pushed_at
    };
    project.stars = metaData.stargazers_count; // Auto-update platform stars too? user might prefer manual. Let's keep manual or allow sync. Let's sync it.
    project.readmeContent = readmeText;
    project.recentCommits = commitData;
    project.lastSyncedAt = new Date();

    await project.save();
    res.json(project);

  } catch (err) {
    console.error("Sync Error:", err);
    res.status(500).json({ message: "Sync failed: " + err.message });
  }
});

// Analytics Tracking Endpoints
router.post("/:id/view", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const projectId = req.params.id;

    // Increment Global Views
    await Project.findByIdAndUpdate(projectId, { $inc: { "analytics.views": 1 } });

    // Try to increment Daily Views
    const result = await Project.updateOne(
      { _id: projectId, "dailyAnalytics.date": today },
      { $inc: { "dailyAnalytics.$.views": 1 } }
    );

    // If day entry doesn't exist, create it
    if (result.modifiedCount === 0) {
      await Project.findByIdAndUpdate(projectId, {
        $push: { dailyAnalytics: { date: today, views: 1, clicks: 0 } }
      });
    }

    res.sendStatus(200);
  } catch (e) { res.sendStatus(500); }
});

router.post("/:id/click", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const projectId = req.params.id;

    // Increment Global Clicks
    await Project.findByIdAndUpdate(projectId, { $inc: { "analytics.clicks": 1 } });

    // Try to increment Daily Clicks
    const result = await Project.updateOne(
      { _id: projectId, "dailyAnalytics.date": today },
      { $inc: { "dailyAnalytics.$.clicks": 1 } }
    );

    // If day entry doesn't exist, create it
    if (result.modifiedCount === 0) {
      await Project.findByIdAndUpdate(projectId, {
        $push: { dailyAnalytics: { date: today, views: 0, clicks: 1 } }
      });
    }

    res.sendStatus(200);
  } catch (e) { res.sendStatus(500); }
});

module.exports = router;
