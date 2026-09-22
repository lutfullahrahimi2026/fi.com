const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { all, get, run } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const uploadsRoot = path.join(__dirname, "..", "uploads");
for (const dir of ["covers", "pdfs"]) {
  fs.mkdirSync(path.join(uploadsRoot, dir), { recursive: true });
}

function makeUploader(subdir, allowedExt) {
  return multer({
    storage: multer.diskStorage({
      destination: path.join(uploadsRoot, subdir),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
      },
    }),
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, allowedExt.includes(ext));
    },
  });
}

const uploadCover = makeUploader("covers", [".jpg", ".jpeg", ".png", ".webp"]);
const uploadPdf = makeUploader("pdfs", [".pdf"]);

function serializeBook(row) {
  return {
    id: row.id,
    slug: row.slug,
    series: row.series,
    seriesLabel: row.series_label,
    title: row.title,
    author: row.author,
    description: row.description,
    longDescription: row.long_description,
    topics: JSON.parse(row.topics || "[]"),
    language: row.language,
    pdfUrl: row.pdf_url || null,
    coverImageUrl: row.cover_image_url || null,
    toc: row.toc ? JSON.parse(row.toc) : null,
  };
}

function readBookInput(body) {
  const topics = Array.isArray(body.topics)
    ? body.topics
    : String(body.topics || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

  let toc = null;
  if (Array.isArray(body.toc)) {
    toc = body.toc;
  } else if (typeof body.toc === "string" && body.toc.trim()) {
    toc = body.toc
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return {
    slug: String(body.slug || "").trim(),
    series: String(body.series || "").trim(),
    seriesLabel: body.seriesLabel ? String(body.seriesLabel).trim() : null,
    title: String(body.title || "").trim(),
    author: String(body.author || "").trim(),
    description: String(body.description || "").trim(),
    longDescription: String(body.longDescription || "").trim(),
    topics,
    language: String(body.language || "").trim(),
    toc,
  };
}

// Public: list all books, ordered for stable series grouping
router.get("/", (req, res) => {
  const rows = all("SELECT * FROM books ORDER BY sort_order ASC, id ASC");
  res.json(rows.map(serializeBook));
});

// Public: single book by slug
router.get("/:slug", (req, res) => {
  const row = get("SELECT * FROM books WHERE slug = ?", [req.params.slug]);
  if (!row) return res.status(404).json({ error: "Book not found." });
  res.json(serializeBook(row));
});

router.post("/", requireAuth, (req, res) => {
  const input = readBookInput(req.body || {});
  if (!input.slug || !input.title || !input.series || !input.author || !input.description || !input.longDescription || !input.language) {
    return res.status(400).json({ error: "slug, title, series, author, description, longDescription, and language are required." });
  }

  const existing = get("SELECT id FROM books WHERE slug = ?", [input.slug]);
  if (existing) return res.status(409).json({ error: "A book with that slug already exists." });

  const maxOrder = get("SELECT COALESCE(MAX(sort_order), 0) AS m FROM books").m;

  const result = run(
    `INSERT INTO books (slug, series, series_label, title, author, description, long_description, topics, language, toc, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.slug,
      input.series,
      input.seriesLabel,
      input.title,
      input.author,
      input.description,
      input.longDescription,
      JSON.stringify(input.topics),
      input.language,
      input.toc ? JSON.stringify(input.toc) : null,
      maxOrder + 1,
    ]
  );

  const row = get("SELECT * FROM books WHERE id = ?", [Number(result.lastInsertRowid)]);
  res.status(201).json(serializeBook(row));
});

router.put("/:id", requireAuth, (req, res) => {
  const existing = get("SELECT * FROM books WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "Book not found." });

  const input = readBookInput(req.body || {});
  if (!input.slug || !input.title || !input.series || !input.author || !input.description || !input.longDescription || !input.language) {
    return res.status(400).json({ error: "slug, title, series, author, description, longDescription, and language are required." });
  }

  const slugOwner = get("SELECT id FROM books WHERE slug = ? AND id != ?", [input.slug, req.params.id]);
  if (slugOwner) return res.status(409).json({ error: "Another book already uses that slug." });

  run(
    `UPDATE books SET slug=?, series=?, series_label=?, title=?, author=?, description=?, long_description=?, topics=?, language=?, toc=?, updated_at=CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      input.slug,
      input.series,
      input.seriesLabel,
      input.title,
      input.author,
      input.description,
      input.longDescription,
      JSON.stringify(input.topics),
      input.language,
      input.toc ? JSON.stringify(input.toc) : null,
      req.params.id,
    ]
  );

  const row = get("SELECT * FROM books WHERE id = ?", [req.params.id]);
  res.json(serializeBook(row));
});

router.delete("/:id", requireAuth, (req, res) => {
  run("DELETE FROM books WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

router.post("/:id/cover", requireAuth, uploadCover.single("cover"), (req, res) => {
  const existing = get("SELECT * FROM books WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "Book not found." });
  if (!req.file) return res.status(400).json({ error: "No valid image file uploaded (jpg/png/webp)." });

  const url = `/uploads/covers/${req.file.filename}`;
  run("UPDATE books SET cover_image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [url, req.params.id]);
  const row = get("SELECT * FROM books WHERE id = ?", [req.params.id]);
  res.json(serializeBook(row));
});

router.post("/:id/pdf", requireAuth, uploadPdf.single("pdf"), (req, res) => {
  const existing = get("SELECT * FROM books WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "Book not found." });
  if (!req.file) return res.status(400).json({ error: "No valid PDF file uploaded." });

  const url = `/uploads/pdfs/${req.file.filename}`;
  run("UPDATE books SET pdf_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [url, req.params.id]);
  const row = get("SELECT * FROM books WHERE id = ?", [req.params.id]);
  res.json(serializeBook(row));
});

module.exports = router;
