const express = require("express");
const cors = require("cors");
const sequelize = require("./src/config/database");
require("dotenv").config();

// Import models to register them with Sequelize
require("./src/models/LearningSheet");
require("./src/models/SheetProblem");

const playlistRoutes = require("./src/routes/playlistRoutes");

const app = express();
const PORT = process.env.PLAYLIST_SERVICE_PORT || 5005;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/youtube-playlist", playlistRoutes);

app.get("/", (req, res) => {
  res.json({ message: "YouTube Playlist Service Running" });
});

// Sync database tables and start server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log(
      "PostgreSQL (algonote) synced - learning_sheets & sheet_problems tables ready",
    );
    app.listen(PORT, () => {
      console.log(`YouTube Playlist Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
    process.exit(1);
  });
