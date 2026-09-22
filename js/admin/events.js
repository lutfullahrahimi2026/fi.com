(function () {
  const table = document.getElementById("eventsTable");
  const tbody = table.querySelector("tbody");
  const form = document.getElementById("eventForm");
  const statusEl = document.getElementById("eventFormStatus");

  const fields = {
    id: document.getElementById("eventId"),
    title: document.getElementById("eventTitle"),
    description: document.getElementById("eventDescription"),
    date: document.getElementById("eventDate"),
    time: document.getElementById("eventTime"),
    location: document.getElementById("eventLocation"),
    registrationUrl: document.getElementById("eventRegistrationUrl"),
    published: document.getElementById("eventPublished"),
  };

  let events = [];

  function resetForm() {
    form.reset();
    fields.id.value = "";
    statusEl.textContent = "";
  }

  function openForCreate() {
    resetForm();
    fields.published.checked = true; // most admins adding an event want it visible right away
    form.hidden = false;
  }

  function openForEdit(event) {
    resetForm();
    fields.id.value = event.id;
    fields.title.value = event.title;
    fields.description.value = event.description;
    fields.date.value = event.date;
    fields.time.value = event.time || "";
    fields.location.value = event.location || "";
    fields.registrationUrl.value = event.registrationUrl || "";
    fields.published.checked = event.published;
    form.hidden = false;
  }

  function renderTable() {
    tbody.innerHTML = events
      .map(
        (ev) => `
        <tr data-id="${ev.id}">
          <td>${ev.title}</td>
          <td>${ev.date}${ev.time ? ` · ${ev.time}` : ""}</td>
          <td><span class="admin-badge ${ev.published ? "" : "is-unread"}">${ev.published ? "Published" : "Draft"}</span></td>
          <td class="row-actions">
            <button type="button" data-action="toggle-published">${ev.published ? "Unpublish" : "Publish"}</button>
            <button type="button" data-action="edit">Edit</button>
            <button type="button" data-action="delete" class="danger">Delete</button>
          </td>
        </tr>
      `
      )
      .join("");
  }

  function loadEvents() {
    return window.api.get("/api/events/all").then((data) => {
      events = data;
      renderTable();
    });
  }

  document.getElementById("newEventBtn").addEventListener("click", openForCreate);
  document.getElementById("cancelEventBtn").addEventListener("click", () => {
    form.hidden = true;
  });

  tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.closest("tr").dataset.id);
    const event = events.find((ev) => ev.id === id);

    if (btn.dataset.action === "edit") {
      openForEdit(event);
    } else if (btn.dataset.action === "delete") {
      if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
      await window.api.delete(`/api/events/${id}`);
      await loadEvents();
    } else if (btn.dataset.action === "toggle-published") {
      await window.api.put(`/api/events/${id}`, {
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        registrationUrl: event.registrationUrl,
        published: !event.published,
      });
      await loadEvents();
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Saving…";

    const payload = {
      title: fields.title.value.trim(),
      description: fields.description.value.trim(),
      date: fields.date.value,
      time: fields.time.value.trim() || null,
      location: fields.location.value.trim() || null,
      registrationUrl: fields.registrationUrl.value.trim() || null,
      published: fields.published.checked,
    };

    try {
      const id = fields.id.value;
      if (id) {
        await window.api.put(`/api/events/${id}`, payload);
      } else {
        await window.api.post("/api/events", payload);
      }
      await loadEvents();
      form.hidden = true;
    } catch (err) {
      statusEl.textContent = err.message || "Could not save event.";
    }
  });

  window.adminAuth.onReady(loadEvents);
})();
