const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { listExperiences, createExperience } = require("../controllers/experiences.controller");

router.get("/", listExperiences);
router.post("/", requireAuth, createExperience);

module.exports = router;

