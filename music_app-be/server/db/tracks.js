// server/db/tracks.js
const axios = require("axios");

const getTrackById = async (trackId) => {
  const url = `https://api.deezer.com/track/${trackId}`;
  try {
    const response = await axios.get(url);
    // Deezer returns an "error" key in the JSON if the track is not found.
    if (response.data.error) {
      console.error("Deezer API Error:", response.data.error);
      return null;
    }
    return response.data;
  } catch (err) {
    console.error("Error fetching track data from Deezer:", err);
    throw err; // Let the error propagate so that the route can send a 500 response.
  }
};

module.exports = { getTrackById };
