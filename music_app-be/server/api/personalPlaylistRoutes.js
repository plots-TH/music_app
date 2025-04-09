// server/api/personalPlaylistRoutes.js
const express = require("express");
const router = express.Router();

// Import our database functions for personal playlists
const {
  createPersonalPlaylist,
  getUserPersonalPlaylists,
  addTrackToPersonalPlaylist,
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
// Retrieve all personal playlists for the logged-in user.
router.get("/", authenticate, async (req, res) => {
  const userId = req.user.id;
  try {
    const personalPlaylists = await getUserPersonalPlaylists(userId);
    res.json({ personalPlaylists });
  } catch (err) {
    console.error("Error fetching personal playlists:", err);
    res.status(500).json({ error: "Could not retrieve personal playlists" });
  }
});

// POST /api/personalPlaylists/:playlistId/tracks
// Add a track to a specific personal playlist.
router.post("/:playlistId/tracks", authenticate, async (req, res) => {
  const { playlistId } = req.params;
  const { trackId } = req.body;
  if (!trackId) {
    return res.status(400).json({ error: "trackId is required" });
  }
  try {
    const result = await addTrackToPersonalPlaylist(playlistId, trackId);
    res.status(201).json({ message: "Track added successfully", result });
  } catch (err) {
    console.error("Error adding track to personal playlist:", err);
    res.status(500).json({ error: "Could not add track to personal playlist" });
  }
});

// GET /api/personalPlaylists/:playlistId/tracks
router.get("/:playlistId/tracks", authenticate, async (req, res) => {
  const { playlistId } = req.params;
  try {
    const tracks = await getTracksByPersonalPlaylist(playlistId); // Make sure to implement this in the database functions.
    res.json({ tracks });
  } catch (err) {
    console.error("Error fetching playlist tracks:", err);
    res.status(500).json({ error: "Could not retrieve playlist tracks" });
  }
});

module.exports = router;
