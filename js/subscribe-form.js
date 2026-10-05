// Shared "email capture" form wiring used by events.html and apps.html.
window.wireSubscribeForm = function wireSubscribeForm({ form, emailInput, statusEl, sourcePage }) {
  if (!form || !emailInput || !window.api) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return;

    const button = form.querySelector("button[type=submit]");
    const originalText = button ? button.textContent : "";
    if (button) {
      button.disabled = true;
      button.textContent = "Submitting…";
    }
    if (statusEl) statusEl.textContent = "";

    try {
      await window.api.post("/api/subscribe", { email, sourcePage });
      emailInput.value = "";
      if (statusEl) statusEl.textContent = "Thanks — you're on the list!";
    } catch (err) {
      if (statusEl) statusEl.textContent = err.message || "Something went wrong. Please try again.";
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  });
};
