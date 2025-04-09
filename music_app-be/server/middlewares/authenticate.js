// server/middlewares/authenticate.js
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  // Expect the token in the "Authorization" header in the format: "Bearer YOUR_TOKEN"
  const authHeader = req.headers.authorization;

  // If there is no auth header, respond with 401 Unauthorized.
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Split the header to extract the token
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token malformed" });
  }

  try {
    // Verify the token using your secret (should be set in your .env file)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to the request object
    req.user = decoded;

    // Call next() so the request continues to the protected route handler.
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;
