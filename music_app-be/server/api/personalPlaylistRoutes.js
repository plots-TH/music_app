// server/api/personalPlaylistRoutes.js
const express = require("express");
const router = express.Router();

// Import our database functions for personal playlists
const {
  createPersonalPlaylist,
  getUserPersonalPlaylists,
  addTrackToPersonalPlaylist,
  getTracksByPersonalPlaylist,
} = require("../db/personalPlaylists");

// Authentication middleware to protect routes (you will implement this)
const authenticate = require("../middlewares/authenticate");

// POST /api/personalPlaylists
// Create a new personal playlist for the logged-in user.
router.post("/", authenticate, async (req, res) => {
  const { title } = req.body;
  const userId = req.user.id; // Set by the authentication middleware
  if (!title) {
    return res.status(400).json({ error: "Playlist title is required" });
  }
  try {
    const personalPlaylist = await createPersonalPlaylist({ userId, title });
    res.status(201).json({
      message: "Personal playlist created successfully",
      personalPlaylist,
    });
  } catch (err) {
    console.error("Error creating personal playlist:", err);
    res.status(500).json({ error: "Could not create personal playlist" });
  }
});

// GET /api/personalPlaylists
router.get("/", authenticate, async (req, res) => {
  console.log("GET /personalPlaylists user id:", req.user.id);
  const userId = req.user.id;
  try {
    const playlists = await getTracksByPersonalPlaylist(userId); // Make sure to implement this in the database functions.
    console.log("Playlists returned:", playlists);
    res.json({ personalPlaylists: playlists }); // change "tracks" to "personalPlaylist" and find the corresponding "tracks" to change to personalPlaylist
  } catch (err) {
    console.error("Error fetching playlist tracks:", err);
    res.status(500).json({ error: "Could not retrieve playlist tracks" });
  }
});

// POST /api/personalPlaylists/:playlistId/tracks
// Add a track to a specific personal playlist.
router.post("/:playlistId/tracks", authenticate, async (req, res) => {
  const { playlistId } = req.params;
  const { trackId, trackTitle } = req.body;
  if (!trackId) {
    return res.status(400).json({ error: "trackId is required" });
  }
  try {
    const result = await addTrackToPersonalPlaylist(
      playlistId,
      trackId,
      trackTitle
    );
    res.status(201).json({ message: "Track added successfully", result });
  } catch (err) {
    console.error("Error adding track to personal playlist:", err);
    res.status(500).json({ error: "Could not add track to personal playlist" });
  }
});

module.exports = router;
