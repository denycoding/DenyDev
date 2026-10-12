const mongoose = require("mongoose");

const postJobSchema = new mongoose.Schema({
  // Client Information
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  clientName: {
    type: String,
    required: true,
  },

  // Project Information
  title: {
    type: String,
    required: true,
    trim: true,
  },

  companyName: {
    type: String,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  projectType: {
    type: String,
    enum: [
      "Website",
      "Web Application",
      "Mobile Application",
      "API / Backend",
      "UI/UX Design",
      "Data Science",
      "AI / Machine Learning",
      "Other",
    ],
  },

  experienceLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Expert"],
  },

  duration: {
    type: String,
  },

  // Budget
  budgetMin: {
    type: Number,
    required: true,
  },

  budgetMax: {
    type: Number,
    required: true,
  },

  // Deadline
  deadline: {
    type: String,
    required: true,
  },

  // Project Status
  status: {
    type: String,
    enum: ["open", "in-progress", "completed", "cancelled"],
    default: "open",
  },

  // Assigned Freelancer
  assignedFreelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // Proposal Count
  proposals: {
    type: Number,
    default: 0,
  },

  // Posting Date
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PostJob", postJobSchema);
