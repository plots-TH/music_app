const { pool } = require("../db/index.js");
const { getActivePlaylistTags } = require("../db/personalPlaylists.js");

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
    const getActiveTagsResult = await getActivePlaylistTags({
      // grab real id's for this test
      playlistId: "964812ac-005b-4c92-a0cb-0d6b371766d5",
    });

    console.log(
      "getActivePlaylistTags test successfully returned:",
      getActiveTagsResult
    );
  } catch (err) {
    console.error("getActivePlaylistTags test threw:", err);
  } finally {
    await pool.end();
  }
})();
