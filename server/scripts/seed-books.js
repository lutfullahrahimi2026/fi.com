require("dotenv").config();
const { get, run } = require("../db");

// Mirrors the literal content of js/books-data.js at the time the backend was
// introduced, so migrating to the database doesn't lose or alter any content.
const BOOKS = [
  {
    slug: "knowing-oneself-knowing-god",
    series: "The Six Goblets",
    seriesLabel: "Book 1",
    title: "Knowing Oneself — Knowing God",
    author: "Mawlana Faizani",
    description: "The gateway to self-knowledge as the path toward knowing the Divine.",
    longDescription:
      "The first volume in the Six Goblets series, exploring the path to self-knowledge as the gateway to knowing the Divine. Mawlana Faizani guides the reader through contemplation of the self as the starting point of every spiritual journey.",
    topics: ["Self-Knowledge", "Faith"],
    language: "English",
    toc: ["Introduction", "The Nature of the Self", "The Path to Nearness"],
  },
  {
    slug: "magnificence-and-perfection",
    series: "The Six Goblets",
    seriesLabel: "Book 2",
    title: "Magnificence and Perfection of Glorious Artificer in Arts",
    author: "Mawlana Faizani",
    description: "A reflection on the perfection found in the works of the Creator.",
    longDescription:
      "The second volume in the Six Goblets series. A reflection on the perfection found in the works of the Creator, and what that perfection reveals to the contemplative heart.",
    topics: ["Creation", "Reflection"],
    language: "English",
    toc: null,
  },
  {
    slug: "man-and-the-secrets-of-nearness",
    series: "The Six Goblets",
    seriesLabel: "Book 3",
    title: "Man and the Secrets of Nearness",
    author: "Mawlana Faizani",
    description: "Exploring the path toward nearness to the Divine.",
    longDescription:
      "The third volume in the Six Goblets series, exploring the path toward nearness to the Divine and what it asks of the seeker.",
    topics: ["Spirituality"],
    language: "English",
    toc: null,
  },
  {
    slug: "man-and-the-philosophy-of-test",
    series: "The Six Goblets",
    seriesLabel: "Book 4",
    title: "Man and the Philosophy of Test",
    author: "Mawlana Faizani",
    description: "Understanding trial and purpose in human life.",
    longDescription:
      "The fourth volume in the Six Goblets series. Understanding trial and purpose in human life, and how difficulty shapes the spiritual path.",
    topics: ["Humanity"],
    language: "English",
    toc: null,
  },
  {
    slug: "secrets-of-creation",
    series: "The Six Goblets",
    seriesLabel: "Book 5",
    title: "The Secrets of Creation up to the Court of Greatness",
    author: "Mawlana Faizani",
    description: "A journey through creation toward the Divine court.",
    longDescription:
      "The fifth volume in the Six Goblets series. A journey through creation toward the Divine court, tracing the signs of the Creator through the created world.",
    topics: ["Creation"],
    language: "English",
    toc: null,
  },
  {
    slug: "alphabets-of-the-secrets-of-the-quran",
    series: "The Six Goblets",
    seriesLabel: "Book 6",
    title: "Alphabets of the Secrets of the Quran",
    author: "Mawlana Faizani",
    description: "Uncovering layers of meaning within the Quran.",
    longDescription:
      "The sixth and final volume in the Six Goblets series. Uncovering layers of meaning within the Quran through contemplative reading.",
    topics: ["Quran"],
    language: "English",
    toc: null,
  },
  {
    slug: "the-soul",
    series: "Deconstruction and Analysis of Man's Atom",
    seriesLabel: "Volume",
    title: "The Soul",
    author: "Mawlana Faizani",
    description: "An examination of the human soul and its nature.",
    longDescription: "Part of the Deconstruction and Analysis of Man's Atom series. An examination of the human soul and its nature.",
    topics: ["The Soul"],
    language: "English",
    toc: null,
  },
  {
    slug: "the-devil",
    series: "Deconstruction and Analysis of Man's Atom",
    seriesLabel: "Volume",
    title: "The Devil",
    author: "Mawlana Faizani",
    description: "Understanding opposition to the soul's spiritual path.",
    longDescription: "Part of the Deconstruction and Analysis of Man's Atom series. Understanding opposition to the soul's spiritual path.",
    topics: ["Faith"],
    language: "English",
    toc: null,
  },
  {
    slug: "the-heart",
    series: "Deconstruction and Analysis of Man's Atom",
    seriesLabel: "Volume",
    title: "The Heart",
    author: "Mawlana Faizani",
    description: "The heart as the seat of remembrance and reflection.",
    longDescription: "Part of the Deconstruction and Analysis of Man's Atom series. The heart as the seat of remembrance and reflection.",
    topics: ["Dhikr"],
    language: "English",
    toc: null,
  },
  {
    slug: "the-reasoning-of-the-dhakiren",
    series: "Additional Publications",
    seriesLabel: null,
    title: "The Reasoning of the Dhakiren",
    author: "Mawlana Faizani",
    description: "A study on those devoted to remembrance.",
    longDescription: "A study on those devoted to remembrance — the Dhakiren — and the reasoning behind their practice.",
    topics: ["Dhikr"],
    language: "English",
    toc: null,
  },
  {
    slug: "the-existing-essences-still-lost",
    series: "Additional Publications",
    seriesLabel: null,
    title: "The Existing Essences Still Lost",
    author: "Mawlana Faizani",
    description: "A reflection on humanity's search for meaning.",
    longDescription: "A reflection on humanity's search for meaning, and the essences that remain unrecognized within the self.",
    topics: ["Self-Knowledge"],
    language: "English",
    toc: null,
  },
  {
    slug: "the-world-according-to-the-telescope-of-the-quran",
    series: "Additional Publications",
    seriesLabel: null,
    title: "The World According to the Telescope of the Quran",
    author: "Mawlana Faizani",
    description: "Viewing the world through Quranic understanding.",
    longDescription: "Viewing the world through Quranic understanding — a telescope turned outward from revelation.",
    topics: ["Quran"],
    language: "English",
    toc: null,
  },
  {
    slug: "the-sun-of-gnosis",
    series: "Additional Publications",
    seriesLabel: null,
    title: "The Sun of Gnosis",
    author: "Mawlana Faizani",
    description: "Illuminating the path of spiritual knowledge.",
    longDescription: "Illuminating the path of spiritual knowledge — gnosis as the light that guides the seeker.",
    topics: ["Gnosis"],
    language: "English",
    toc: null,
  },
];

function main() {
  let inserted = 0;
  let skipped = 0;

  BOOKS.forEach((book, index) => {
    const existing = get("SELECT id FROM books WHERE slug = ?", [book.slug]);
    if (existing) {
      skipped++;
      return;
    }

    run(
      `INSERT INTO books (slug, series, series_label, title, author, description, long_description, topics, language, toc, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        book.slug,
        book.series,
        book.seriesLabel,
        book.title,
        book.author,
        book.description,
        book.longDescription,
        JSON.stringify(book.topics),
        book.language,
        book.toc ? JSON.stringify(book.toc) : null,
        index + 1,
      ]
    );
    inserted++;
  });

  console.log(`${inserted} inserted, ${skipped} skipped (already present).`);
}

main();
