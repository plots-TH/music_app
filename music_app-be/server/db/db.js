// server/db/db.js
const { pool } = require("./index"); // Use pool instead of client
const bcrypt = require("bcrypt");

const createTables = async () => {
  try {
    console.log("Creating tables...");

    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // -- Drop dependent tables first to start fresh.
    await pool.query(`DROP TABLE IF EXISTS personal_playlist_tracks CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS personal_playlists CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);

    // -- Create the users table.
    await pool.query(`
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
`);

    // -- Create the personal_playlists table:
    await pool.query(`
  CREATE TABLE personal_playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT DEFAULT ''
);
`);

    // -- Create the personal_playlist_tracks table:
    await pool.query(`
  CREATE TABLE personal_playlist_tracks (
  id SERIAL PRIMARY KEY,
  personal_playlist_id UUID NOT NULL REFERENCES personal_playlists(id) ON DELETE CASCADE,
  track_id VARCHAR(20) NOT NULL,
  track_title VARCHAR(255),
  track_artist VARCHAR(255),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (personal_playlist_id, track_id)
);
`);

    const hashedPassword = await bcrypt.hash("c", 10);
    const values = ["c", "c", "c", "c@fake.com", hashedPassword];
    // -- Seed database with a test user:
    await pool.query(
      `
    INSERT INTO users (firstname, lastname, username, email, password)
    VALUES ($1, $2, $3, $4, $5);
    `,
      values
    );

    console.log("Tables created successfully!");
  } catch (err) {
    console.error(":x: Error creating tables:", err);
  }
};

module.exports = { createTables };
