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

//  LIKING A PLAYLIST SECTION START -----------------------------------
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

// GET "Likes" for a personal playlist (public playlists can be liked by other users)
const getAllPlaylistLikes = async ({ playlistId }) => {
  const SQL = `
    SELECT *
    FROM playlist_likes
    WHERE playlist_id = $1
    ORDER BY created_at DESC;
  `;
  const { rows: allLikes } = await pool.query(SQL, [playlistId]);
  console.log("'allLikes' value from getAllPlaylistLikes:", { allLikes });
  return allLikes;
};

// GET or "Check" whether or not the user has personally liked a playlist
const getPlaylistLikeByUser = async ({ playlistId, userId }) => {
  const SQL = `
    SELECT *
    FROM playlist_likes
    WHERE playlist_id = $1
    AND user_id = $2
    LIMIT 1;
  `;
  const { rows } = await pool.query(SQL, [playlistId, userId]);
  return rows[0] || null;
};

const addLikeToPlaylist = async ({ userId, playlistId }) => {
  const client = await pool.connect();

  console.log(
    "addLikeToPlaylist args:",
    "user id:",
    userId,
    "playlistId:",
    playlistId
  );

  try {
    await client.query("BEGIN");

    const likeSQL = `
    INSERT INTO playlist_likes (user_id, playlist_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
    const { rows: addedLikes } = await client.query(likeSQL, [
      userId,
      playlistId,
    ]);

    console.log({ addedLikes });

    await client.query("COMMIT");

    return addedLikes[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
};

const removeLikeFromPlaylist = async ({ userId, playlistId }) => {
  const client = await pool.connect();

  console.log(
    "removeLikeFromPlaylist args:",
    "user id:",
    userId,
    "playlistId:",
    playlistId
  );

  try {
    await client.query("BEGIN");

    const removeLikeSQL = `
    DELETE FROM playlist_likes
    WHERE user_id = $1
    AND playlist_id = $2
    RETURNING *;
  `;
    const { rows: deletedLikes } = await client.query(removeLikeSQL, [
      userId,
      playlistId,
    ]);

    console.log("deleted likes:", { deletedLikes });

    await client.query("COMMIT");

    return deletedLikes[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
};
//  LIKING A PLAYLIST SECTION END -----------------------------------

// Get a specific personal playlist by it's ID
const getpersonalPlaylistById = async (playlistId) => {
  const SQL = `
    SELECT *
    FROM personal_playlists
    WHERE id = $1
  `;
  const { rows } = await pool.query(SQL, [playlistId]);
  return rows[0];
};

// Adds a track (using the track_id from Deezer) to a specific personal playlist.
// and, if playlist.cover_url is still null, sets it to this track’s cover URL.
const addTrackToPersonalPlaylist = async (
  playlistId,
  trackId,
  trackTitle,
  trackArtist,
  trackCoverUrl
) => {
  const SQL = `
    INSERT INTO personal_playlist_tracks (personal_playlist_id, track_id, track_title, track_artist, track_cover_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const { rows } = await pool.query(SQL, [
    playlistId,
    trackId,
    trackTitle,
    trackArtist,
    trackCoverUrl,
  ]);
  const newTrack = rows[0];

  // If the playlist has no cover yet, set it
  const updateSQL = `
    UPDATE personal_playlists
    SET cover_url = $2
    WHERE id = $1
    AND cover_url IS NULL
    RETURNING cover_url;
  `;
  await pool.query(updateSQL, [playlistId, trackCoverUrl]);

  return newTrack;
};

// remove track from personal playlist - DATA ACCESS LAYER - remove track handler
const removeTrackFromPersonalPlaylist = async (playlistId, trackId) => {
  // grab a dedicated client from the pool
  const client = await pool.connect();

  try {
    // start the transaction - so all three of the following client.queries either succeed or fail together
    // this avoids half-updated or half-applied states in the database
    await client.query("BEGIN");

    // delete the track
    const deleteSQL = `
    DELETE FROM personal_playlist_tracks 
    WHERE personal_playlist_id = $1 
    AND track_id = $2 
    RETURNING *;
  `;
    const { rows: deleted } = await client.query(deleteSQL, [
      playlistId,
      trackId,
    ]);

    // see if any tracks remain. If they do, we will set the track's image to the playlist's cover image
    const remainingSQL = `
    SELECT track_cover_url FROM personal_playlist_tracks
    WHERE personal_playlist_id = $1
    ORDER BY added_at ASC
    LIMIT 1;
  `;
    const { rows: remaining } = await client.query(remainingSQL, [playlistId]);
    let newCover;
    if (remaining.length === 0) {
      newCover = null;
    } else {
      newCover = remaining[0].track_cover_url;
    }

    // update the playlist’s cover_url based on what remains (or clear it)
    console.log({ deleted, remaining });

    const updateSQL = `
    UPDATE personal_playlists
    SET cover_url = $2
    WHERE id = $1;
  `;
    await client.query(updateSQL, [playlistId, newCover]);

    // commit — now all three statements are permanently applied
    await client.query("COMMIT");

    // return the deleted row so your service layer can respond
    return deleted[0];
  } catch (err) {
    // if anything threw, undo all of the above
    await client.query("ROLLBACK");
    throw err;
  } finally {
    // awlays release the client back to the pool, even if an error occured
    client.release();
  }
};

// Optionally, fetch tracks associated with a particular personal playlist.
const getTracksByPersonalPlaylist = async (userId) => {
  const SQL = `
SELECT 
  personal_playlists.id,
  personal_playlists.title,
  personal_playlists.description,
  personal_playlists.created_at,
  personal_playlists.cover_url      AS cover_url,
  personal_playlists.is_public      AS is_public,
  personal_playlist_tracks.track_id,
  personal_playlist_tracks.track_title,
  personal_playlist_tracks.track_artist,
  personal_playlist_tracks.track_cover_url      AS track_cover_url,
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
        description: row.description,
        created_at: row.created_at,
        cover_url: row.cover_url,
        is_public: row.is_public,
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
        track_cover_url: row.track_cover_url, // if I ever want per-track covers later
        is_public: row.is_public,
      });
    }
  });

  // Convert the grouped object into an array.
  return Object.values(grouped);
};

//
const editPersonalPlaylistTitle = async (playlistId, newplaylistTitle) => {
  const SQL = `
  UPDATE personal_playlists
    SET title = $2
    WHERE id = $1
    RETURNING *;
  `;
  const { rows } = await pool.query(SQL, [playlistId, newplaylistTitle]);
  return rows[0];
};

// delete personal playlist - DATA ACCESS LAYER
const deletePersonalPlaylist = async (playlistId, userId) => {
  const SQL = `
  DELETE FROM personal_playlists
  WHERE id = $1
  AND user_id = $2
  RETURNING *;
    `;
  const { rows } = await pool.query(SQL, [playlistId, userId]);
  return rows[0];
};

// insert a description into personal Playlist - DATA ACCESS FUNCTION
const updatePlaylistDescription = async (playlistId, description) => {
  const SQL = `
  UPDATE personal_playlists
   SET description = $2 
   WHERE id = $1 
   RETURNING *;
  `;
  const { rows } = await pool.query(SQL, [playlistId, description]);
  return rows[0];
};

// update the is_public status of a personal playlist
const updatePublicStatus = async (playlistId, isPublic) => {
  const SQL = `
  UPDATE personal_playlists
   SET is_public = $2
   WHERE id = $1
   RETURNING *;
  `;
  const { rows } = await pool.query(SQL, [playlistId, isPublic]);
  return rows[0];
};

// get publicly published personal playlists - for the "explore public user playlists" page
const getPublicPlaylists = async () => {
  const SQL = `
  SELECT 
  personal_playlists.id,
  personal_playlists.title,
  personal_playlists.description,
  personal_playlists.created_at,
  personal_playlists.cover_url      AS cover_url,
  personal_playlists.is_public      AS is_public,
  users.username                    AS creator_username,
  COUNT(playlist_likes.id) OVER (PARTITION BY personal_playlists.id) AS total_likes,
  personal_playlist_tracks.track_id,
  personal_playlist_tracks.track_title,
  personal_playlist_tracks.track_artist,
  personal_playlist_tracks.track_cover_url      AS track_cover_url,
  personal_playlist_tracks.added_at
  FROM personal_playlists
  JOIN users
  ON personal_playlists.user_id = users.id
  LEFT JOIN personal_playlist_tracks
  ON personal_playlists.id = personal_playlist_tracks.personal_playlist_id 
  LEFT JOIN playlist_likes ON personal_playlists.id = playlist_likes.playlist_id
  WHERE is_public = TRUE
  ORDER BY personal_playlists.created_at DESC, personal_playlist_tracks.added_at DESC;
  `;
  const { rows } = await pool.query(SQL);
  console.log("data access function getPublicPlaylists rows:", rows);

  // Group the rows by playlist ID:
  const grouped = {};
  rows.forEach((row) => {
    // If we haven't seen this playlist yet, create a new group object for it.
    if (!grouped[row.id]) {
      grouped[row.id] = {
        id: row.id,
        creator: row.creator_username,
        title: row.title,
        description: row.description,
        created_at: row.created_at,
        cover_url: row.cover_url,
        is_public: row.is_public,
        total_likes: row.total_likes,
        tracks: [],
      };
    }

    // Only add the track if row.track_id is non-null AND not already in the array
    if (row.track_id) {
      // `.some(...)` returns true if ANY element matches the predicate
      const alreadyInArray = grouped[row.id].tracks.some(
        (track) => track.track_id === row.track.id
      );
      // if the track ID is not already in the array, PUSH it in
      if (!alreadyInArray) {
        grouped[row.id].tracks.push({
          track_id: row.track_id,
          track_title: row.track_title,
          track_artist: row.track_artist,
          added_at: row.added_at,
          track_cover_url: row.track_cover_url, // if I ever want per-track covers later
          is_public: row.is_public,
        });
      }
    }
  });

  // Convert the grouped object into an array.
  return Object.values(grouped);
};

const clonePublicPlaylist = async ({ playlistId, userId }) => {
  console.log("about to clone playlist with ID:", { playlistId });
  console.log("The userID of the user who is about to clone a playlist:", {
    userId,
  });

  // start a client and BEGIN a transaction
  const client = await pool.connect();
  console.log(
    "[clone] got client, beginning transaction for playlist",
    playlistId
  );

  try {
    await client.query("BEGIN");
    console.log("[clone] transaction begun");

    // fetch the source playlist's rows
    const getPlaylistSQL = `
  SELECT 
    id, 
    user_id,
    title,
    description,
    cover_url,
    is_public
  FROM personal_playlists
  WHERE id = $1;
  `;

    const { rows: copiedPlaylistRows } = await client.query(getPlaylistSQL, [
      playlistId,
    ]);
    console.log("[clone] fetched source playlist:", copiedPlaylistRows);
    const copiedPlaylist = copiedPlaylistRows[0];

    // fetch the original playlist's tracks rows
    const getTracksSQL = `
  SELECT 
    track_id,
    track_title,
    track_artist,
    track_cover_url,
    added_at
  FROM personal_playlist_tracks
  WHERE personal_playlist_id = $1
  ORDER BY added_at ASC;
  `;
    const { rows: copiedTracks } = await client.query(getTracksSQL, [
      playlistId,
    ]);
    console.log("[clone] fetched source PL's tracks:", copiedTracks);

    // INSERT a new 'playlist' row for the current user (omit is_public so it defaults to false)
    const insertPlaylistSQL = `
    INSERT INTO personal_playlists (user_id, title, description, cover_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;

    console.log(
      "[clone] Inserting new playist row for user with id of:",
      userId,
      "with fields:",
      copiedPlaylist.title,
      copiedPlaylist.description,
      copiedPlaylist.cover_url
    );

    const {
      rows: [newPlaylistRow],
    } = await client.query(insertPlaylistSQL, [
      userId,
      copiedPlaylist.title,
      copiedPlaylist.description,
      copiedPlaylist.cover_url,
    ]);

    console.log("[clone] new playlist inserted:", newPlaylistRow);
    const newPlaylistId = newPlaylistRow.id;
    console.log("[clone] new playlist id is:", newPlaylistId);

    // INSERT each track from the source playlist into the new cloned playlist
    const insertTracksSQL = `
    INSERT INTO personal_playlist_tracks (personal_playlist_id, track_id, track_title, track_artist, track_cover_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `;

    console.log(
      "[clone] inserting the following tracks into new cloned playlist:",
      copiedTracks
    );

    const insertedTracks = [];
    for (const track of copiedTracks) {
      const {
        rows: [insertedTrackRow],
      } = await client.query(insertTracksSQL, [
        newPlaylistId,
        track.track_id,
        track.track_title,
        track.track_artist,
        track.track_cover_url,
      ]);
      insertedTracks.push(insertedTrackRow);
      console.log("inserted track:", insertedTrackRow.track_title);
    }
    console.log(
      "all tracks inserted. full insertedTracks array is:",
      insertedTracks
    );

    await client.query("COMMIT");
    console.log(
      "[clone] transaction COMMITTED for newPlaylistId:",
      newPlaylistId
    );
    console.log(
      "[clone] transaction COMMITTED for newPlaylist named:",
      newPlaylistRow.title
    );

    // return the newly committed playlist + its tracks
    return {
      playlistRows: newPlaylistRow,
      trackRows: insertedTracks,
    };

    // if error, ROLLBACK the transaction to protect the database from incomplete entries
  } catch (err) {
    console.log("[clone] error caught - beginning ROLLBACK:", err);
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    console.log(
      "[clone] client released and playlist + tracks have been cloned successfully"
    );
  }
};

const addTagToPlaylist = async ({ tagId, playlistId }) => {
  const client = await pool.connect();

  console.log(
    "addTagToPlaylist args:",
    "tag ID:",
    tagId,
    "playlist ID:",
    playlistId
  );
  try {
    await client.query("BEGIN");

    const addTagSQL = `
    INSERT INTO playlist_tags (tag_id, playlist_id) 
    VALUES ($1, $2) 
    RETURNING *;
  `;

    const { rows: addedTags } = await client.query(addTagSQL, [
      tagId,
      playlistId,
    ]);

    console.log({ addedTags });

    await client.query("COMMIT");

    return addedTags[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
};

const removePlaylistTag = async ({ tagId, playlistId }) => {
  const client = await pool.connect();

  console.log(
    "removePlaylistTag args:",
    "tag ID:",
    tagId,
    "playlist ID:",
    playlistId
  );

  try {
    await client.query("BEGIN");

    const removeTagSQL = `
    DELETE FROM playlist_tags
    WHERE tag_id = $1
    AND playlist_id = $2
    RETURNING *;
    `;

    const { rows: removedTag } = await client.query(removeTagSQL, [
      tagId,
      playlistId,
    ]);

    console.log("removed tag:", { removedTag });

    await client.query("COMMIT");

    return removedTag[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
};

const getPlaylistsByTag = async (tagName) => {
  const SQL = `
    SELECT 
      personal_playlists.id,
      personal_playlists.title,
      personal_playlists.description,
      personal_playlists.cover_url,
      personal_playlists.created_at,
      personal_playlists.is_public,
      users.username AS creator_username
    FROM
      personal_playlists

    JOIN users ON personal_playlists.user_id = users.id

    JOIN playlist_tags ON playlist_tags.playlist_id = personal_playlists.id

    JOIN tags ON tags.id = playlist_tags.tag_id
    WHERE tags.tag_name = $1
    AND personal_playlists.is_public = TRUE
    ORDER BY personal_playlists.created_at DESC;
  `;
};

module.exports = {
  createPersonalPlaylist,
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
  clonePublicPlaylist,
  getAllPlaylistLikes,
  getPlaylistLikeByUser,
  addLikeToPlaylist,
  removeLikeFromPlaylist,
  addTagToPlaylist,
  removePlaylistTag,
  getPlaylistsByTag,
};
