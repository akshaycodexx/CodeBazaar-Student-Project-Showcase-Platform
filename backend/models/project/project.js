const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  logoUrl: {
    type: String,
    required: true
  },
  coverImageUrl: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  learning: {
    type: [String],
    default: []
  },
  price: {
    type: String,
    default: "0"
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  liveDemoLink: {
    type: String,
    default: ""
  },
  githubLink: {
    type: String,
    default: ""
  },
  // Analytics
  analytics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }, // Click on Live Demo
    impressions: { type: Number, default: 0 }
  },
  dailyAnalytics: [{
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
  }],
  stars: {
    type: Number,
    default: 0
  },
  // Array of User IDs who liked the project
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  updates: [{
    title: String,
    description: String,
    images: [String],
    date: { type: Date, default: Date.now },
  }],
  // Array of comment objects
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // GitHub Sync Data
  readmeContent: { type: String, default: "" },
  lastSyncedAt: { type: Date },
  githubMetadata: {
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    lastCommit: { type: Date }
  },
  recentCommits: [{
    message: String,
    sha: String,
    date: Date,
    author: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
