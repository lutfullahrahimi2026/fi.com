const express = require("express");
const { all, get, run } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function serializeEvent(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.event_date,
    time: row.event_time,
    location: row.location,
    imageUrl: row.image_url,
    registrationUrl: row.registration_url,
    published: !!row.published,
  };
}

function readEventInput(body) {
  return {
    title: String(body.title || "").trim(),
    description: String(body.description || "").trim(),
    date: String(body.date || "").trim(),
    time: body.time ? String(body.time).trim() : null,
    location: body.location ? String(body.location).trim() : null,
    imageUrl: body.imageUrl ? String(body.imageUrl).trim() : null,
    registrationUrl: body.registrationUrl ? String(body.registrationUrl).trim() : null,
    published: !!body.published,
  };
}

// Public: published events only, soonest first
router.get("/", (req, res) => {
  const rows = all(
    "SELECT * FROM events WHERE published = 1 ORDER BY event_date ASC, sort_order ASC, id ASC"
  );
  res.json(rows.map(serializeEvent));
});

// Protected: every event, for the admin panel
router.get("/all", requireAuth, (req, res) => {
  const rows = all("SELECT * FROM events ORDER BY event_date ASC, sort_order ASC, id ASC");
  res.json(rows.map(serializeEvent));
});

router.post("/", requireAuth, (req, res) => {
  const input = readEventInput(req.body || {});
  if (!input.title || !input.description || !input.date) {
    return res.status(400).json({ error: "title, description, and date are required." });
  }

  const maxOrder = get("SELECT COALESCE(MAX(sort_order), 0) AS m FROM events").m;

  const result = run(
    `INSERT INTO events (title, description, event_date, event_time, location, image_url, registration_url, published, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.title,
      input.description,
      input.date,
      input.time,
      input.location,
      input.imageUrl,
      input.registrationUrl,
      input.published ? 1 : 0,
      maxOrder + 1,
    ]
  );

  const row = get("SELECT * FROM events WHERE id = ?", [Number(result.lastInsertRowid)]);
  res.status(201).json(serializeEvent(row));
});

router.put("/:id", requireAuth, (req, res) => {
  const existing = get("SELECT * FROM events WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "Event not found." });

  const input = readEventInput(req.body || {});
  if (!input.title || !input.description || !input.date) {
    return res.status(400).json({ error: "title, description, and date are required." });
  }

  run(
    `UPDATE events SET title=?, description=?, event_date=?, event_time=?, location=?, image_url=?, registration_url=?, published=?, updated_at=CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      input.title,
      input.description,
      input.date,
      input.time,
      input.location,
      input.imageUrl,
      input.registrationUrl,
      input.published ? 1 : 0,
      req.params.id,
    ]
  );

  const row = get("SELECT * FROM events WHERE id = ?", [req.params.id]);
  res.json(serializeEvent(row));
});

router.delete("/:id", requireAuth, (req, res) => {
  run("DELETE FROM events WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
