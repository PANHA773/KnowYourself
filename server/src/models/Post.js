const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    titleKm: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    excerptKm: { type: String, default: "" },
    content: { type: String, default: "" },
    contentKm: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
