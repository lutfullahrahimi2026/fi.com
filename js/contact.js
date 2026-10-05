(function () {
  const form = document.getElementById("contactForm");
  if (!form || !window.api) return;

  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");
  const statusEl = document.getElementById("contactStatus");

  const params = new URLSearchParams(window.location.search);
  const program = params.get("program");

  const programSubjects = {
    children: "Register: Children's Program (Ages 7–13)",
  };

  if (program && programSubjects[program]) {
    subjectInput.value = programSubjects[program];
    messageInput.value = "I'd like to register for this program. Please send me the next steps.";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type=submit]");
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    statusEl.textContent = "";

    try {
      await window.api.post("/api/contact", {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim(),
        program: program || null,
        sourcePage: "contact.html",
      });
      form.reset();
      statusEl.textContent = "Thank you — your message has been sent. We'll be in touch soon.";
    } catch (err) {
      statusEl.textContent = err.message || "Something went wrong sending your message. Please try again.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
})();
