const siteHeader = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const yearNode = document.getElementById("year");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (menuToggle && mainNav) {
  const setMenuOpen = (isOpen) => {
    mainNav.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  };

  setMenuOpen(false);

  menuToggle.addEventListener("click", () => {
    setMenuOpen(!mainNav.classList.contains("open"));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("click", (event) => {
    if (!mainNav.classList.contains("open")) return;
    if (menuToggle.contains(event.target)) return;
    if (mainNav.contains(event.target)) return;
    setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });
}

const onScroll = () => {
  if (siteHeader) {
    siteHeader.classList.toggle("scrolled", window.scrollY > 20);
  }
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const revealElements = document.querySelectorAll(".reveal");
if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

const counters = document.querySelectorAll(".counter");
if (counters.length) {
  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || 0);
    const duration = 1600;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target).toLocaleString("fr-FR");
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = target.toLocaleString("fr-FR");
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counters.forEach(animateCounter);
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const metricsSection = document.getElementById("chiffres");
  if (metricsSection) counterObserver.observe(metricsSection);
}

const faqButtons = document.querySelectorAll(".faq-question");
faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";

    faqButtons.forEach((btn) => {
      btn.setAttribute("aria-expanded", "false");
      const panel = btn.nextElementSibling;
      if (panel) panel.style.maxHeight = null;
    });

    if (!isOpen) {
      button.setAttribute("aria-expanded", "true");
      const answer = button.nextElementSibling;
      if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

const track = document.getElementById("testimonialTrack");
const prevBtn = document.getElementById("prevTestimonial");
const nextBtn = document.getElementById("nextTestimonial");
const dotsWrap = document.getElementById("sliderDots");

if (track && dotsWrap) {
  const slides = Array.from(track.children);
  let current = 0;
  let autoplay;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Aller à l'avis ${index + 1}`);
    dot.addEventListener("click", () => {
      goToSlide(index);
      restartAutoplay();
    });
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  const updateSlider = () => {
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === current);
    });
  };

  const goToSlide = (index) => {
    current = (index + slides.length) % slides.length;
    updateSlider();
  };

  const nextSlide = () => goToSlide(current + 1);
  const prevSlide = () => goToSlide(current - 1);

  const startAutoplay = () => {
    autoplay = window.setInterval(nextSlide, 5200);
  };

  const restartAutoplay = () => {
    window.clearInterval(autoplay);
    startAutoplay();
  };

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    restartAutoplay();
  });

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    restartAutoplay();
  });

  updateSlider();
  startAutoplay();
}

const bookingForm = document.getElementById("bookingForm");
const formNote = document.getElementById("formNote");

if (bookingForm && formNote) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent = "Merci. Votre demande a bien été reçue, TONGARAGE vous recontacte rapidement.";
    bookingForm.reset();
  });
}
