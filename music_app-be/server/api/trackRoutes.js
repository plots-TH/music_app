// server/api/trackRoutes.js
const express = require("express");
const router = express.Router();

const { getTrackById } = require("../db/tracks");

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const track = await getTrackById(id);
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }
    res.json({ track });
  } catch (err) {
    console.error("Error fetching track data:", err);
    res.status(500).json({ error: "Error fetching track data." });
  }
});

module.exports = router;
