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
      playlistId: "ff068839-2e69-4a47-b190-7dd5e5971b3f",
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
