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
(() => {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("scroll", () =>
    btn.classList.toggle("show", window.scrollY > 300)
  );
})();

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

// ======================= Scroll Animations =======================
(() => {
  const sections = document.querySelectorAll(".graphics-hero, #cta, #contact");
  const animate = (el) => el.classList.add("visible");
  const revealOnScroll = () => {
    const trigger = window.innerHeight * 0.85;
    sections.forEach((sec) => {
      if (
        sec.getBoundingClientRect().top < trigger &&
        !sec.classList.contains("animated")
      ) {
        animate(sec);
        sec.classList.add("animated");
      }
    });
  };
  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);
})();

// Hero Video Fade-in
window.addEventListener("load", () => {
  const heroVideo = document.querySelector(".hero-video-embed");
  if (heroVideo) {
    heroVideo.classList.add("visible");
  }
});

// Caption
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".videos-hero");
  const caption = document.querySelector(".hero-caption");

  // Add visible class to trigger CSS animations
  setTimeout(() => {
    hero.classList.add("visible");
    if (caption) caption.classList.add("visible");
  }, 200); // small delay for smoother effect
});

//Gallery show more
const showMoreBtn = document.getElementById("showMoreVideos");
const extraVideos = document.querySelectorAll(".extra-video");
let isShown = false;

showMoreBtn.addEventListener("click", () => {
  isShown = !isShown;
  extraVideos.forEach((video) => {
    if (isShown) {
      video.classList.add("show");
    } else {
      video.classList.remove("show");
    }
  });
  showMoreBtn.textContent = isShown ? "Show Less" : "Show More";
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
      const increment = target / 150; // animation speed

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
