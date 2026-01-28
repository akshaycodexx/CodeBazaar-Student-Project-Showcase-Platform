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
    date: { type: Date, default: Date.now }
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
