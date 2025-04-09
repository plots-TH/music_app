// server/db/db.js
const { pool } = require("./index"); // Use pool instead of client

const createTables = async () => {
  try {
    console.log("Creating tables...");
    const SQL = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop dependent tables first to start fresh.
DROP TABLE IF EXISTS personal_playlist_tracks CASCADE;
DROP TABLE IF EXISTS personal_playlists CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create the users table.
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

-- Create the personal_playlists table.
CREATE TABLE personal_playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the personal_playlist_tracks table, storing the track ID as a VARCHAR(20).
CREATE TABLE personal_playlist_tracks (
  id SERIAL PRIMARY KEY,
  personal_playlist_id UUID NOT NULL REFERENCES personal_playlists(id) ON DELETE CASCADE,
  track_id VARCHAR(20) NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (personal_playlist_id, track_id)
);
    `;
    await pool.query(SQL);
    console.log("Tables created successfully!");
  } catch (err) {
    console.error(":x: Error creating tables:", err);
  }
};

module.exports = { createTables };
