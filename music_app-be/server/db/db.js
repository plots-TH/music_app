const { pool } = require("./index"); // Use pool instead of client
const createTables = async () => {
  try {
    console.log("Creating tables...");
    const SQL = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      DROP TABLE IF EXISTS users;

      -- Create the users table first because others reference it
      CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_admin BOOLEAN NOT NULL DEFAULT false,
  username VARCHAR(128) UNIQUE NOT NULL,
  firstname VARCHAR(128) NOT NULL,
  lastname VARCHAR(128) NOT NULL,
  email VARCHAR(256) UNIQUE NOT NULL,
  password VARCHAR(128) NOT NULL,
  profile_picture VARCHAR(512),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `;
    await pool.query(SQL);
    console.log("Tables created successfully!");
  } catch (err) {
    console.error(":x: Error creating tables:", err);
  }
};

module.exports = { createTables };
