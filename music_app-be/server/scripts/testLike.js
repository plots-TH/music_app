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
      userId: "f4ed3664-bcc6-4e26-a14d-27e3cf298421",
      playlistId: "d633c24f-c21e-4c64-b183-3047bf8933f9",
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
