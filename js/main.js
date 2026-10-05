// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (menuToggle && mobileMenu) {
  let scrollYBeforeMenu = 0;

  // iOS Safari still allows touch-scrolling the page behind `overflow: hidden`
  // on <body> alone, which let the header/background scroll under the open
  // menu — pinning body to a fixed position is the reliable cross-browser fix.
  function lockBodyScroll() {
    scrollYBeforeMenu = window.scrollY;
    document.body.style.top = `-${scrollYBeforeMenu}px`;
    document.body.classList.add("menu-open");
  }

  function unlockBodyScroll() {
    document.body.classList.remove("menu-open");
    document.body.style.top = "";
    window.scrollTo(0, scrollYBeforeMenu);
  }

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    unlockBodyScroll();
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

// Scroll reveal (content is visible by default; only hide-then-reveal if JS + IntersectionObserver both run).
// Exposed globally so scripts that inject content after page load (events.js)
// can re-run it for their own .reveal elements.
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

// About page: leader photos rotate every 15 seconds
document.querySelectorAll(".portrait-slideshow").forEach((slideshow) => {
  const slides = slideshow.querySelectorAll("img");
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove("is-active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("is-active");
  }, 15000);
});

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
