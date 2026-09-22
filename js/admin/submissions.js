(function () {
  const table = document.getElementById("submissionsTable");
  const tbody = table.querySelector("tbody");

  let submissions = [];

  function detailHTML(s) {
    if (s.type === "contact") {
      return `<strong>${s.subject || ""}</strong><br>${(s.message || "").slice(0, 140)}${(s.message || "").length > 140 ? "…" : ""}`;
    }
    return s.sourcePage ? `Signed up from ${s.sourcePage}` : "Newsletter signup";
  }

  function renderTable() {
    tbody.innerHTML = submissions
      .map(
        (s) => `
        <tr data-id="${s.id}">
          <td><span class="admin-badge">${s.type}</span></td>
          <td>${s.name ? `${s.name}<br>` : ""}${s.email}</td>
          <td>${detailHTML(s)}</td>
          <td>${new Date(s.createdAt.replace(" ", "T") + "Z").toLocaleString()}</td>
          <td><span class="admin-badge ${s.isRead ? "" : "is-unread"}">${s.isRead ? "Read" : "Unread"}</span></td>
          <td class="row-actions">
            <button type="button" data-action="toggle-read">${s.isRead ? "Mark Unread" : "Mark Read"}</button>
            <button type="button" data-action="delete" class="danger">Delete</button>
          </td>
        </tr>
      `
      )
      .join("");
  }

  function loadSubmissions() {
    return window.api.get("/api/submissions").then((data) => {
      submissions = data;
      renderTable();
    });
  }

  tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.closest("tr").dataset.id);

    if (btn.dataset.action === "toggle-read") {
      await window.api.patch(`/api/submissions/${id}/read`);
      await loadSubmissions();
    } else if (btn.dataset.action === "delete") {
      if (!confirm("Delete this submission? This cannot be undone.")) return;
      await window.api.delete(`/api/submissions/${id}`);
      await loadSubmissions();
    }
  });

  window.adminAuth.onReady(loadSubmissions);
})();
