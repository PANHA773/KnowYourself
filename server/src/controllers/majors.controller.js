const Major = require("../models/Major");

function pickMajorLang(majorDoc, lang) {
  const isKm = lang === "km";
  return {
    slug: majorDoc.slug,
    title: isKm ? majorDoc.titleKm || majorDoc.title : majorDoc.title,
    description: isKm ? majorDoc.descriptionKm || majorDoc.description : majorDoc.description,
    imageUrl: majorDoc.imageUrl || "",
    skills: isKm && majorDoc.skillsKm?.length ? majorDoc.skillsKm : majorDoc.skills,
    careers: isKm && majorDoc.careersKm?.length ? majorDoc.careersKm : majorDoc.careers
  };
}

async function listMajors(req, res) {
  const lang = req.query?.lang === "km" ? "km" : "en";
  const majors = await Major.find({})
    .sort({ title: 1 })
    .select("slug title titleKm description descriptionKm imageUrl skills skillsKm careers careersKm");
  res.json({ majors: majors.map((m) => pickMajorLang(m, lang)) });
}

async function getMajor(req, res) {
  const { slug } = req.params;
  const lang = req.query?.lang === "km" ? "km" : "en";
  const major = await Major.findOne({ slug }).select(
    "slug title titleKm description descriptionKm imageUrl skills skillsKm careers careersKm"
  );
  if (!major) return res.status(404).json({ message: "Major not found" });
  return res.json({ major: pickMajorLang(major, lang) });
}

module.exports = { listMajors, getMajor };
