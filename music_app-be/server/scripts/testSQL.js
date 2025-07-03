const { pool } = require("../db/index.js");

async function test() {
  const { rows } = await pool.query(
    `
    SELECT 
      personal_playlists.id,
      personal_playlists.title,
      personal_playlists.description,
      personal_playlists.cover_url,
      personal_playlists.created_at,
      personal_playlists.is_public,
      users.username AS creator_username
    FROM
      personal_playlists

    JOIN users
    ON personal_playlists.user_id = users.id

    JOIN playlist_tags ON playlist_tags.playlist_id = personal_playlists.id

    JOIN tags ON tags.id = playlist_tags.tag_id
    WHERE tags.tag_name = $1
    AND personal_playlists.is_public = TRUE
    ORDER BY personal_playlists.created_at DESC;
  `,
    ["Pop"]
  );
  console.table(rows);
  process.exit();
}
test("Pop");
