# Faizani International Website

Multi-page website for Faizani International — "Cultivating Hearts, Minds, and Communities." Plain HTML/CSS/vanilla JS frontend, backed by a small Express + SQLite server that also powers an admin panel for managing books, events, and form submissions.

**This site now requires a running Node.js server** — it can no longer be opened as plain static files (see [Running locally](#running-locally)).

## Structure

```
website-0-S/
├── index.html, about.html, programs.html, publications.html, book.html,
│   reader.html, search.html, events.html, apps.html, donate.html, contact.html
├── admin.html            Admin panel (login + Books/Events/Submissions/Admins)
├── css/
│   ├── styles.css        Site-wide styles
│   └── admin.css         Admin panel layout (reuses styles.css tokens)
├── js/
│   ├── main.js           Shared site behavior (nav, reveal animations, etc.)
│   ├── api.js            Shared fetch helpers for talking to the backend
│   ├── publications.js, book-detail.js, reader.js   Fetch from /api/books
│   ├── search.js, search-index.js                    Hand-maintained page index + books from the API
│   ├── events.js         Fetches /api/events for the public Events page
│   ├── contact.js        Wires the contact form to POST /api/contact
│   ├── subscribe-form.js Shared "email capture" wiring (apps.html, events.html)
│   ├── books-data.js     UNUSED — kept only as a record of pre-migration content
│   └── admin/            Admin panel logic (auth, books, events, submissions, admins)
├── assets/               Images (a.png, b.jpg, c.jpg, d.jpg)
└── server/
    ├── server.js         Express app: serves the static site + /api/* + /uploads
    ├── db.js             node:sqlite schema/connection
    ├── middleware/auth.js
    ├── routes/           auth, admins, books, events, submissions
    ├── scripts/          create-admin.js, seed-books.js (one-time setup)
    ├── uploads/          Book cover images / PDFs uploaded via the admin panel (gitignored)
    └── data.sqlite       The database file (gitignored)
```

## Running locally

Requires Node.js ≥ 22.5 (for the built-in `node:sqlite` module).

```bash
npm install
cp .env.example .env        # then edit JWT_SECRET to a real random value
node server/scripts/seed-books.js                              # one-time: loads the 13 existing books
node server/scripts/create-admin.js "Your Name" you@example.com "a-strong-password"
npm start                    # serves the site + admin panel at http://localhost:3000
```

Then visit `http://localhost:3000` for the public site and `http://localhost:3000/admin.html` to sign in and manage content.

`node server/scripts/create-admin.js` can be re-run any time with the same email to reset that admin's password, or with a new email to add another admin (additional admins can also be added from the Admins tab once logged in).

## Admin panel

`admin.html` manages:
- **Books** — full CRUD matching the original book fields (slug, series, author, description, topics, table of contents), plus cover image and PDF uploads.
- **Events** — CRUD with a Published toggle; only published events appear on the public `events.html`.
- **Submissions** — contact form messages and newsletter signups (from `contact.html`, `apps.html`, `events.html`), with read/unread state.
- **Admins** — add or remove admin accounts (at least one must always remain).

## Programs & Registration

Registration buttons on `programs.html` link out to external Google Forms (not `contact.html`):

| Program | Ages | Form |
|---|---|---|
| Youth | 14–17 | https://forms.gle/dQNafqgGiB9bLhRw7 |
| Young Adults | 18–25 | https://forms.gle/pkjDaMk2qUtfjjadA |
| Adults | — | https://forms.gle/9AEz7NNFZMUCbzTz5 |
| Seekers (non-Muslims) | — | https://forms.gle/9u9HGxhvNE5MQ5Xd7 |

The Children's program (ages 6–13) registers via `contact.html?program=children`, which now prefills and submits through the real contact form.

`index.html` links to these programs via "Explore Program" anchors (e.g. `programs.html#youth`) rather than linking to the forms directly.

## Hosting

Because the site depends on a persistent Node process and a writable SQLite file, it needs an always-on Node host (e.g. a VPS, Render, Railway) rather than static-only hosting (GitHub Pages, Netlify static, S3).
