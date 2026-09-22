(function () {
  const form = document.getElementById("contactForm");
  if (!form || !window.api) return;

  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");
  const statusEl = document.getElementById("contactStatus");

  const params = new URLSearchParams(window.location.search);
  const program = params.get("program");
  const bookSlug = params.get("book");

  const programSubjects = {
    children: "Register: Children's Program (Ages 6–13)",
  };

  if (program && programSubjects[program]) {
    subjectInput.value = programSubjects[program];
    messageInput.value = "I'd like to register for this program. Please send me the next steps.";
  } else if (bookSlug) {
    window.api
      .get(`/api/books/${encodeURIComponent(bookSlug)}`)
      .then((book) => {
        subjectInput.value = `Notify me: ${book.title}`;
        messageInput.value = `Please let me know as soon as the full text of "${book.title}" is available to read online.`;
      })
      .catch(() => {
        // If the book can't be resolved, leave the form blank rather than showing a broken prefill.
      });
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
        bookSlug: bookSlug || null,
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
