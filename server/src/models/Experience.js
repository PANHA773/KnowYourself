const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    difficulty: { type: Number, min: 1, max: 5, default: 3 },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);

