const Experience = require("../models/Experience");

async function listExperiences(_req, res) {
  const experiences = await Experience.find({})
    .sort({ createdAt: -1 })
    .populate("author", "name")
    .select("title body difficulty tags author createdAt");
  res.json({ experiences });
}

async function createExperience(req, res) {
  const { title, body, difficulty, tags } = req.body || {};
  if (!title || !body) return res.status(400).json({ message: "title and body are required" });

  const doc = await Experience.create({
    author: req.user.sub,
    title: String(title),
    body: String(body),
    difficulty: difficulty ? Number(difficulty) : 3,
    tags: Array.isArray(tags) ? tags.map(String) : []
  });

  res.status(201).json({ experience: doc });
}

module.exports = { listExperiences, createExperience };

