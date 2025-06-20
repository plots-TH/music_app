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
      userId: "2aa35766-32cb-4094-ae6f-c08d94ea1992",
      playlistId: "44924bc0-9287-45ff-bdb9-9369c23209d8",
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
