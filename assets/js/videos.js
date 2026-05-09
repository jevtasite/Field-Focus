// ======================= Loader =======================
(() => {
  function revealHero() {
    const content = document.querySelector(".videos-hero .hero-content");
    const bottom = document.querySelector(".videos-hero .hero-bottom");
    if (content) {
      content.style.transition = "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)";
      content.style.transform = "translateY(20px)";
      requestAnimationFrame(() => {
        content.style.opacity = "1";
        content.style.transform = "translateY(0)";
      });
    }
    if (bottom) {
      bottom.style.transition = "opacity 0.7s ease 0.3s";
      bottom.style.opacity = "1";
    }
    // Trigger underline animations after content fades in
    setTimeout(() => {
      document.querySelector(".hero-match")?.classList.add("underline-ready");
      document.querySelector(".hero-moment")?.classList.add("underline-ready");
    }, 700);
  }

  const loader = document.getElementById("loader");
  const hide = (loader) => loader.parentNode?.removeChild(loader);

  window.addEventListener("load", () => {
    if (loader) {
      loader.style.transition = "opacity 1s ease";
      loader.style.opacity = "0";
      setTimeout(() => { hide(loader); revealHero(); }, 1000);
    } else {
      revealHero();
    }
  });

  setTimeout(() => { if (loader) { hide(loader); revealHero(); } }, 5000);
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

// ======================= Smooth Scroll =======================
document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("videos-page")) return;

  const OFFSET = 80;

  // Enable native smooth scroll
  document.documentElement.style.scrollBehavior = "smooth";

  // Handle all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Skip dropdown toggles
      if (link.hasAttribute("data-bs-toggle")) return;

      if (href === "#") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    });
  });

  // Back to top button
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("show", window.scrollY > 300);
    });
  }
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
          children = section.querySelectorAll(".stat-item");
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
      const suffix = num.getAttribute("data-suffix") || "";
      let count = 0;
      const increment = target / 300;

      const updateNum = () => {
        count += increment;
        if (count < target) {
          num.innerText = Math.ceil(count).toLocaleString();
          requestAnimationFrame(updateNum);
        } else {
          num.innerText = target.toLocaleString() + suffix;
        }
      };
      updateNum();
    });
    statsAnimated = true;
  }
}

window.addEventListener("scroll", animateStats);
window.addEventListener("load", animateStats);


// ======================= CTA Work With Us Button =======================
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
      contactSection.classList.add("show");
      animateElements(contactChildren);
      contactSection.scrollIntoView({ behavior: "smooth" });
      ctaBtn.textContent = "Don't Work With Us";
    } else {
      hideElements(contactChildren);
      contactSection.classList.remove("show");
      ctaBtn.textContent = "Work With Us";
    }
  });
})();


// ======================= Card scroll reveal (initial cards) =======================
(() => {
  const cards = document.querySelectorAll(".work-card-flip:not(.extra-video)");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("card-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  cards.forEach((c, i) => {
    c.style.transitionDelay = `${(i % 3) * 80}ms`;
    observer.observe(c);
  });

  // Re-measure extra video heights after images load (YouTube thumbnails)
  window.addEventListener("load", () => {
    document.querySelectorAll(".extra-video img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", () => {});
    });
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
