const router = require("express").Router();
const { listCareers, getCareer } = require("../controllers/careers.controller");

router.get("/", listCareers);
router.get("/:slug", getCareer);

module.exports = router;

