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
      playlistId: "2f9f192c-a64c-41a8-94f9-0cf986bca92b",
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
