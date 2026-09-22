(function () {
  const table = document.getElementById("booksTable");
  const tbody = table.querySelector("tbody");
  const form = document.getElementById("bookForm");
  const statusEl = document.getElementById("bookFormStatus");
  const uploadRow = document.getElementById("bookUploadRow");
  const seriesOptions = document.getElementById("bookSeriesOptions");

  const fields = {
    id: document.getElementById("bookId"),
    title: document.getElementById("bookTitle"),
    slug: document.getElementById("bookSlug"),
    series: document.getElementById("bookSeries"),
    seriesLabel: document.getElementById("bookSeriesLabel"),
    author: document.getElementById("bookAuthor"),
    language: document.getElementById("bookLanguage"),
    description: document.getElementById("bookDescription"),
    longDescription: document.getElementById("bookLongDescription"),
    topics: document.getElementById("bookTopics"),
    toc: document.getElementById("bookToc"),
  };

  let books = [];

  function resetForm() {
    form.reset();
    fields.id.value = "";
    uploadRow.hidden = true;
    statusEl.textContent = "";
  }

  function openForCreate() {
    resetForm();
    form.hidden = false;
  }

  function openForEdit(book) {
    resetForm();
    fields.id.value = book.id;
    fields.title.value = book.title;
    fields.slug.value = book.slug;
    fields.series.value = book.series;
    fields.seriesLabel.value = book.seriesLabel || "";
    fields.author.value = book.author;
    fields.language.value = book.language;
    fields.description.value = book.description;
    fields.longDescription.value = book.longDescription;
    fields.topics.value = book.topics.join(", ");
    fields.toc.value = book.toc ? book.toc.join("\n") : "";
    uploadRow.hidden = false;
    form.hidden = false;
  }

  function renderSeriesOptions() {
    const names = [...new Set(books.map((b) => b.series))];
    seriesOptions.innerHTML = names.map((n) => `<option value="${n}"></option>`).join("");
  }

  function renderTable() {
    tbody.innerHTML = books
      .map(
        (b) => `
        <tr data-id="${b.id}">
          <td>${b.title}</td>
          <td>${b.series}${b.seriesLabel ? ` — ${b.seriesLabel}` : ""}</td>
          <td>${b.slug}</td>
          <td>${b.pdfUrl ? "Yes" : "—"}</td>
          <td class="row-actions">
            <button type="button" data-action="edit">Edit</button>
            <button type="button" data-action="delete" class="danger">Delete</button>
          </td>
        </tr>
      `
      )
      .join("");
  }

  function loadBooks() {
    return window.api.get("/api/books").then((data) => {
      books = data;
      renderSeriesOptions();
      renderTable();
    });
  }

  document.getElementById("newBookBtn").addEventListener("click", openForCreate);
  document.getElementById("cancelBookBtn").addEventListener("click", () => {
    form.hidden = true;
  });

  tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.closest("tr").dataset.id);
    const book = books.find((b) => b.id === id);

    if (btn.dataset.action === "edit") {
      openForEdit(book);
    } else if (btn.dataset.action === "delete") {
      if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
      await window.api.delete(`/api/books/${id}`);
      await loadBooks();
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Saving…";

    const payload = {
      title: fields.title.value.trim(),
      slug: fields.slug.value.trim(),
      series: fields.series.value.trim(),
      seriesLabel: fields.seriesLabel.value.trim() || null,
      author: fields.author.value.trim(),
      language: fields.language.value.trim(),
      description: fields.description.value.trim(),
      longDescription: fields.longDescription.value.trim(),
      topics: fields.topics.value,
      toc: fields.toc.value,
    };

    try {
      const id = fields.id.value;
      const saved = id
        ? await window.api.put(`/api/books/${id}`, payload)
        : await window.api.post("/api/books", payload);

      await loadBooks();
      statusEl.textContent = "Saved.";
      openForEdit(saved); // keep form open in edit mode so cover/pdf can be attached
    } catch (err) {
      statusEl.textContent = err.message || "Could not save book.";
    }
  });

  document.getElementById("bookCoverFile").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    const id = fields.id.value;
    if (!file || !id) return;
    const formData = new FormData();
    formData.append("cover", file);
    statusEl.textContent = "Uploading cover…";
    try {
      await window.api.upload(`/api/books/${id}/cover`, formData);
      statusEl.textContent = "Cover uploaded.";
    } catch (err) {
      statusEl.textContent = err.message || "Cover upload failed.";
    }
  });

  document.getElementById("bookPdfFile").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    const id = fields.id.value;
    if (!file || !id) return;
    const formData = new FormData();
    formData.append("pdf", file);
    statusEl.textContent = "Uploading PDF…";
    try {
      await window.api.upload(`/api/books/${id}/pdf`, formData);
      await loadBooks();
      statusEl.textContent = "PDF uploaded.";
    } catch (err) {
      statusEl.textContent = err.message || "PDF upload failed.";
    }
  });

  window.adminAuth.onReady(loadBooks);
})();
