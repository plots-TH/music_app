const { pool } = require("../db/index.js");
const { removeLikeFromPlaylist } = require("../db/personalPlaylists.js");

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
    const removeLikeTestResult = await removeLikeFromPlaylist({
      // grab real id's for this test
      userId: "351238dd-bd68-49a6-90dd-94891dcca272",
      playlistId: "b8c5c795-f93f-4161-92e5-d70c7b051679",
    });

    console.log(
      "removeLikeFromPlaylist test successfully returned:",
      removeLikeTestResult
    );
  } catch (err) {
    console.error("removeLikeFromPlaylist test threw:", err);
  } finally {
    await pool.end();
  }
})();
