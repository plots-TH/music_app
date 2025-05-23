const { pool } = require("../db/index.js");
const { clonePublicPlaylist } = require("../db/personalPlaylists.js");

(async () => {
  console.log(await pool.query("SELECT current_database()"));
  try {
    const testResult = await clonePublicPlaylist(
      "23d59d35-4449-4ab8-a551-258ac8f9a4ef"
    );
    console.log("clonePublicPlaylist test successfully returned:", testResult);
  } catch (err) {
    console.error("clonePublicPlaylist test threw:", err);
  } finally {
    await pool.end();
  }
})();
