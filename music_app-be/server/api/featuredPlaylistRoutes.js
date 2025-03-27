const express = require("express");
const router = express.Router(); // express router object

const { fetchWidgets } = require("../db"); // create a fetchFeaturedPlaylist function in the db folder index file

// localhost:3000/api/widgets
router.get("/", async (req, res, next) => {
  res.send(await fetchWidgets());
});

module.exports = router;
