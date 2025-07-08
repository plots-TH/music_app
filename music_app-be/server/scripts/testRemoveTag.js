const { pool } = require("../db/index.js");
const { removePlaylistTag } = require("../db/personalPlaylists.js");

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
    const removeTagTestResult = await removePlaylistTag({
      // grab real id's for this test (D's public PL)
      tagId: 1,
      playlistId: "42839a38-27e8-4c06-80e0-9a8c94631799",
    });

    console.log(
      "removePlaylistTag test successfully returned:",
      removeTagTestResult
    );
  } catch (err) {
    console.error("removePlaylistTag test threw:", err);
  } finally {
    await pool.end();
  }
})();
