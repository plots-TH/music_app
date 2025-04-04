require("dotenv").config();
const { createTables } = require("./db/db.js");
const pool = require("./db/pool.js");

const seedDb = async () => {
  try {
    await pool.connect();
    await createTables();
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
};

seedDb();
