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
    await pool.query(`DROP TABLE IF EXISTS playlist_likes CASCADE;`);
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
  description TEXT DEFAULT '',
  cover_url VARCHAR(512),
  is_public BOOLEAN NOT NULL DEFAULT FALSE
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
  track_cover_url VARCHAR(512),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (personal_playlist_id, track_id)
);
`);

    // create the playlist_likes table:
    await pool.query(`
  CREATE TABLE playlist_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  playlist_id UUID NOT NULL REFERENCES personal_playlists(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_playlist_like UNIQUE (user_id, playlist_id)
  );
      `);

    // Test Users ------------------------------
    const hashedPassword = await bcrypt.hash("c", 10);
    const values = ["c", "c", "c", "c@fake.com", hashedPassword];
    // -- Seed database with a test user:
    const { rows } = await pool.query(
      `
    INSERT INTO users (firstname, lastname, username, email, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
    `,
      values
    );
    const user1Id = rows[0].id;

    // insert statement to create private playlist for user1 aka (C's)
    const cPrivatePlValues = [user1Id, "C's private pl", "false"];
    const cPrivateResult = await pool.query(
      `
      INSERT INTO personal_playlists (user_id, title, is_public)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      cPrivatePlValues
    );
    const cPrivatePlRows = cPrivateResult.rows;

    // insert statement for C's PUBLIC playlist
    const cPublicPlValues = [user1Id, "C's PUBLIC pl", "true"];
    const cPublicPlResult = await pool.query(
      `
      INSERT INTO personal_playlists (user_id, title, is_public)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      cPublicPlValues
    );
    const cPublicPlRows = cPublicPlResult.rows;

    const hashedPassword2 = await bcrypt.hash("d", 10);
    const values2 = ["d", "d", "d", "d@fake.com", hashedPassword2];

    // seed 2nd test user:
    const { rows: user2Rows } = await pool.query(
      `
      INSERT INTO users (firstname, lastname, username, email, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
      `,
      values2
    );
    const user2Id = user2Rows[0].id;

    // insert statement for D's Private playlist
    const dPrivatePlValues = [user2Id, "D's private pl", "false"];
    const dPrivatePlResult = await pool.query(
      `
      INSERT INTO personal_playlists (user_id, title, is_public)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      dPrivatePlValues
    );
    const dPrivatePlRows = dPrivatePlResult.rows;

    // insert statement for D's public playlist
    const dPublicPlValues = [user2Id, "D's PUBLIC pl", "true"];
    const dPublicResult = await pool.query(
      `
      INSERT INTO personal_playlists (user_id, title, is_public)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      dPublicPlValues
    );
    const dPublicPlRows = dPublicResult.rows;

    console.log("Tables created successfully!");
    console.log("userC's ID:", user1Id);
    console.log("C's private pl rows:", cPrivatePlRows);
    console.log("C's public pl rows:", cPublicPlRows);
    // console.log("C's public pl's title:", cPublicPlRows[0].title);
    console.log("userD's ID:", user2Id);
    console.log("D's private pl rows:", dPrivatePlRows);
    console.log("D's public pl rows:", dPublicPlRows);
  } catch (err) {
    console.error(":x: Error creating tables:", err);
  }
};

module.exports = { createTables };
