# Faizani International Website

Static multi-page website for Faizani International — "Cultivating Hearts, Minds, and Communities." No build step or framework: plain HTML, CSS, and vanilla JS served directly.

## Structure

```
website-0-S/
├── index.html          Home page
├── about.html          About / community
├── programs.html       Programs by track (Children, Youth, Young Adults, Adults, Seekers)
├── publications.html   Publications listing
├── book.html           Single book detail page
├── reader.html         In-browser book reader
├── search.html         Site search
├── events.html         Events
├── apps.html           Apps page
├── donate.html         Donate page
├── contact.html         Contact form
├── css/
│   └── styles.css      Site-wide styles
├── js/
│   ├── main.js          Shared site behavior (nav, reveal animations, etc.)
│   ├── books-data.js    Book/publication data
│   ├── publications.js  Publications page logic
│   ├── book-detail.js   Book detail page logic
│   ├── reader.js        Reader page logic
│   ├── search.js        Search page logic
│   └── search-index.js  Search index data
└── assets/              Images (a.png, b.jpg, c.jpg, d.jpg)
```

## Programs & Registration

Registration buttons on `programs.html` link out to external Google Forms (not `contact.html`):

| Program | Ages | Form |
|---|---|---|
| Youth | 14–17 | https://forms.gle/dQNafqgGiB9bLhRw7 |
| Young Adults | 18–25 | https://forms.gle/pkjDaMk2qUtfjjadA |
| Adults | — | https://forms.gle/9AEz7NNFZMUCbzTz5 |
| Seekers (non-Muslims) | — | https://forms.gle/9u9HGxhvNE5MQ5Xd7 |

The Children's program (ages 6–13) still registers via `contact.html?program=children`.

`index.html` links to these programs via "Explore Program" anchors (e.g. `programs.html#youth`) rather than linking to the forms directly.

## Running locally

No build tools required — open `index.html` in a browser, or serve the folder with any static file server, e.g.:

```
npx serve .
```
