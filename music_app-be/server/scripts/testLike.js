const { pool } = require("../db/index.js");
const { addLikeToPlaylist } = require("../db/personalPlaylists.js");

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
    const addLikeTestResult = await addLikeToPlaylist({
      // grab real id's for this test
      userId: "69966c06-01ac-49b0-803c-c8ee8e6174fc",
      playlistId: "8e6f5df7-670b-49cd-a497-79a69c2d50ce",
    });

    console.log(
      "addLikeToPlaylist test successfully returned:",
      addLikeTestResult
    );
  } catch (err) {
    console.error("addLikeToPlaylist test threw:", err);
  } finally {
    await pool.end();
  }
})();
