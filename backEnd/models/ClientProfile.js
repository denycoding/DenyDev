const mongoose = require("mongoose");

const ClientProfileSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    image: {
      type: String,
      default: "",
    },

    clientName: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    companyName: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    aboutCompany: {
      type: String,
      default: "",
    },

    clientType: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ClientProfile", ClientProfileSchema);
