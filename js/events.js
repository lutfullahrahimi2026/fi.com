(function () {
  const listSection = document.getElementById("eventsListSection");
  const emptySection = document.getElementById("eventsEmptyState");
  const grid = document.getElementById("eventsGrid");
  if (!listSection || !emptySection || !grid || !window.api) return;

  function formatDate(dateStr) {
    const d = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  function eventCardHTML(event) {
    const when = event.time ? `${formatDate(event.date)} · ${event.time}` : formatDate(event.date);
    const registerHTML = event.registrationUrl
      ? `<a href="${event.registrationUrl}" target="_blank" rel="noopener" class="link-arrow">Register
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>`
      : "";
    return `
      <article class="publication-card reveal">
        <span class="series">${when}</span>
        <h4>${event.title}</h4>
        <p>${event.description}</p>
        ${event.location ? `<p class="section-desc">${event.location}</p>` : ""}
        ${registerHTML}
      </article>
    `;
  }

  window.api
    .get("/api/events")
    .then((events) => {
      if (!events.length) {
        listSection.hidden = true;
        emptySection.hidden = false;
        return;
      }

      grid.innerHTML = events.map(eventCardHTML).join("");
      listSection.hidden = false;
      emptySection.hidden = true;
      if (window.initReveal) window.initReveal(grid);
    })
    .catch(() => {
      listSection.hidden = true;
      emptySection.hidden = false;
    });

  window.wireSubscribeForm({
    form: document.getElementById("eventsSubscribeForm"),
    emailInput: document.getElementById("eventsSubscribeEmail"),
    statusEl: document.getElementById("eventsSubscribeStatus"),
    sourcePage: "events.html",
  });
})();
