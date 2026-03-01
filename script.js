const siteHeader = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const yearNode = document.getElementById("year");
const hero = document.getElementById("hero");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => mainNav.classList.remove("open"));
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

let ticking = false;
const handleParallax = () => {
  if (!hero) return;
  const offset = Math.min(window.scrollY * 0.18, 80);
  hero.style.setProperty("--hero-shift", `${offset}px`);
  ticking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(handleParallax);
      ticking = true;
    }
  },
  { passive: true }
);

handleParallax();
