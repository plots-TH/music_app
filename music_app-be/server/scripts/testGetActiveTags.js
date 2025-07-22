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
      tagId: "3",
      playlistId: "28d3ac38-8624-46b9-9c37-11663daeaae1",
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
