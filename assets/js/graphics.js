// ======================= Loader =======================
(() => {
  function hideLoader(loader, delay = 1000) {
    loader.style.transition = `opacity ${delay / 1000}s ease`;
    loader.style.opacity = "0";
    setTimeout(() => loader.parentNode?.removeChild(loader), delay);
  }

  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) hideLoader(loader, 1000);
  });

  // Fallback: hide loader after 5s max
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) hideLoader(loader, 500);
  }, 5000);
})();

// ======================= Navbar =======================
(() => {
  const toggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  toggler?.addEventListener("click", () => toggler.classList.toggle("open"));

  if (navbarCollapse) {
    navbarCollapse.addEventListener("show.bs.collapse", (e) => {
      e.target.style.height = "0";
      requestAnimationFrame(() => {
        e.target.style.height = e.target.scrollHeight + "px";
      });
    });

    navbarCollapse.addEventListener("hide.bs.collapse", (e) => {
      e.target.style.height = e.target.scrollHeight + "px";
      requestAnimationFrame(() => (e.target.style.height = "0"));
    });

    navbarCollapse.addEventListener("hidden.bs.collapse", () =>
      toggler?.classList.remove("open")
    );
  }
})();

// ======================= On-page smooth scroll + Back-to-top =======================
document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("graphics-page")) return;

  const OFFSET = 80; // navbar height

  function smoothScrollTo(targetY, duration = 600) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const time = timestamp - startTime;
      const percent = Math.min(time / duration, 1);
      const eased =
        percent < 0.5
          ? 2 * percent * percent
          : -1 + (4 - 2 * percent) * percent;
      window.scrollTo(0, startY + diff * eased);
      if (time < duration) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const targetY =
        target.getBoundingClientRect().top + window.scrollY - OFFSET;
      smoothScrollTo(targetY);
    });
  });

  // Smooth scroll for back-to-top
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      smoothScrollTo(0);
    });

    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("show", window.scrollY > 300);
    });
  }
});

// ======================= Hero Swiper =======================
(() => {
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
      delay: 2000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: { el: el.querySelector(".swiper-pagination"), clickable: true },
    navigation: {
      nextEl: el.querySelector(".swiper-button-next"),
      prevEl: el.querySelector(".swiper-button-prev"),
    },
    keyboard: { enabled: true },
  });
})();

// ======================= Work — FLIP Filtering + Lightbox =======================
(() => {
  const filterButtons = Array.from(
    document.querySelectorAll(".filter-btn-flip")
  );
  const grid = document.querySelector(".work-grid-flip");
  if (!grid || !filterButtons.length) return;

  const cards = Array.from(grid.querySelectorAll(".work-card-flip"));

  const getRectsMap = (items) =>
    new Map(items.map((it) => [it, it.getBoundingClientRect()]));

  const runFilter = (category) => {
    const allCards = Array.from(grid.querySelectorAll(".work-card-flip"));
    const firstRects = getRectsMap(allCards);
    const willShow = new Map(
      allCards.map((card) => [
        card,
        category === "all" || card.dataset.category === category,
      ])
    );

    // Clone exiting cards for FLIP animation
    const clones = [];
    allCards.forEach((card) => {
      if (!willShow.get(card)) {
        const rect = firstRects.get(card);
        const clone = card.cloneNode(true);
        clone.classList.add("clone-temp");
        Object.assign(clone.style, {
          position: "fixed",
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          margin: "0",
          zIndex: 9998,
        });
        document.body.appendChild(clone);
        clones.push(clone);
      }
    });

    // Reveal and hide cards
    allCards.forEach((card) => {
      if (willShow.get(card)) {
        card.classList.remove("hidden-flip");
        card.classList.add("entering");
        card.style.opacity = 0;
        card.style.transform = "translateY(12px) scale(.98)";
      } else card.classList.add("hidden-flip");
    });

    // FLIP animation
    const visibleCards = allCards.filter(
      (c) => !c.classList.contains("hidden-flip")
    );
    const lastRects = getRectsMap(visibleCards);

    visibleCards.forEach((card) => {
      const first = firstRects.get(card) || card.getBoundingClientRect();
      const last = lastRects.get(card);
      const dx = first.left - last.left;
      const dy = first.top - last.top;

      if (dx || dy) {
        card.style.transition = "none";
        card.style.transform = `translate(${dx}px, ${dy}px)`;
        card.getBoundingClientRect();
        requestAnimationFrame(() => {
          card.style.transition = "transform 500ms cubic-bezier(.2,.9,.2,1)";
          card.style.transform = "";
        });
      }
    });

    // Animate entrance
    visibleCards.forEach((card) => {
      if (!card.classList.contains("entering")) return;
      setTimeout(() => {
        card.style.transition =
          "opacity 420ms ease, transform 420ms cubic-bezier(.2,.9,.2,1)";
        card.style.opacity = "1";
        card.style.transform = "";
        const cleanup = () => {
          card.classList.remove("entering");
          card.style.transition = "";
          card.style.opacity = "";
          card.style.transform = "";
          card.removeEventListener("transitionend", cleanup);
        };
        card.addEventListener("transitionend", cleanup);
      }, 40);
    });

    // Animate exiting clones
    clones.forEach((cl) => {
      cl.animate(
        [
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: "scale(.96)" },
        ],
        {
          duration: 360,
          easing: "ease",
          fill: "forwards",
        }
      );
      setTimeout(() => cl.remove(), 420);
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      runFilter(btn.dataset.category);
    });
  });

  // Initial cleanup
  cards.forEach((c) => c.classList.remove("hidden-flip"));

  // Lightbox
  const createLightbox = () => {
    let lb = document.querySelector(".graphics-lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.className = "graphics-lightbox";
      lb.innerHTML = `<span class="close" aria-label="Close">&times;</span><img alt="Preview">`;
      document.body.appendChild(lb);
      lb.querySelector(".close").addEventListener("click", () => lb.remove());
      lb.addEventListener("click", (e) => e.target === lb && lb.remove());
    }
    return lb;
  };

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".view-btn-flip");
    if (!btn) return;
    const card = btn.closest(".work-card-flip");
    const img = card?.querySelector("img");
    if (!img) return;

    const lb = createLightbox();
    const lbImg = lb.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt || "";
    lb.classList.add("show");
    lb.style.display = "flex";
    lbImg.style.transform = "scale(.98)";
    requestAnimationFrame(() => (lbImg.style.transform = "scale(1)"));
  });

  grid.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
      e.target
        .closest(".work-card-flip")
        ?.querySelector(".view-btn-flip")
        ?.click();
  });
})();

// ======================= Coverflow Swiper =======================
(() => {
  new Swiper(".mySwiper", {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 30,
    loop: false,
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
    autoplay: { delay: 3500, disableOnInteraction: false },
  });
})();

// ======================= Featured Graphics Marquee =======================
(() => {
  const marqueeContent = document.getElementById("marqueeContent");
  if (!marqueeContent) return;

  const text = " FEATURED GRAPHICS - ";
  for (let i = 0; i < 10; i++) {
    const span = document.createElement("span");
    span.textContent = text;
    marqueeContent.appendChild(span);
  }

  let offset = 0;
  const speed = 1;
  const animateMarquee = () => {
    offset -= speed;
    if (Math.abs(offset) >= marqueeContent.scrollWidth / 2) offset = 0;
    marqueeContent.style.transform = `translateX(${offset}px)`;
    requestAnimationFrame(animateMarquee);
  };
  animateMarquee();
})();

// ======================= Graphics Hero Line =======================
(() => {
  const positionHeroLine = () => {
    const hero = document.querySelector(".graphics-hero");
    const swiper = document.querySelector(".hero-swiper");
    const accentLine = document.querySelector(".hero-accent-line");
    if (!hero || !swiper || !accentLine) return;

    const heroTop = hero.getBoundingClientRect().top + window.scrollY;
    const swiperTop = swiper.getBoundingClientRect().top + window.scrollY;

    // place line vertically halfway between navbar bottom and swiper top
    const navbarHeight = document.querySelector(".navbar")?.offsetHeight ?? 0;
    const topY = navbarHeight + 0; // small offset if needed
    const bottomY = swiperTop;

    accentLine.style.top = `${topY + (bottomY - topY) / 2}px`;
  };

  window.addEventListener("load", () => {
    // wait for images
    const images = document.querySelectorAll(".hero-swiper img");
    let loadedCount = 0;
    images.forEach((img) => {
      if (img.complete) loadedCount++;
      else
        img.addEventListener("load", () => {
          loadedCount++;
          if (loadedCount === images.length) positionHeroLine();
        });
    });
    if (loadedCount === images.length) positionHeroLine();
  });

  window.addEventListener("resize", positionHeroLine);
})();

// ======================= Testimonials Swiper =======================
(() => {
  new Swiper(".testimonials-swiper", {
    slidesPerView: "auto",
    spaceBetween: 30,
    centeredSlides: true,
    loop: false,
    navigation: {
      nextEl: ".testimonials-swiper .swiper-button-next",
      prevEl: ".testimonials-swiper .swiper-button-prev",
    },
    pagination: {
      el: ".testimonials-swiper .swiper-pagination",
      clickable: true,
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    breakpoints: {
      992: { spaceBetween: 40 },
      768: { spaceBetween: 30 },
      0: { spaceBetween: 20 },
    },
  });
})();

// ======================= Scroll-triggered Animations =======================
const animatedSections = document.querySelectorAll(
  ".graphics-hero, #testimonials, #cta, #contact"
);

function animateElements(elements) {
  elements.forEach((el, index) => {
    setTimeout(() => el.classList.add("visible"), index * 100);
  });
}

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;

  animatedSections.forEach((section) => {
    if (
      section.getBoundingClientRect().top < triggerBottom &&
      !section.classList.contains("animated")
    ) {
      let children = [];

      if (section.classList.contains("graphics-hero")) {
        children = section.querySelectorAll(
          "h1, .hero-accent-line, .hero-swiper .swiper-slide img, .featured-graphics-marquee, .featured-graphics-bg"
        );
      } else if (section.id === "testimonials") {
        children = section.querySelectorAll(".testimonial-card, .swiper-slide");
      } else if (section.id === "cta") {
        children = section.querySelectorAll("h2, a");
      } else if (section.id === "contact") {
        children = section.querySelectorAll("h2, p, a, .d-flex a");
      }

      animateElements(children);
      section.classList.add("animated");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// ======================= Get In Touch Button Reveal =======================
const getInTouchBtn = document.querySelector("#cta a");
const contactSection = document.querySelector("#contact");

function animateElements(elements) {
  elements.forEach((el, index) => {
    setTimeout(() => el.classList.add("visible"), index * 100);
  });
}

function hideElements(elements) {
  elements.forEach((el) => el.classList.remove("visible"));
}

getInTouchBtn?.addEventListener("click", function (e) {
  e.preventDefault();
  if (!contactSection) return;

  const contactChildren = contactSection.querySelectorAll(
    "h2, p, a, .d-flex a"
  );

  if (!contactSection.classList.contains("show")) {
    // Show section
    contactSection.classList.add("show");
    animateElements(contactChildren);
    contactSection.scrollIntoView({ behavior: "smooth" });
  } else {
    // Hide section
    hideElements(contactChildren);
    contactSection.classList.remove("show");
  }
});
