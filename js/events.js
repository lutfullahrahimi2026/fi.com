(function () {
  const list = document.getElementById("eventsList");
  if (!list || !window.api) return;

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function eventCardHTML(event) {
    const d = new Date(`${event.date}T00:00:00`);
    const valid = !Number.isNaN(d.getTime());
    const when = valid
      ? d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) + (event.time ? ` · ${event.time}` : "")
      : event.date;
    const registerHTML = event.registrationUrl
      ? `<a href="${event.registrationUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Register</a>`
      : "";
    return `
      <article class="event-card">
        <div class="event-date">
          <div class="month">${valid ? MONTHS[d.getMonth()] : ""}</div>
          <div class="day">${valid ? d.getDate() : ""}</div>
        </div>
        <div class="event-info">
          <h3>${event.title}</h3>
          <div class="meta">
            <span>${when}</span>
            ${event.location ? `<span>${event.location}</span>` : ""}
          </div>
          <p class="desc">${event.description}</p>
        </div>
        ${registerHTML}
      </article>
    `;
  }

  // Replace the placeholder cards once real events arrive; if the backend isn't
  // available yet (or has no events), the placeholders stay as they are.
  window.api
    .get("/api/events")
    .then((events) => {
      if (!events.length) return;
      list.innerHTML = events.map(eventCardHTML).join("");
    })
    .catch(() => {});

  window.wireSubscribeForm({
    form: document.getElementById("eventsSubscribeForm"),
    emailInput: document.getElementById("eventsSubscribeEmail"),
    statusEl: document.getElementById("eventsSubscribeStatus"),
    sourcePage: "events.html",
  });
})();
