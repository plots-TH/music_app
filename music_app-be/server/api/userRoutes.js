// server/api/userRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, getUserByEmail } = require("../db/users");

// POST /api/users/register
router.post("/register", async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;
  console.log("Registering user:", req.body);

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const user = await createUser({
      username,
      firstname,
      lastname,
      email,
      password,
    });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Register error:", err);
    res
      .status(500)
      .json({ error: "User registration failed", details: err.message });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ error: "No user found: invalid email or password" });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", passwordMatch);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Invalid password: please try again" });
    }

    // Generate a JWT token
    const userToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      userToken: userToken,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
