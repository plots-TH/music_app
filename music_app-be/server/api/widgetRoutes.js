const express = require("express");
const router = express.Router(); // express router object

const { fetchWidgets } = require("../db");

// localhost:3000/api/widgets
router.get("/", async (req, res, next) => {
  res.send(await fetchWidgets());
});

module.exports = router;
