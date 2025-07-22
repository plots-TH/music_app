// server/api/personalPlaylistRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
// req.user comes from authenticate middleware

// Import our database functions for personal playlists
const {
  createPersonalPlaylist,
  clonePublicPlaylist,
  getUserPersonalPlaylists,
  getpersonalPlaylistById,
  addTrackToPersonalPlaylist,
  getTracksByPersonalPlaylist,
  editPersonalPlaylistTitle,
  removeTrackFromPersonalPlaylist,
  deletePersonalPlaylist,
  updatePlaylistDescription,
  updatePublicStatus,
  getPublicPlaylists,
  getAllPlaylistLikes,
  getPlaylistLikeByUser,
  addLikeToPlaylist,
  removeLikeFromPlaylist,
  getPlaylistsByTag,
  getAllTags,
  addTagToPlaylist,
  getActivePlaylistTags,
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

// POST /api/personalPlaylists/clone
// Create a new CLONED personal playlist from another user's public playlist
router.post("/clone", authenticate, async (req, res) => {
  const userId = req.user.id; // Set by the authentication middleware
  const { playlistId } = req.body;

  try {
    const clonedPlaylist = await clonePublicPlaylist({ playlistId, userId });
    console.log("POST /clone playlist ID to clone:", playlistId);
    console.log("POST /clone ID of user who is cloning a PL:", userId);
    res.status(201).json({
      message: "Playlist cloned successfully",
      clonedPlaylist,
    });
  } catch (err) {
    console.error("Error cloning public playlist:", err);
    res.status(500).json({ error: "Could not clone public playlist" });
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

// GET Public Playlists:
// GET /api/personalPlaylists + /publicPlaylists - handler that calls getPublicPlaylists function in personalPlaylists.js
router.get("/publicPlaylists", async (req, res) => {
  const playlists = await getPublicPlaylists();
  console.log(`/publicPlaylists returning:`, playlists);
  res.json({ publicPlaylists: playlists });
});

// POST /api/personalPlaylists + /:playlistId/tracks
// Add a track to a specific personal playlist.
router.post("/:playlistId/tracks", authenticate, async (req, res) => {
  const { playlistId } = req.params;
  const { trackId, trackTitle, trackArtist, trackCoverUrl } = req.body;
  if (!trackId) {
    return res.status(400).json({ error: "trackId is required" });
  }
  try {
    const result = await addTrackToPersonalPlaylist(
      playlistId,
      trackId,
      trackTitle,
      trackArtist,
      trackCoverUrl
    );
    res.status(201).json({ message: "Track added successfully", result });
  } catch (err) {
    console.error("Error adding track to personal playlist:", err);
    if (err.code === "23505") {
      // 23505 is postgres's error code for unique constraint violation. in this case its a duplicate-key violation
      // 409 is the standard HTTP status for “the request conflicts with the current state of the resource” = duplicate-key error
      return res
        .status(409)
        .json({ error: "This track is already in that playlist" });
    }
    res.status(500).json({ error: "Could not add track to personal playlist" });
  }
});

// DELETE /api/personalPlaylists + /:playlistId EXPRESS LAYER - delete a personal playlist
router.delete("/:playlistId", authenticate, async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user.id; // req.user is recieved from authenticate JWT middleware

  try {
    const deletedPlaylist = await deletePersonalPlaylist(playlistId, userId);

    if (!deletedPlaylist) {
      return res.status(404).json({ error: "Personal playlist not found" });
    }

    console.log("playlist deleted:", deletedPlaylist);
    // RESPONSE BACK TO FRONTEND:
    res.json({ message: "Playlist deleted", deletedPlaylist });
  } catch (err) {
    console.error("Playlist deletion error:", err);
    res.status(500).json({ error: "Could not remove personal Playlist" });
  }
});

// DELETE /api/personalPlaylists + /:playlistId/tracks/:trackId - remove a track from a personal playlist
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

// PATCH /api/personalPlaylists + /:playlistId - created to edit the title of a personal playlist
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

// PATCH /api/personalPlaylists + /:playlistId/description
router.patch("/:playlistId/description", authenticate, async (req, res) => {
  const { playlistId } = req.params;
  const { description } = req.body;
  try {
    const updatedDescription = await updatePlaylistDescription(
      playlistId,
      description
    );

    if (!updatedDescription) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    console.log("playlist description updated for playlist ID:", playlistId);
    // RESPONSE BACK TO FRONTEND:
    res.status(200).json({
      message: "playlist description updated successfully",
      playlist: updatedDescription,
    });
  } catch (err) {
    console.error("Error updating description of personal playlist", err);
    res
      .status(500)
      .json({ error: "Could not update description of personal playlist" });
  }
});

// PATCH /api/personalPlaylists + /:playlistId/publish
router.patch("/:playlistId/publish", authenticate, async (req, res) => {
  const userId = req.user.id; // from authenticate middleware
  const { playlistId } = req.params;
  const { isPublic } = req.body;
  console.log("req.user payload:", req.user);

  // Business rule: only the playlist's creator may toggle publicity (publish/unpublish)
  const personalPlaylist = await getpersonalPlaylistById(playlistId);

  console.log("raw req.user.id:", req.user.id);
  console.log("Fetched playlist.userid:", personalPlaylist.user_id);

  if (personalPlaylist.user_id !== userId) {
    return res.status(403).json({
      error:
        "You are not the creator of this playlist and cannot publish/unpublish it.",
    });
  }

  try {
    const updatedPublicStatus = await updatePublicStatus(playlistId, isPublic);

    console.log(
      "public status updated for playlist ID:",
      playlistId,
      "public status:",
      updatedPublicStatus
    );
    res.status(200).json({
      message: `your (${updatedPublicStatus.title}) playlist's public status was updated successfully`,
      publicStatus: updatedPublicStatus.is_public,
    });
  } catch (err) {
    console.error("Error updating public-status of personal playlist", err);
  }
});

// Liking and Unliking a playlist START--------------------
// GET LIKES:
// GET /api/personalPlaylists + /:playlistId/like
router.get("/:playlistId/like", authenticate, async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user.id;

  try {
    const allLikes = await getAllPlaylistLikes({ playlistId });

    console.log(
      "getAllPlaylistLikes received playlistId value of:",
      playlistId
    );

    console.log("allLikes for this playlist:", allLikes);

    // call getPlaylistLikeByUser to check if current user has liked the playlist
    const hasLiked = await getPlaylistLikeByUser({ userId, playlistId });

    console.log("getPlaylistLikeByUser received userId value:", userId);
    console.log("getPlaylistLikeByUser received playlistId value:", playlistId);

    res.status(200).json({
      totalLikes: allLikes.length,
      likes: allLikes,
      hasLiked: !!hasLiked, // "!!" ensures the client always sees a plain true or false instead of possibly getting null or an object.
    });
  } catch (err) {
    console.error("Error getting 'like-info' for playlist:", err);
    res.status(500).json({ error: "Could not fetch like info" });
  }
});

// ADD A LIKE
// POST /api/personalPlaylists + /:playlistId/like
router.post("/:playlistId/like", authenticate, async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user.id;

  try {
    const result = await addLikeToPlaylist({ userId, playlistId });

    console.log("addLikeToPlaylist received userId value:", userId);
    console.log("addLikeToPlaylist received playlistId value:", playlistId);

    res.status(201).json({ message: "playlist 'Liked' successfully", result });
  } catch (err) {
    console.error("[route] Error adding like to playlist:", err);
  }
});

// DELETE /api/personalPlaylists + /:playlistId/like
router.delete("/:playlistId/like", authenticate, async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user.id;

  try {
    const unlikeResult = await removeLikeFromPlaylist({ userId, playlistId });
    res
      .status(201)
      .json({ message: "playlist 'Unliked' successfully", unlikeResult });
  } catch (err) {
    console.error("Error removing 'Like' from playlist:", err);
  }
});
// Liking and Unliking a playlist END--------------------

// playlist tags START-----------------------------------

// ADD a Tag
// POST /api/personalPlaylists + /:playlistId/tags
router.post("/:playlistId/tags", authenticate, async (req, res) => {
  const userId = req.user.id;
  const { playlistId } = req.params;
  const { tagId } = req.body;

  try {
    // Ensure current user owns the playlist to tag:
    const playlist = await getpersonalPlaylistById(playlistId);
    if (!playlist || playlist.user_id !== userId) {
      return res.status(403).json({ error: "You do not own this playlist." });
    }
    // Add the tag
    const addedTag = await addTagToPlaylist({ tagId, playlistId });
    res
      .status(201)
      .json({ message: "playlist tag added successfully", addedTag });
  } catch (err) {
    console.log("Error adding tag to playlist:", err);
  }
});

// GET ALL TAGS
// GET /api/personalPlaylists + /tags
router.get("/tags", async (req, res) => {
  try {
    const tags = await getAllTags();
    console.log("[router.get] getAllTags() returned:", tags);
    res.status(200).json({ message: "All Tags retrieved successfully:", tags });
  } catch (err) {
    console.error("Error fetching playlists by tag", err);
    res.sendStatus(500);
  }
});

// GET ALL ACTIVE TAGS FOR THIS SPECIFIC PLAYLIST
// GET /api/personalPlaylists + /:playlistId/tags
router.get("/:playlistId/tags", async (req, res) => {
  const { playlistId } = req.params;
  const { tagId } = req.body;

  try {
    const activeTagsResult = await getActivePlaylistTags({ tagId, playlistId });
    res.status(201).json({
      message: "this playlist has the following active tags:",
      activeTagsResult,
    });
  } catch (err) {
    console.error("Error fetching active tags for this playlist", err);
    res.sendStatus(500);
  }
});

// REMOVE a Tag
// DELETE /api/personalPlaylists + /:playlistId/tags/:tagId

module.exports = router;
