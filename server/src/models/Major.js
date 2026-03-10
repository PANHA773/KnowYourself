const mongoose = require("mongoose");

const majorSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    titleKm: { type: String, default: "" },
    description: { type: String, default: "" },
    descriptionKm: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    skills: { type: [String], default: [] },
    skillsKm: { type: [String], default: [] },
    careers: { type: [String], default: [] },
    careersKm: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Major", majorSchema);
