// ======================= Loader =======================
function hideLoader(loader, delay = 1000) {
  loader.style.transition = `opacity ${delay / 1000}s ease`;
  loader.style.opacity = "0";
  setTimeout(() => loader.parentNode?.removeChild(loader), delay);
}
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) hideLoader(loader, 1000);
});
setTimeout(() => {
  const loader = document.getElementById("loader");
  if (loader) hideLoader(loader, 500);
}, 5000);

// ======================= Navbar =======================
const toggler = document.querySelector(".navbar-toggler");
const navbarCollapse = document.querySelector(".navbar-collapse");

if (toggler) {
  toggler.addEventListener("click", () => toggler.classList.toggle("open"));
}
if (navbarCollapse) {
  navbarCollapse.addEventListener("show.bs.collapse", (e) => {
    e.target.style.height = "0";
    requestAnimationFrame(
      () => (e.target.style.height = e.target.scrollHeight + "px")
    );
  });
  navbarCollapse.addEventListener("hide.bs.collapse", (e) => {
    e.target.style.height = e.target.scrollHeight + "px";
    requestAnimationFrame(() => (e.target.style.height = "0"));
  });
  navbarCollapse.addEventListener("hidden.bs.collapse", () =>
    toggler?.classList.remove("open")
  );
}

// ======================= Smooth Scroll (graphics page only) =======================
function smoothScrollTo(targetY, duration = 600) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime;
  function step(ts) {
    if (!startTime) startTime = ts;
    const t = ts - startTime;
    const p = Math.min(t / duration, 1);
    const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
    window.scrollTo(0, startY + diff * eased);
    if (t < duration) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Enable smooth scroll for on-page anchors
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const href = a.getAttribute("href");
  if (!href || href === "#") return;

  const target = document.querySelector(href);
  if (!target) return;

  e.preventDefault();
  const offset = (document.querySelector(".navbar")?.offsetHeight ?? 60) + 8;
  const y = target.getBoundingClientRect().top + window.scrollY - offset;

  // Close mobile nav if open
  if (navbarCollapse && navbarCollapse.classList.contains("show")) {
    const instance = bootstrap.Collapse.getInstance(navbarCollapse);
    instance && instance.hide();
  }

  smoothScrollTo(y, 600);
});

// ======================= Back-to-top =======================
const backToTop = document.getElementById("backToTop");
if (backToTop) {
  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    smoothScrollTo(0, 600);
  });
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 300);
  });
}

// ======================= HERO Swiper (replaces marquee) =======================
(function initHeroSwiper() {
  const el = document.getElementById("heroSwiper");
  if (!el) return;

  new Swiper(el, {
    slidesPerView: 1,
    loop: true,
    speed: 700,
    effect: "fade",
    fadeEffect: { crossFade: true },
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: el.querySelector(".swiper-pagination"),
      clickable: true,
    },
    navigation: {
      nextEl: el.querySelector(".swiper-button-next"),
      prevEl: el.querySelector(".swiper-button-prev"),
    },
    keyboard: { enabled: true },
  });
})();

// ======================= Work Filters =======================
const filterButtons = document.querySelectorAll(".filter-btn");
const workCards = document.querySelectorAll(".work-card");

if (filterButtons.length && workCards.length) {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-category");
      workCards.forEach((card) => {
        const show = category === "all" || card.dataset.category === category;
        card.style.pointerEvents = show ? "auto" : "none";
        card.style.opacity = show ? "1" : "0";
        card.style.transform = show ? "none" : "scale(0.98)";
        setTimeout(
          () => (card.style.display = show ? "" : "none"),
          show ? 0 : 200
        );
      });
    });
  });
}

// ======================= Hero Swiper =======================
const swiper = new Swiper(".mySwiper", {
  slidesPerView: "auto",
  centeredSlides: true,
  spaceBetween: 30,
  loop: false, // enable looping for continuous autoplay
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  effect: "coverflow",
  coverflowEffect: {
    rotate: 15,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  autoplay: {
    delay: 3500, // time between slides in ms
    disableOnInteraction: false, // continue autoplay after manual interaction
  },
});

// ======================= Featured Graphics Line =======================
const marqueeContent = document.getElementById("marqueeContent");
const text = " FEATURED GRAPHICS - "; // the word(s) to repeat

// Fill marquee with repeated words for seamless effect
const repeatCount = 10; // adjust for enough repetition
for (let i = 0; i < repeatCount; i++) {
  const span = document.createElement("span");
  span.textContent = text;
  marqueeContent.appendChild(span);
}

let offset = 0;
const speed = 1; // slower speed (was 0.5 before)

function animateMarquee() {
  offset -= speed;
  if (Math.abs(offset) >= marqueeContent.scrollWidth / 2) {
    offset = 0; // reset seamlessly
  }
  marqueeContent.style.transform = `translateX(${offset}px)`;
  requestAnimationFrame(animateMarquee);
}

animateMarquee();
