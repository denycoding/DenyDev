const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientName: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

const freelancerProfileSchema = new mongoose.Schema(
  {
    accountType: {
      type: String,
      enum: ["Blocked", "unBlock"],
      default: "unBlock",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    portfolio: {
      type: String,
      default: "",
      trim: true,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    experience: {
      type: String,
      default: "",
      trim: true,
    },

    projects: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    hourlyRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    // ==========================================
    // REVIEWS
    // ==========================================

    reviews: {
      type: [reviewSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("FreelancerProfile", freelancerProfileSchema);
