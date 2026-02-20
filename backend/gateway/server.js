const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
// app.use(express.json()); // Removed to avoid body parsing issues with proxy

// Routes
// File Service
app.use(
  "/api/files",
  createProxyMiddleware({
    target: "http://127.0.0.1:5002/api/files",
    changeOrigin: true,
  }),
);

// Problem Service
app.use(
  "/api/problems",
  createProxyMiddleware({
    target: "http://127.0.0.1:5003/api/problems",
    changeOrigin: true,
  }),
);

// AI Service
app.use(
  "/api/ai",
  createProxyMiddleware({
    target: "http://127.0.0.1:5004/api/ai",
    changeOrigin: true,
  }),
);

// YouTube Playlist Service
app.use(
  "/api/youtube-playlist",
  createProxyMiddleware({
    target: "http://127.0.0.1:5005/api/youtube-playlist",
    changeOrigin: true,
  }),
);

app.get("/", (req, res) => {
  res.send("AlgoNote AI Gateway Running");
});

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
