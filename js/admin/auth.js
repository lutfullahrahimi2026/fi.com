window.adminAuth = (function () {
  const loginView = document.getElementById("loginView");
  const dashboardView = document.getElementById("dashboardView");
  const loginForm = document.getElementById("loginForm");
  const loginStatus = document.getElementById("loginStatus");
  const whoAmI = document.getElementById("adminWhoAmI");
  const logoutBtn = document.getElementById("logoutBtn");

  const listeners = [];

  function onReady(fn) {
    listeners.push(fn);
  }

  function showDashboard(admin) {
    loginView.hidden = true;
    dashboardView.hidden = false;
    whoAmI.textContent = `${admin.name} (${admin.email})`;
    listeners.forEach((fn) => fn(admin));
  }

  function showLogin() {
    dashboardView.hidden = true;
    loginView.hidden = false;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginStatus.textContent = "";
    try {
      const admin = await window.api.post("/api/auth/login", {
        email: document.getElementById("loginEmail").value.trim(),
        password: document.getElementById("loginPassword").value,
      });
      showDashboard(admin);
    } catch (err) {
      loginStatus.textContent = err.message || "Login failed.";
    }
  });

  logoutBtn.addEventListener("click", async () => {
    await window.api.post("/api/auth/logout", {});
    showLogin();
  });

  // Tab switching
  document.getElementById("adminTabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".admin-tab");
    if (!btn) return;
    document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("is-active"));
    document.querySelectorAll(".admin-panel").forEach((p) => p.classList.remove("is-active"));
    btn.classList.add("is-active");
    document.getElementById(`panel-${btn.dataset.tab}`).classList.add("is-active");
  });

  window.api
    .get("/api/auth/me")
    .then(showDashboard)
    .catch(showLogin);

  return { onReady };
})();
