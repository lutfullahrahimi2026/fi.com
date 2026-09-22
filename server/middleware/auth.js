const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = "fi_admin_session";

function signToken(admin) {
  return jwt.sign({ id: admin.id, email: admin.email, name: admin.name }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Not authenticated." });

  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired session." });
  }
}

module.exports = { requireAuth, signToken, COOKIE_NAME };
