const express = require("express");
const router = express.Router();
const {
  importPlaylist,
  getSheet,
  getAllSheets,
  deleteSheet,
  createFolderFromSheet,
} = require("../controllers/playlistController");

// POST  /api/youtube-playlist/import                   → Import playlist & generate sheet
router.post("/import", importPlaylist);

// GET   /api/youtube-playlist/sheets                   → List all sheets
router.get("/sheets", getAllSheets);

// GET   /api/youtube-playlist/sheet/:id               → Get a specific sheet with problems
router.get("/sheet/:id", getSheet);

// POST  /api/youtube-playlist/sheet/:id/create-folder → Create folder + files in explorer
router.post("/sheet/:id/create-folder", createFolderFromSheet);

// DELETE /api/youtube-playlist/sheet/:id              → Delete a sheet
router.delete("/sheet/:id", deleteSheet);

module.exports = router;
