(function () {
  const table = document.getElementById("adminsTable");
  const tbody = table.querySelector("tbody");
  const form = document.getElementById("adminForm");
  const statusEl = document.getElementById("adminFormStatus");

  let admins = [];
  let currentAdminId = null;

  function renderTable() {
    tbody.innerHTML = admins
      .map(
        (a) => `
        <tr data-id="${a.id}">
          <td>${a.name}</td>
          <td>${a.email}</td>
          <td>${new Date(a.created_at.replace(" ", "T") + "Z").toLocaleDateString()}</td>
          <td class="row-actions">
            ${admins.length > 1 ? `<button type="button" data-action="delete" class="danger">Delete</button>` : ""}
          </td>
        </tr>
      `
      )
      .join("");
  }

  function loadAdmins() {
    return window.api.get("/api/admins").then((data) => {
      admins = data;
      renderTable();
    });
  }

  document.getElementById("newAdminBtn").addEventListener("click", () => {
    form.reset();
    statusEl.textContent = "";
    form.hidden = false;
  });

  document.getElementById("cancelAdminBtn").addEventListener("click", () => {
    form.hidden = true;
  });

  tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action='delete']");
    if (!btn) return;
    const id = Number(btn.closest("tr").dataset.id);
    const admin = admins.find((a) => a.id === id);
    if (!confirm(`Remove admin "${admin.name}" (${admin.email})?`)) return;
    try {
      await window.api.delete(`/api/admins/${id}`);
      await loadAdmins();
    } catch (err) {
      alert(err.message || "Could not delete admin.");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Creating…";
    try {
      await window.api.post("/api/admins", {
        name: document.getElementById("newAdminName").value.trim(),
        email: document.getElementById("newAdminEmail").value.trim(),
        password: document.getElementById("newAdminPassword").value,
      });
      await loadAdmins();
      form.hidden = true;
    } catch (err) {
      statusEl.textContent = err.message || "Could not create admin.";
    }
  });

  window.adminAuth.onReady(loadAdmins);
})();
