// server/db/users.js
const pool = require("./pool");
const bcrypt = require("bcrypt");

// Register: create a new user
const createUser = async ({
  username,
  firstname,
  lastname,
  email,
  password,
}) => {
  // Check if the email or username already exists
  const checkSQL = `SELECT * FROM users WHERE username = $1 OR email = $2;`;
  const { rows } = await pool.query(checkSQL, [username, email]);
  if (rows.length > 0) {
    throw new Error("User with this username or email already exists.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const SQL = `
    INSERT INTO users (id, is_admin, username, firstname, lastname, password, email, created_at)
    VALUES (uuid_generate_v4(), false, $1, $2, $3, $4, $5, NOW())
    RETURNING *;
  `;
  const result = await pool.query(SQL, [
    username,
    firstname,
    lastname,
    hashedPassword,
    email,
  ]);
  return result.rows[0];
};

// Login: fetch user by email
const getUserByEmail = async (email) => {
  const SQL = `SELECT * FROM users WHERE email = $1;`;
  const { rows } = await pool.query(SQL, [email]);
  return rows[0];
};

module.exports = { createUser, getUserByEmail };
