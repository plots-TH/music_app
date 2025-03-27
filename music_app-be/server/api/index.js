// all the requests that have "api" in them go from app.js to here (index.js)
// from here we send those requests to their respective router files such as "userRoutes.js"

const express = require("express");

const router = express.Router();

router.use("/widgets", require("./widgetRoutes.js"));
router.use("/users", require("./userRoutes.js"));

// this is localhost:3000/api
router.get("/", (req, res) => {
  res.send("Hello from the main router in api/index.js");
});

module.exports = router;
