const Video = require("../models/Video");

function pickVideoLang(videoDoc, lang) {
  const isKm = lang === "km";
  return {
    slug: videoDoc.slug,
    title: isKm ? videoDoc.titleKm || videoDoc.title : videoDoc.title,
    description: isKm ? videoDoc.descriptionKm || videoDoc.description : videoDoc.description,
    url: videoDoc.url,
    tags: videoDoc.tags || []
  };
}

async function listVideos(req, res) {
  const lang = req.query?.lang === "km" ? "km" : "en";
  const videos = await Video.find({})
    .sort({ createdAt: -1 })
    .select("slug title titleKm description descriptionKm url tags createdAt");
  res.json({ videos: videos.map((v) => pickVideoLang(v, lang)) });
}

async function getVideo(req, res) {
  const lang = req.query?.lang === "km" ? "km" : "en";
  const { slug } = req.params;
  const video = await Video.findOne({ slug }).select(
    "slug title titleKm description descriptionKm url tags createdAt"
  );
  if (!video) return res.status(404).json({ message: "Video not found" });
  res.json({ video: pickVideoLang(video, lang) });
}

module.exports = { listVideos, getVideo };

