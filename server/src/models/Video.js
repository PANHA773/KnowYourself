const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    titleKm: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    descriptionKm: { type: String, default: "" },
    url: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);

