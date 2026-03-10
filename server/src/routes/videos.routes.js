const router = require("express").Router();
const { listVideos, getVideo } = require("../controllers/videos.controller");

router.get("/", listVideos);
router.get("/:slug", getVideo);

module.exports = router;

