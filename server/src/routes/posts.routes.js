const router = require("express").Router();
const { listPosts, getPost } = require("../controllers/posts.controller");

router.get("/", listPosts);
router.get("/:slug", getPost);

module.exports = router;

