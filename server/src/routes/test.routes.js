const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { getQuestions, submitTest, latestForMe } = require("../controllers/test.controller");

router.get("/questions", getQuestions);
router.get("/me/latest", requireAuth, latestForMe);
router.post("/submit", requireAuth, submitTest);

module.exports = router;

