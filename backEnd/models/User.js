const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  fullName: String,

  email: String,

  role: {
    type: String,
    enum: ["client", "freelancer", "admin"],
    default: "client",
  },

  password: String,

  accountType: {
    type: String,
    enum: ["Blocked", "Active"],
    default: "Active",
  },

  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", Schema);
