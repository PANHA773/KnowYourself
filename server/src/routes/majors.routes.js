const router = require("express").Router();
const { listMajors, getMajor } = require("../controllers/majors.controller");

router.get("/", listMajors);
router.get("/:slug", getMajor);

module.exports = router;

