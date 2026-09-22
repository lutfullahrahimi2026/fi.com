const express = require("express");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const { get } = require("../db");
const { requireAuth, signToken, COOKIE_NAME } = require("../middleware/auth");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: "Too many login attempts. Try again later." },
});

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post("/login", loginLimiter, (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const admin = get("SELECT * FROM admins WHERE email = ?", [String(email).toLowerCase()]);
  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = signToken(admin);
  res.cookie(COOKIE_NAME, token, cookieOptions);
  res.json({ id: admin.id, name: admin.name, email: admin.email });
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "strict", secure: cookieOptions.secure });
  res.json({ ok: true });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ id: req.admin.id, name: req.admin.name, email: req.admin.email });
});

module.exports = router;
