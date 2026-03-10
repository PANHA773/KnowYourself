const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    scores: {
      R: { type: Number, default: 0 },
      I: { type: Number, default: 0 },
      A: { type: Number, default: 0 },
      S: { type: Number, default: 0 },
      E: { type: Number, default: 0 },
      C: { type: Number, default: 0 }
    },
    topCodes: { type: [String], default: [] },
    personalityLabel: { type: String, default: "" },
    recommendedMajors: { type: [String], default: [] },
    recommendedCareers: { type: [String], default: [] },
    answers: { type: [Number], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestResult", testResultSchema);

