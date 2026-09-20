(function () {
  const container = document.getElementById("seriesContainer");
  if (!container || typeof BOOKS_DATA === "undefined") return;

  const seriesLabels = {
    "The Six Goblets": "Featured Series",
    "Deconstruction and Analysis of Man's Atom": "Series",
    "Additional Publications": "More",
  };

  function bookCardHTML(book) {
    return `
      <article class="publication-card reveal">
        <div class="book-cover"><span>${book.title}</span></div>
        ${book.seriesLabel ? `<span class="series">${book.seriesLabel}</span>` : ""}
        <h4>${book.title}</h4>
        <p>${book.description}</p>
        <div class="topics">${book.topics.map((t) => `<span class="topic-tag">${t}</span>`).join("")}</div>
        <a href="book.html?slug=${book.slug}" class="link-arrow">Explore Book
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </article>
    `;
  }

  const html = BOOK_SERIES_ORDER.map((seriesName) => {
    const books = BOOKS_DATA.filter((b) => b.series === seriesName);
    if (!books.length) return "";
    const anchorId = seriesName === "The Six Goblets" ? ' id="six-goblets"' : "";
    return `
      <div class="series-block"${anchorId}>
        <div class="section-head-row reveal">
          <div>
            <span class="section-label">${seriesLabels[seriesName] || "Series"}</span>
            <h2 class="section-heading">${seriesName}</h2>
          </div>
        </div>
        <div class="book-grid">
          ${books.map(bookCardHTML).join("")}
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = html;

  if (window.initReveal) window.initReveal(container);
})();
