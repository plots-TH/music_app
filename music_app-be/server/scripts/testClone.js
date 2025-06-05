const { pool } = require("../db/index.js");
const { clonePublicPlaylist } = require("../db/personalPlaylists.js");

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
    const testResult = await clonePublicPlaylist({
      playlistId: "dc06b98d-7399-445a-adb0-cc1f9ab3de7f",
      userId: "5cbfe805-ff85-4bd2-80cf-6ba942d5634c",
    });
    console.log("clonePublicPlaylist test successfully returned:", testResult);
  } catch (err) {
    console.error("clonePublicPlaylist test threw:", err);
  } finally {
    await pool.end();
  }
})();
