const { pool } = require("../db/index.js");
const { addTagToPlaylist } = require("../db/personalPlaylists.js");

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
    const addTagTestResult = await addTagToPlaylist({
      // grab real id's for this test (D's public PL)
      tagId: 2,
      playlistId: "e9141aa2-f262-48d3-95d8-5f0dc549f273",
    });

    console.log(
      "addLikeToPlaylist test successfully returned:",
      addTagTestResult
    );
  } catch (err) {
    console.error("addTagToPlaylist test threw:", err);
  } finally {
    await pool.end();
  }
})();
