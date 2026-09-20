(function () {
  const input = document.getElementById("searchInput");
  const form = document.getElementById("searchForm");
  const categoryTabs = document.getElementById("categoryTabs");
  const suggested = document.getElementById("suggestedSearches");
  const resultsGrid = document.getElementById("resultsGrid");
  const resultsCount = document.getElementById("resultsCount");
  const noResults = document.getElementById("noResults");

  if (!input || typeof SEARCH_INDEX === "undefined") return;

  // Merge in book records from the shared catalog (js/books-data.js) so the
  // index doesn't duplicate what's already maintained there.
  const bookEntries =
    typeof BOOKS_DATA !== "undefined"
      ? BOOKS_DATA.map((b) => ({
          title: b.title,
          url: `book.html?slug=${b.slug}`,
          category: "Publications",
          description: b.description,
          tags: `${b.series} ${b.topics.join(" ")}`,
        }))
      : [];
  const searchData = SEARCH_INDEX.concat(bookEntries);

  let activeCategory = "All";

  function readQueryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  }

  function updateUrl(query) {
    const params = new URLSearchParams(window.location.search);
    if (query) params.set("q", query);
    else params.delete("q");
    const newUrl = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
    window.history.replaceState({}, "", newUrl);
  }

  function matches(item, query) {
    if (!query) return true;
    const haystack = (item.title + " " + item.description + " " + item.tags).toLowerCase();
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .every((word) => haystack.includes(word));
  }

  function render() {
    const query = input.value.trim();
    updateUrl(query);

    const results = searchData.filter((item) => {
      const categoryOk = activeCategory === "All" || item.category === activeCategory;
      return categoryOk && matches(item, query);
    });

    resultsGrid.innerHTML = "";

    if (results.length === 0) {
      noResults.hidden = false;
      resultsCount.textContent = "";
    } else {
      noResults.hidden = true;
      resultsCount.textContent = `${results.length} result${results.length === 1 ? "" : "s"}${query ? ` for “${query}”` : ""}`;

      results.forEach((item) => {
        const card = document.createElement("a");
        card.href = item.url;
        card.className = "result-card";
        card.innerHTML = `
          <span class="result-category">${item.category}</span>
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          <span class="link-arrow">View
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        `;
        resultsGrid.appendChild(card);
      });
    }
  }

  input.addEventListener("input", render);
  form.addEventListener("submit", (e) => e.preventDefault());

  categoryTabs.querySelectorAll(".pill-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      categoryTabs.querySelectorAll(".pill-tab").forEach((t) => t.classList.remove("pill-tab-active"));
      tab.classList.add("pill-tab-active");
      activeCategory = tab.dataset.category;
      render();
    });
  });

  suggested.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      input.value = chip.dataset.query;
      input.focus();
      render();
    });
  });

  input.value = readQueryFromUrl();
  render();
})();
