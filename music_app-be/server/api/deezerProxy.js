const express = require("express");
const router = express.Router();
const axios = require("axios");

// This route will send a request to Deezer's api to retrieve genre data. It will bypass cors because this request will not be made from the browser
router.get("/genre", async (req, res) => {
  try {
    const response = await axios.get("https://api.deezer.com/genre");
    res.json(response.data);
  } catch (err) {
    console.error(
      "Error in deezerProxy:",
      err.response ? err.response.data : err.message
    );
    res.status(500).json({ error: "Error fetching genres" });
  }
});

// the route above retrieves genre data by proxying the "genre" endpoint. this route proxies the "search/playlist" endpoint (used once a genre is clicked)
router.get("/search/playlist", async (req, res) => {
  const { q } = req.query; // get query parameter
  try {
    const response = await axios.get("https://api.deezer.com/search/playlist", {
      params: { q },
    });
    res.json(response.data);
  } catch (err) {
    console.error(
      "Error in deezerProxy (search playlist):",
      err.response ? err.response.data : err.message
    );
    res.status(500).json({ error: "Error fetching playlists" });
  }
});

router.get("/playlist/:id", async (req, res) => {
  const { id } = req.params; // get id parameter from the URL
  try {
    const response = await axios.get(`https://api.deezer.com/playlist/${id}`);
    res.json(response.data);
  } catch (err) {
    console.error(
      "Error in deezerProxy (playlist detail):",
      err.response ? err.response.data : err.message
    );
    res.status(500).json({ error: "Error fetching playlist details" });
  }
});

module.exports = router;
