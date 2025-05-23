// scripts/initDb.js
const { createTables } = require("../db/db");
(async () => {
  await createTables();
  console.log("Tables created!");
  process.exit(0);
})();
