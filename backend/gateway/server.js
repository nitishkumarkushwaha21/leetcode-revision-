const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
// app.use(express.json()); // Removed to avoid body parsing issues with proxy

const FILE_SERVICE    = process.env.FILE_SERVICE_URL    || "http://127.0.0.1:5002";
const PROBLEM_SERVICE = process.env.PROBLEM_SERVICE_URL || "http://127.0.0.1:5003";
const AI_SERVICE      = process.env.AI_SERVICE_URL      || "http://127.0.0.1:5004";
const PLAYLIST_SERVICE = process.env.PLAYLIST_SERVICE_URL || "http://127.0.0.1:5005";
const PROFILE_SERVICE  = process.env.PROFILE_SERVICE_URL  || "http://127.0.0.1:5006";

// Routes
// File Service
app.use(
  "/api/files",
  createProxyMiddleware({
    target: `${FILE_SERVICE}/api/files`,
    changeOrigin: true,
  }),
);

// Problem Service
app.use(
  "/api/problems",
  createProxyMiddleware({
    target: `${PROBLEM_SERVICE}/api/problems`,
    changeOrigin: true,
  }),
);

// AI Service
app.use(
  "/api/ai",
  createProxyMiddleware({
    target: `${AI_SERVICE}/api/ai`,
    changeOrigin: true,
  }),
);

// YouTube Playlist Service
app.use(
  "/api/youtube-playlist",
  createProxyMiddleware({
    target: `${PLAYLIST_SERVICE}/api/youtube-playlist`,
    changeOrigin: true,
  }),
);

// Profile Analysis Service
app.use(
  "/api/profile-analysis",
  createProxyMiddleware({
    target: `${PROFILE_SERVICE}/api/profile-analysis`,
    changeOrigin: true,
  }),
);

app.get("/", (req, res) => {
  res.send("AlgoNote AI Gateway Running");
});

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
