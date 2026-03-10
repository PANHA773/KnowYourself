const Post = require("../models/Post");

function pickPostLang(postDoc, lang, { includeContent } = { includeContent: false }) {
  const isKm = lang === "km";
  return {
    slug: postDoc.slug,
    title: isKm ? postDoc.titleKm || postDoc.title : postDoc.title,
    excerpt: isKm ? postDoc.excerptKm || postDoc.excerpt : postDoc.excerpt,
    ...(includeContent
      ? { content: isKm ? postDoc.contentKm || postDoc.content : postDoc.content }
      : {}),
    coverImageUrl: postDoc.coverImageUrl || "",
    tags: postDoc.tags || [],
    createdAt: postDoc.createdAt
  };
}

async function listPosts(_req, res) {
  const lang = _req.query?.lang === "km" ? "km" : "en";
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .select(
      "slug title titleKm excerpt excerptKm coverImageUrl tags createdAt"
    );
  res.json({ posts: posts.map((p) => pickPostLang(p, lang)) });
}

async function getPost(req, res) {
  const { slug } = req.params;
  const lang = req.query?.lang === "km" ? "km" : "en";
  const post = await Post.findOne({ slug }).select(
    "slug title titleKm excerpt excerptKm content contentKm coverImageUrl tags createdAt"
  );
  if (!post) return res.status(404).json({ message: "Post not found" });
  return res.json({ post: pickPostLang(post, lang, { includeContent: true }) });
}

module.exports = { listPosts, getPost };
