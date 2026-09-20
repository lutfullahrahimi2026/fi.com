// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Scroll reveal (content is visible by default; only hide-then-reveal if JS + IntersectionObserver both run).
// Exposed globally so scripts that inject content after page load (publications.js,
// book-detail.js) can re-run it for their own .reveal elements.
window.initReveal = function initReveal(root) {
  const revealEls = (root || document).querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !revealEls.length) return;

  revealEls.forEach((el) => el.classList.add("reveal-init"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
};

window.initReveal();

// Featured Teaching: click-to-load YouTube embed (facade pattern — real link if JS
// never runs, no YouTube iframe/cookies loaded until the visitor actually asks for it)
const teachingFacade = document.getElementById("teachingFacade");

if (teachingFacade) {
  teachingFacade.addEventListener("click", (e) => {
    e.preventDefault();
    const videoId = teachingFacade.dataset.videoId;
    const start = teachingFacade.dataset.start || "0";
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?start=${start}&autoplay=1&rel=0`;
    iframe.title = "Faizani International teaching video";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.className = "teaching-iframe";
    teachingFacade.innerHTML = "";
    teachingFacade.appendChild(iframe);
    teachingFacade.classList.add("is-playing");
  });
}

// Donate page: frequency + amount toggle groups
document.querySelectorAll(".frequency-toggle").forEach((group) => {
  group.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      group.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });
});

document.querySelectorAll(".amount-grid").forEach((group) => {
  group.querySelectorAll(".amount-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      group.querySelectorAll(".amount-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const customAmount = document.getElementById("customAmount");
      if (customAmount) customAmount.value = "";
    });
  });
});
