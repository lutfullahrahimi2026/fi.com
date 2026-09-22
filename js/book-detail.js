(function () {
  const detailEl = document.getElementById("bookDetail");
  if (!detailEl || !window.api) return;

  const breadcrumbEl = document.getElementById("bookBreadcrumb");
  const relatedSection = document.getElementById("relatedSection");
  const notFoundSection = document.getElementById("bookNotFound");

  function showNotFound() {
    detailEl.closest("section").hidden = true;
    relatedSection.hidden = true;
    notFoundSection.hidden = false;
    document.title = "Book Not Found — Faizani International";
  }

  window.api
    .get("/api/books")
    .then((books) => {
      if (!books.length) {
        showNotFound();
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const slug = params.get("slug") || books[0].slug; // default to first book for bare /book.html links
      const book = books.find((b) => b.slug === slug) || null;

      if (!book) {
        showNotFound();
        return;
      }

      // Page metadata
      document.title = `${book.title} — Faizani International`;
      const metaDesc = document.getElementById("pageDescription");
      if (metaDesc) metaDesc.setAttribute("content", book.description);

      // Breadcrumb
      const seriesUrl = book.series === "The Six Goblets" ? "publications.html#six-goblets" : "publications.html";
      breadcrumbEl.innerHTML = `
        <a href="publications.html">Publications</a>
        <span>/</span>
        <a href="${seriesUrl}">${book.series}</a>
        <span>/</span>
        <span>${book.title}</span>
      `;

      // Detail layout
      const tocHTML = book.toc
        ? `<ul class="toc-list">${book.toc.map((item, i) => `<li><span class="toc-num">${String(i + 1).padStart(2, "0")}</span> ${item}</li>`).join("")}</ul>`
        : `<p class="section-desc" style="margin-top: var(--space-sm);">Table of contents coming soon.</p>`;

      const downloadHTML = `<a href="https://www.amazon.com/" target="_blank" rel="noopener" class="btn btn-secondary">Buy</a>`;

      detailEl.innerHTML = `
        <div>
          <div class="book-cover"><span>${book.title}</span></div>
        </div>
        <div>
          <span class="section-label">${book.seriesLabel ? book.seriesLabel + " · " : ""}${book.series}</span>
          <h1 style="font-size: clamp(30px, 4vw, 44px);">${book.title}</h1>
          <p class="section-desc" style="margin-top: var(--space-sm); max-width: 640px;">${book.longDescription}</p>

          <div class="book-meta-row">
            <div>
              <h5>Author</h5>
              <p>${book.author}</p>
            </div>
            <div>
              <h5>Topics</h5>
              <p>${book.topics.join(", ")}</p>
            </div>
            <div>
              <h5>Language</h5>
              <p>${book.language}</p>
            </div>
          </div>

          <div class="book-actions">
            <a href="reader.html?slug=${book.slug}" class="btn btn-primary">Read</a>
            ${downloadHTML}
            <button type="button" class="btn btn-secondary" id="shareBtn">Share</button>
          </div>

          <h3 style="margin-top: var(--space-xl); font-size: 22px;">Table of Contents</h3>
          ${tocHTML}
        </div>
      `;

      // Share: native share sheet where available, clipboard-copy fallback otherwise
      const shareBtn = document.getElementById("shareBtn");
      if (shareBtn) {
        shareBtn.addEventListener("click", async () => {
          const shareData = { title: book.title, text: book.description, url: window.location.href };
          if (navigator.share) {
            try {
              await navigator.share(shareData);
            } catch (err) {
              // user cancelled the share sheet — no action needed
            }
          } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(window.location.href);
            const original = shareBtn.textContent;
            shareBtn.textContent = "Link Copied";
            setTimeout(() => (shareBtn.textContent = original), 2000);
          }
        });
      }

      // Related books: same series, excluding this one
      const related = books.filter((b) => b.series === book.series && b.slug !== book.slug).slice(0, 4);

      if (related.length) {
        relatedSection.hidden = false;
        document.getElementById("relatedHeading").textContent = `More from ${book.series}`;
        document.getElementById("relatedGrid").innerHTML = related
          .map(
            (b) => `
            <article class="publication-card reveal">
              <div class="book-cover"><span>${b.title}</span></div>
              ${b.seriesLabel ? `<span class="series">${b.seriesLabel}</span>` : ""}
              <h4>${b.title}</h4>
              <a href="book.html?slug=${b.slug}" class="link-arrow">Explore Book
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </a>
            </article>
          `
          )
          .join("");
        if (window.initReveal) window.initReveal(document.getElementById("relatedGrid"));
      } else {
        relatedSection.hidden = true;
      }

      if (window.initReveal) window.initReveal(detailEl);
    })
    .catch(() => showNotFound());
})();
