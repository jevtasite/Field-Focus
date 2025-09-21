// ======================= Loader =======================
(() => {
  const loader = document.getElementById("loader");
  const hide = () => loader && loader.parentNode?.removeChild(loader);
  window.addEventListener("load", () => {
    if (loader) {
      loader.style.transition = "opacity 1s ease";
      loader.style.opacity = "0";
      setTimeout(hide, 1000);
    }
  });
  setTimeout(() => loader && hide(), 5000); // fallback
})();

// ======================= Navbar =======================
(() => {
  const toggler = document.querySelector(".navbar-toggler");
  const collapse = document.querySelector(".navbar-collapse");
  toggler?.addEventListener("click", () => toggler.classList.toggle("open"));

  if (collapse) {
    collapse.addEventListener("show.bs.collapse", (e) => {
      e.target.style.height = "0";
      requestAnimationFrame(
        () => (e.target.style.height = e.target.scrollHeight + "px")
      );
    });
    collapse.addEventListener("hide.bs.collapse", (e) => {
      e.target.style.height = e.target.scrollHeight + "px";
      requestAnimationFrame(() => (e.target.style.height = "0"));
    });
    collapse.addEventListener("hidden.bs.collapse", () =>
      toggler?.classList.remove("open")
    );
  }
})();

// ======================= Back-to-top =======================
document.addEventListener("DOMContentLoaded", () => {
  // Only run on videos page
  if (!document.body.classList.contains("videos-page")) return;

  const backToTop = document.getElementById("backToTop");
  if (!backToTop) return;

  // Show/hide button on scroll
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 300);
  });

  // Smooth scroll to top
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

  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    smoothScrollTo(0);
  });
});

// ======================= Hero Swiper =======================
(() => {
  const el = document.querySelector(".hero-swiper");
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
    navigation: {
      nextEl: el.querySelector(".swiper-button-next"),
      prevEl: el.querySelector(".swiper-button-prev"),
    },
    pagination: { el: el.querySelector(".swiper-pagination"), clickable: true },
    keyboard: { enabled: true },
  });
})();

// ======================= Video Grid + Lightbox =======================
(() => {
  const grid = document.querySelector(".work-grid-flip");
  if (!grid) return;

  // Filter buttons
  const filters = document.querySelectorAll(".filter-btn-flip");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((f) => f.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.dataset.category;
      grid.querySelectorAll(".work-card-flip").forEach((card) => {
        card.style.display =
          category === "all" || card.dataset.category === category
            ? ""
            : "none";
      });
    });
  });

  // Lightbox
  const createLightbox = () => {
    let lb = document.querySelector(".graphics-lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.className = "graphics-lightbox";
      lb.innerHTML = `<span class="close" aria-label="Close">&times;</span><div class="video-container"><iframe src="" frameborder="0" allowfullscreen></iframe></div>`;
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
    const videoId = card?.dataset.youtube;
    if (!videoId) return;

    const lb = createLightbox();
    const iframe = lb.querySelector("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    lb.style.display = "flex";
  });
})();

// ======================= Scroll-triggered Animations =======================
document.addEventListener("DOMContentLoaded", () => {
  const animatedSections = [
    document.querySelector(".videos-hero"),
    document.querySelector("#videos-gallery"),
    document.querySelector("#stats"),
    document.querySelector("#cta"),
    document.querySelector("#contact"),
  ].filter(Boolean); // remove nulls

  // Animate children with stagger
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

        if (section.classList.contains("videos-hero")) {
          children = section.querySelectorAll(
            "h1, .hero-accent-line .line, .hero-subtitle, .hero-social, .hero-btn"
          );
        } else if (section.id === "videos-gallery") {
          children = section.querySelectorAll(".work-card-flip, .btn-gallery");
        } else if (section.id === "stats") {
          children = section.querySelectorAll(".stat-card");
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
});

// Animate stats numbers
const statsSection = document.getElementById("stats");
const statsNumbers = document.querySelectorAll(".stat-number");
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;

  const sectionPos = statsSection.getBoundingClientRect().top;
  const screenPos = window.innerHeight / 1.2;

  if (sectionPos < screenPos) {
    statsNumbers.forEach((num) => {
      const target = +num.getAttribute("data-target");
      let count = 0;
      const increment = target / 300; // animation speed

      const updateNum = () => {
        count += increment;
        if (count < target) {
          num.innerText = Math.ceil(count);
          requestAnimationFrame(updateNum);
        } else {
          num.innerText = target;
        }
      };
      updateNum();
    });
    statsAnimated = true;
  }
}

window.addEventListener("scroll", animateStats);
window.addEventListener("load", animateStats);

// ======================= On-page smooth scroll =======================
document.addEventListener("DOMContentLoaded", () => {
  // Only run on videos page
  if (!document.body.classList.contains("videos-page")) return;

  const OFFSET = 80; // height of your navbar

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

  // All page anchors
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

  // Back-to-top button
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

// ======================= CTA Get In Touch Button =======================
(() => {
  const ctaBtn = document.querySelector("#cta a");
  const contactSection = document.querySelector("#contact");

  if (!ctaBtn || !contactSection) return;

  const contactChildren = contactSection.querySelectorAll(
    "h2, p, a, .d-flex a"
  );

  function animateElements(elements) {
    elements.forEach((el, index) => {
      setTimeout(() => el.classList.add("visible"), index * 100);
    });
  }

  function hideElements(elements) {
    elements.forEach((el) => el.classList.remove("visible"));
  }

  ctaBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!contactSection.classList.contains("show")) {
      // Show contact section
      contactSection.classList.add("show");
      animateElements(contactChildren);
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // Hide contact section
      hideElements(contactChildren);
      contactSection.classList.remove("show");
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  });
})();

// ======================= Show More Videos Smooth =======================
(() => {
  const showMoreBtn = document.getElementById("showMoreVideos");
  const extraVideos = document.querySelectorAll(".extra-video");

  if (!showMoreBtn || !extraVideos.length) return;

  // Set initial state
  extraVideos.forEach((video) => {
    video.style.maxHeight = "0";
    video.style.opacity = "0";
    video.style.overflow = "hidden";
    video.style.transition =
      "max-height 0.5s ease, opacity 0.5s ease, transform 0.5s ease";
    video.style.transform = "translateY(20px)";
  });

  showMoreBtn.addEventListener("click", () => {
    const isShowing = showMoreBtn.dataset.showing === "true";

    extraVideos.forEach((video) => {
      if (!isShowing) {
        // Show video
        video.style.maxHeight = video.scrollHeight + "px";
        video.style.opacity = "1";
        video.style.transform = "translateY(0)";
      } else {
        // Hide video
        video.style.maxHeight = "0";
        video.style.opacity = "0";
        video.style.transform = "translateY(20px)";
      }
    });

    showMoreBtn.textContent = isShowing ? "Show More" : "Show Less";
    showMoreBtn.dataset.showing = isShowing ? "false" : "true";
  });
})();

const isMobile =
  /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
    navigator.userAgent
  );

const emailLink = document.getElementById("email-link");

if (!isMobile) {
  // Desktop Open Gmail in browser
  emailLink.href =
    "https://mail.google.com/mail/?view=cm&to=infofieldfocus@gmail.com";
  emailLink.target = "_blank";
}
