const { QUESTIONS } = require("../data/testQuestions");
const { computeTestResult } = require("../utils/testEngine");
const TestResult = require("../models/TestResult");

function getQuestions(_req, res) {
  const lang = _req.query?.lang === "km" ? "km" : "en";
  const safe = QUESTIONS.map((q) => ({
    id: q.id,
    prompt: lang === "km" ? q.promptKm || q.prompt : q.prompt,
    choices: q.choices.map((c) => ({
      text: lang === "km" ? c.textKm || c.text : c.text
    }))
  }));
  res.json({ questions: safe });
}

async function submitTest(req, res) {
  const { answers } = req.body || {};
  if (!Array.isArray(answers) || answers.length !== QUESTIONS.length) {
    return res
      .status(400)
      .json({ message: `answers must be an array of length ${QUESTIONS.length}` });
  }

  const normalized = answers.map((n) => Number(n));
  const computed = computeTestResult(QUESTIONS, normalized);

  const saved = await TestResult.create({
    user: req.user.sub,
    answers: normalized,
    ...computed
  });

  res.status(201).json({
    result: {
      id: saved._id,
      ...computed
    }
  });
}

async function latestForMe(req, res) {
  const doc = await TestResult.findOne({ user: req.user.sub }).sort({ createdAt: -1 });
  if (!doc) return res.json({ result: null });
  return res.json({
    result: {
      id: doc._id,
      scores: doc.scores,
      topCodes: doc.topCodes,
      personalityLabel: doc.personalityLabel,
      recommendedMajors: doc.recommendedMajors,
      recommendedCareers: doc.recommendedCareers,
      createdAt: doc.createdAt
    }
  });
}

module.exports = { getQuestions, submitTest, latestForMe };
