require("dotenv").config();

const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set. Copy .env.example to .env and set a real secret before starting the server.");
  process.exit(1);
}

const authRoutes = require("./routes/auth");
const adminsRoutes = require("./routes/admins");
const booksRoutes = require("./routes/books");
const eventsRoutes = require("./routes/events");
const submissionsRoutes = require("./routes/submissions");

const app = express();
const siteRoot = path.join(__dirname, "..");

// The site relies on inline styles, Google Fonts, and a YouTube embed —
// Helmet's default CSP would block all of that, so it's disabled here.
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cookieParser());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/admins", adminsRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api", submissionsRoutes);

app.use(express.static(siteRoot));

app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Faizani International site listening on http://localhost:${PORT}`);
});
