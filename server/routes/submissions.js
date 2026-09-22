const express = require("express");
const rateLimit = require("express-rate-limit");
const { all, get, run } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function serializeSubmission(row) {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    program: row.program,
    bookSlug: row.book_slug,
    sourcePage: row.source_page,
    isRead: !!row.is_read,
    createdAt: row.created_at,
  };
}

router.post("/contact", submitLimiter, (req, res) => {
  const { name, email, subject, message, program, bookSlug, sourcePage } = req.body || {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Name, email, subject, and message are required." });
  }
  if (!emailPattern.test(String(email))) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  run(
    `INSERT INTO submissions (type, name, email, subject, message, program, book_slug, source_page)
     VALUES ('contact', ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, subject, message, program || null, bookSlug || null, sourcePage || null]
  );

  res.status(201).json({ ok: true });
});

router.post("/subscribe", submitLimiter, (req, res) => {
  const { email, sourcePage } = req.body || {};
  if (!email || !emailPattern.test(String(email))) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  run(`INSERT INTO submissions (type, email, source_page) VALUES ('subscribe', ?, ?)`, [
    email,
    sourcePage || null,
  ]);

  res.status(201).json({ ok: true });
});

router.get("/submissions", requireAuth, (req, res) => {
  const rows = all("SELECT * FROM submissions ORDER BY created_at DESC");
  res.json(rows.map(serializeSubmission));
});

router.patch("/submissions/:id/read", requireAuth, (req, res) => {
  const existing = get("SELECT * FROM submissions WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "Submission not found." });

  const isRead = req.body && typeof req.body.isRead === "boolean" ? req.body.isRead : !existing.is_read;
  run("UPDATE submissions SET is_read = ? WHERE id = ?", [isRead ? 1 : 0, req.params.id]);

  const row = get("SELECT * FROM submissions WHERE id = ?", [req.params.id]);
  res.json(serializeSubmission(row));
});

router.delete("/submissions/:id", requireAuth, (req, res) => {
  run("DELETE FROM submissions WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
