const express = require("express");
const bcrypt = require("bcryptjs");
const { all, get, run } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", (req, res) => {
  const admins = all("SELECT id, name, email, created_at FROM admins ORDER BY created_at ASC");
  res.json(admins);
});

router.post("/", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  const normalizedEmail = String(email).toLowerCase();
  const existing = get("SELECT id FROM admins WHERE email = ?", [normalizedEmail]);
  if (existing) return res.status(409).json({ error: "An admin with that email already exists." });

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = run("INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)", [
    name,
    normalizedEmail,
    passwordHash,
  ]);
  res.status(201).json({ id: Number(result.lastInsertRowid), name, email: normalizedEmail });
});

router.delete("/:id", (req, res) => {
  const count = get("SELECT COUNT(*) AS c FROM admins").c;
  if (count <= 1) {
    return res.status(400).json({ error: "Cannot delete the last remaining admin." });
  }
  run("DELETE FROM admins WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
