const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const { notFound, errorHandler } = require("./middleware/error");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const majorsRoutes = require("./routes/majors.routes");
const careersRoutes = require("./routes/careers.routes");
const postsRoutes = require("./routes/posts.routes");
const experiencesRoutes = require("./routes/experiences.routes");
const testRoutes = require("./routes/test.routes");
const videosRoutes = require("./routes/videos.routes");
const adminRoutes = require("./routes/admin.routes");

function createApp() {
  const app = express();

  const corsOriginRaw = (process.env.CORS_ORIGIN || "").trim();
  const corsOriginList = corsOriginRaw
    ? corsOriginRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : null;

  app.use(
    cors({
      origin: corsOriginList || true,
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  // Serve uploaded assets
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/majors", majorsRoutes);
  app.use("/api/careers", careersRoutes);
  app.use("/api/posts", postsRoutes);
  app.use("/api/videos", videosRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/experiences", experiencesRoutes);
  app.use("/api/test", testRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
