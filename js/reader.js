(function () {
  const contentEl = document.getElementById("readerContent");
  if (!contentEl || typeof BOOKS_DATA === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const book = getBookBySlug(slug);
  const breadcrumbEl = document.getElementById("readerBreadcrumb");

  if (!book) {
    document.title = "Book Not Found — Faizani International";
    breadcrumbEl.innerHTML = `<a href="publications.html">Publications</a>`;
    contentEl.innerHTML = `
      <div class="empty-state" style="padding-block: var(--space-2xl);">
        <h2 style="font-size: 28px;">Book Not Found</h2>
        <p class="section-desc" style="margin-inline: auto; text-align: center;">We couldn't find that publication.</p>
        <a href="publications.html" class="btn btn-primary" style="margin-top: var(--space-md);">Browse Publications</a>
      </div>
    `;
    return;
  }

  document.title = `Read: ${book.title} — Faizani International`;
  breadcrumbEl.innerHTML = `
    <a href="publications.html">Publications</a>
    <span>/</span>
    <a href="book.html?slug=${book.slug}">${book.title}</a>
    <span>/</span>
    <span>Read</span>
  `;

  if (book.pdfUrl) {
    contentEl.innerHTML = `
      <span class="section-label">Reading</span>
      <h1 style="font-size: clamp(26px, 3.6vw, 36px); margin-bottom: var(--space-md);">${book.title}</h1>
      <iframe class="reader-frame reveal" src="${book.pdfUrl}" title="${book.title}"></iframe>
      <div style="margin-top: var(--space-md); display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="${book.pdfUrl}" download class="btn btn-secondary">Download</a>
        <a href="book.html?slug=${book.slug}" class="btn btn-secondary">Back to Book</a>
      </div>
    `;
  } else {
    contentEl.innerHTML = `
      <div class="empty-state reveal" style="padding-block: var(--space-2xl);">
        <div class="icon-ring">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h2 style="font-size: 28px;">Full Text Coming Soon</h2>
        <p class="section-desc" style="margin-inline: auto; text-align: center;">We're preparing the full text of <strong>${book.title}</strong> for online reading. Check back soon, or reach out and we'll let you know as soon as it's ready.</p>
        <div style="margin-top: var(--space-md); display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
          <a href="contact.html?book=${book.slug}" class="btn btn-primary">Notify Me</a>
          <a href="book.html?slug=${book.slug}" class="btn btn-secondary">Back to Book</a>
        </div>
      </div>
    `;
  }

  if (window.initReveal) window.initReveal(contentEl);
})();
