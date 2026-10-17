const mongoose = require("mongoose");

const PendingRegistrationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["client", "freelancer"],
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    otpExpiresAt: {
      type: Date,
      required: true,
    },

    resendAvailableAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Automatically remove expired pending registrations.
// OTP expiry is checked separately by the verification route.
PendingRegistrationSchema.index(
  { otpExpiresAt: 1 },
  { expireAfterSeconds: 86400 }
);

module.exports = mongoose.model(
  "PendingRegistration",
  PendingRegistrationSchema
);