// server/api/personalPlaylistRoutes.js
const express = require("express");
const router = express.Router();

// Import our database functions for personal playlists
const {
  createPersonalPlaylist,
  getUserPersonalPlaylists,
  addTrackToPersonalPlaylist,
  getTracksByPersonalPlaylist,
  editPersonalPlaylistTitle,
  removeTrackFromPersonalPlaylist,
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
    res.json({ personalPlaylists: playlists });
  } catch (err) {
    console.error("Error fetching playlist tracks:", err);
    res.status(500).json({ error: "Could not retrieve playlist tracks" });
  }
});

// POST /api/personalPlaylists/:playlistId/tracks
// Add a track to a specific personal playlist.
router.post("/:playlistId/tracks", authenticate, async (req, res) => {
  const { playlistId } = req.params;
  const { trackId, trackTitle, trackArtist } = req.body;
  if (!trackId) {
    return res.status(400).json({ error: "trackId is required" });
  }
  try {
    const result = await addTrackToPersonalPlaylist(
      playlistId,
      trackId,
      trackTitle,
      trackArtist
    );
    res.status(201).json({ message: "Track added successfully", result });
  } catch (err) {
    console.error("Error adding track to personal playlist:", err);
    res.status(500).json({ error: "Could not add track to personal playlist" });
  }
});

// DELETE /api/personalPlaylists/:playlistId/tracks/:trackId - remove a track from a personal playlist
// EXPRESS LAYER - ROUTE DECLARATION:
router.delete(
  "/:playlistId/tracks/:trackId",
  authenticate,
  // ROUTE HANDLER or CONTROLLER ACTION:
  async (req, res) => {
    const { playlistId, trackId } = req.params;

    try {
      const deletedTrack = await removeTrackFromPersonalPlaylist(
        playlistId,
        trackId
      );

      if (!deletedTrack) {
        return res.status(404).json({ error: "Track not found" });
      }

      console.log("Track removed:", deletedTrack);
      // RESPONSE BACK TO FRONTEND:
      res.json({ message: "Track removed", deletedTrack });
    } catch (err) {
      console.error("Track removal error:", err);
      res.status(500).json({ error: "Could not remove track" });
    }
  }
);

// PATCH /api/personalPlaylists/:playlistId - created to edit the title of a personal playlist
router.patch("/:playlistId", authenticate, async (req, res) => {
  const { playlistId } = req.params;
  const { playlistTitle } = req.body;
  try {
    const result = await editPersonalPlaylistTitle(playlistId, playlistTitle);
    if (!result) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    res
      .status(201)
      .json({ message: "Playlist title updated successfully", result });
  } catch (err) {
    console.error("Error updating title of personal playlist", err);
    res
      .status(500)
      .json({ error: "Could not update title of personal playlist" });
  }
});

module.exports = router;
