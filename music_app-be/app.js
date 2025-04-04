const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const pool = require("./server/db/pool.js");

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());
app.use("/api", require("./server/api")); // for any request to an endpoint that starts with "api" we require ./server/api

const init = async () => {
  try {
    await pool.connect();
    console.log(pool);
    app.listen(PORT, () => {
      console.log(`Server alive on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

init();
