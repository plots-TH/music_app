const pool = require("../db/index.js");
const { getAllTags } = require("../db/personalPlaylists.js");

(async () => {
  try {
    const getTagsTestResult = await getAllTags();
    return getTagsTestResult;
  } catch (err) {
    console.error("removePlaylistTag test threw:", err);
  }
})();
