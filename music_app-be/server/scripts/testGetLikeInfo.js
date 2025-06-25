const { pool } = require("../db/index.js");
const {
  getAllPlaylistLikes,
  getPlaylistLikeByUser,
} = require("../db/personalPlaylists.js");

(async () => {
  console.log("env PGDATABASE:", process.env.PGDATABASE);
  console.log(
    "pool thinks its connected to:",
    (await pool.query("SELECT current_database()")).rows[0]
  );
  console.log(
    "selecting current database:",
    (await pool.query("SELECT current_database()")).rows[0]
  );
  try {
    const getLikeResult = await getAllPlaylistLikes({
      // grab real id's for this test
      playlistId: "8e6f5df7-670b-49cd-a497-79a69c2d50ce",
    });

    console.log(
      "getAllPlaylistLikes test successfully returned:",
      getLikeResult
    );
    console.log("total like count:", getLikeResult.length);

    // check if user has personally liked the playlist:
    const hasLikedResult = await getPlaylistLikeByUser({
      // grab real id's for this test
      playlistId: "8e6f5df7-670b-49cd-a497-79a69c2d50ce",
      userId: "69966c06-01ac-49b0-803c-c8ee8e6174fc",
    });

    if (!hasLikedResult) {
      console.log("Has the current user liked this playlist? :", "No");
    } else {
      console.log("Has the current user liked this playlist? :", "Yes");
    }
  } catch (err) {
    console.error("getAllPlaylistLikes test threw:", err);
  } finally {
    await pool.end();
  }
})();
