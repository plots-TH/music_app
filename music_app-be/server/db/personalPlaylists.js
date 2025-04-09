// server/db/personalPlaylists.js
const pool = require("./pool");

// Creates a new personal playlist for a user.
const createPersonalPlaylist = async ({ userId, title }) => {
  const SQL = `
    INSERT INTO personal_playlists (user_id, title)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [userId, title];
  const { rows } = await pool.query(SQL, values);
  return rows[0];
};

// Gets all personal playlists for a given user.
const getUserPersonalPlaylists = async (userId) => {
  const SQL = `
    SELECT *
    FROM personal_playlists
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  const { rows } = await pool.query(SQL, [userId]);
  return rows;
};

// Adds a track (using the track_id from Deezer) to a specific personal playlist.
const addTrackToPersonalPlaylist = async (playlistId, trackId) => {
  const SQL = `
    INSERT INTO personal_playlist_tracks (personal_playlist_id, track_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const { rows } = await pool.query(SQL, [playlistId, trackId]);
  return rows[0];
};

// Optionally, fetch tracks associated with a particular personal playlist.
const getTracksByPersonalPlaylist = async (playlistId) => {
  const SQL = `
    SELECT ppt.*, pt.track_id
    FROM personal_playlist_tracks ppt
    WHERE ppt.personal_playlist_id = $1
    ORDER BY ppt.added_at DESC;
  `;
  const { rows } = await pool.query(SQL, [playlistId]);
  return rows;
};

module.exports = {
  createPersonalPlaylist,
  getUserPersonalPlaylists,
  addTrackToPersonalPlaylist,
  getTracksByPersonalPlaylist,
};
