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
      playlistId: "44924bc0-9287-45ff-bdb9-9369c23209d8",
    });

    console.log(
      "getAllPlaylistLikes test successfully returned:",
      getLikeResult
    );
    console.log("total like count:", getLikeResult.length);

    // check if user has personally liked the playlist:
    const hasLikedResult = await getPlaylistLikeByUser({
      // grab real id's for this test
      playlistId: "44924bc0-9287-45ff-bdb9-9369c23209d8",
      userId: "2aa35766-32cb-4094-ae6f-c08d94ea1992",
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
