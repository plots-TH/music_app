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
const addTrackToPersonalPlaylist = async (
  playlistId,
  trackId,
  trackTitle,
  trackArtist
) => {
  const SQL = `
    INSERT INTO personal_playlist_tracks (personal_playlist_id, track_id, track_title, track_artist)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const { rows } = await pool.query(SQL, [
    playlistId,
    trackId,
    trackTitle,
    trackArtist,
  ]);
  return rows[0];
};

// Optionally, fetch tracks associated with a particular personal playlist.
const getTracksByPersonalPlaylist = async (userId) => {
  const SQL = `
SELECT 
  personal_playlists.id,
  personal_playlists.title,
  personal_playlists.created_at,
  personal_playlist_tracks.track_id,
  personal_playlist_tracks.track_title,
  personal_playlist_tracks.track_artist,
  personal_playlist_tracks.added_at
FROM personal_playlists
LEFT JOIN personal_playlist_tracks 
  ON personal_playlists.id = personal_playlist_tracks.personal_playlist_id
WHERE personal_playlists.user_id = $1
ORDER BY personal_playlists.created_at DESC, personal_playlist_tracks.added_at DESC;
  `;
  const { rows } = await pool.query(SQL, [userId]);
  console.log("Flat query results:", rows);

  // Group the rows by playlist ID:
  const grouped = {};
  rows.forEach((row) => {
    // If we haven't seen this playlist yet, create a new group object for it.
    if (!grouped[row.id]) {
      grouped[row.id] = {
        id: row.id,
        title: row.title,
        created_at: row.created_at,
        tracks: [],
      };
    }
    // If there is track data (track_id not null), add it to the group's tracks.
    if (row.track_id) {
      grouped[row.id].tracks.push({
        track_id: row.track_id,
        track_title: row.track_title,
        track_artist: row.track_artist,
        added_at: row.added_at,
      });
    }
  });

  // Convert the grouped object into an array.
  return Object.values(grouped);
};

//
const editPersonalPlaylistTitle = async (playlistId, newplaylistTitle) => {
  const SQL = `UPDATE personal_playlists SET title = $2 WHERE id = $1 RETURNING *;
  `;
  const { rows } = await pool.query(SQL, [playlistId, newplaylistTitle]);
  return rows[0];
};

module.exports = {
  createPersonalPlaylist,
  getUserPersonalPlaylists,
  addTrackToPersonalPlaylist,
  getTracksByPersonalPlaylist,
  editPersonalPlaylistTitle,
};
