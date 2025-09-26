// ======================= Fixed Mobile Smooth Scroll =======================
document.addEventListener("DOMContentLoaded", () => {
  const OFFSET = 70;
  let isScrolling = false;

  // Detect mobile for performance optimizations
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768;

  // Optimized smooth scroll function
  function smoothScrollTo(targetY, duration = isMobile ? 400 : 600) {
    if (isScrolling) return;
    isScrolling = true;

    const startY = window.scrollY;
    const diff = targetY - startY;

    // Skip animation for very small distances
    if (Math.abs(diff) < 5) {
      window.scrollTo(0, targetY);
      isScrolling = false;
      return;
    }

    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use appropriate easing
      const easedProgress = isMobile
        ? easeOutCubic(progress)
        : easeInOutQuad(progress);

      window.scrollTo(0, startY + diff * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        isScrolling = false;
      }
    }

    requestAnimationFrame(step);
  }

  // Easing functions
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // Main smooth scroll handler - simplified and reliable
  function addSmoothScroll(links) {
    links.forEach((link) => {
      // Remove any existing listeners first
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);

      newLink.addEventListener("click", (e) => {
        const href = newLink.getAttribute("href");

        if (!href || !href.startsWith("#")) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        // Handle back-to-top
        if (href === "#" || newLink.id === "backToTop") {
          smoothScrollTo(0);
          closeNavbar();
          return;
        }

        // Find target element
        const targetEl = document.querySelector(href);
        if (!targetEl) return;

        // Calculate target position
        const rect = targetEl.getBoundingClientRect();
        const targetY = rect.top + window.scrollY - OFFSET;

        smoothScrollTo(targetY);
        closeNavbar();
      });
    });
  }

  // Fast navbar close for mobile
  function closeNavbar() {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      if (isMobile) {
        // Force immediate close on mobile
        navbarCollapse.classList.remove("show");
        navbarCollapse.style.height = "0px";
        setTimeout(() => {
          navbarCollapse.style.height = "";
        }, 100);
      } else {
        // Use Bootstrap collapse on desktop
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    }
  }

  // Select all smooth scroll links (exclude dropdown toggles)
  const smoothLinks = document.querySelectorAll(
    '#otherDropdown + .dropdown-menu a[href="#work"], ' +
      '#otherDropdown + .dropdown-menu a[href="#team"], ' +
      '#otherDropdown + .dropdown-menu a[href="#contact"], ' +
      '#otherDropdown + .dropdown-menu a[href="#services"], ' +
      'a.nav-link[href="#contact"], ' +
      '.hero-buttons a[href^="#"], ' +
      'footer a[href^="#"]:not([data-bs-toggle]), ' +
      "#backToTop"
  );

  // Apply smooth scroll to all links
  addSmoothScroll(Array.from(smoothLinks));

  // Mobile-specific optimizations
  if (isMobile) {
    // Disable iOS bounce during scroll animation
    document.addEventListener(
      "touchmove",
      (e) => {
        if (isScrolling) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    // Add CSS for better mobile performance
    const style = document.createElement("style");
    style.textContent = `
      .nav-link, .hero-buttons a, footer a, #backToTop {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
    `;
    document.head.appendChild(style);
  }
});

// ======================= Legacy Support =======================
// Keep your original footer and back-to-top handlers as fallback
document.addEventListener("DOMContentLoaded", () => {
  // Fallback for footer links (in case they're added dynamically)
  setTimeout(() => {
    document
      .querySelectorAll("footer a[href^='#']:not([data-smooth-handled])")
      .forEach((link) => {
        link.setAttribute("data-smooth-handled", "true");
        link.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            const targetY =
              target.getBoundingClientRect().top + window.scrollY - 60;
            window.scrollTo({ top: targetY, behavior: "smooth" });
          }
        });
      });
  }, 500);
});

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

if (toggler)
  toggler.addEventListener("click", () => toggler.classList.toggle("open"));

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

// ======================= Hero Marquee =======================
const marquee = document.getElementById("heroMarquee");
if (marquee) {
  const speed = 0.5;
  const images = Array.from(marquee.children);
  images.forEach((img) => marquee.appendChild(img.cloneNode(true)));

  let offset = 0;
  function animateMarquee() {
    offset -= speed;
    const firstImg = marquee.children[0];
    if (Math.abs(offset) >= firstImg.offsetWidth + 64) {
      offset += firstImg.offsetWidth + 64;
      marquee.appendChild(firstImg);
    }
    marquee.style.transform = `translateX(${offset}px) translateY(-50%)`;
    requestAnimationFrame(animateMarquee);
  }
  animateMarquee();
}

// ======================= Read More About =======================
const readMoreBtn = document.getElementById("readMoreBtn");
const aboutExtra = document.getElementById("aboutExtra");
if (readMoreBtn && aboutExtra) {
  readMoreBtn.addEventListener("click", () => {
    if (aboutExtra.classList.contains("show")) {
      aboutExtra.style.height = aboutExtra.scrollHeight + "px";
      requestAnimationFrame(() => {
        aboutExtra.style.height = "0";
        aboutExtra.style.opacity = "0";
      });
      aboutExtra.classList.remove("show");
      readMoreBtn.textContent = "Read More";
    } else {
      const scrollHeight = aboutExtra.scrollHeight;
      aboutExtra.classList.add("show");
      aboutExtra.style.height = "0";
      requestAnimationFrame(() => {
        aboutExtra.style.height = scrollHeight + "px";
        aboutExtra.style.opacity = "1";
      });
      readMoreBtn.textContent = "Read Less";
      aboutExtra.addEventListener("transitionend", function handler() {
        if (aboutExtra.classList.contains("show"))
          aboutExtra.style.height = "auto";
        aboutExtra.removeEventListener("transitionend", handler);
      });
    }
  });
}

// ======================= Swiper =======================
const swiper = new Swiper(".mySwiper", {
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
});

const seeMoreBtn = document.getElementById("seeMoreBtn");

if (seeMoreBtn) {
  // Hide button initially
  seeMoreBtn.classList.add("d-none");

  swiper.on("slideChange", () => {
    const lastIndex = swiper.slides.length - 1; // last slide index
    if (swiper.activeIndex === lastIndex) {
      // Show button with fade-in
      seeMoreBtn.classList.remove("d-none");
      seeMoreBtn.classList.add("fade-in");
    } else {
      // Hide button
      seeMoreBtn.classList.add("d-none");
      seeMoreBtn.classList.remove("fade-in");
    }
  });
}

// ======================= Scroll-triggered Animations =======================
const scrollElements = {
  about: document.querySelectorAll(
    "#about h2, #about .lead, #about blockquote"
  ),
  services: document.querySelectorAll("#services h2, #services .card"),
  work: document.getElementById("work"),
  highlights: document.getElementById("highlights"),
  team: document.getElementById("team"),
  sectionsToAnimate: document.querySelectorAll("#work, #team, #contact"),
  parallax: document.querySelector(".about-bg"),
};

function handleScroll() {
  const triggerBottom = window.innerHeight * 0.85;

  // Helper to reveal NodeList
  function revealElements(elements) {
    elements.forEach((el) => {
      if (!el) return;
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) el.classList.add("reveal");
    });
  }

  // About
  revealElements(scrollElements.about);

  // Services
  revealElements(scrollElements.services);

  // Work
  if (scrollElements.work) {
    if (scrollElements.work.getBoundingClientRect().top < triggerBottom)
      scrollElements.work.classList.add("visible");
  }

  // Highlights
  if (scrollElements.highlights) {
    if (scrollElements.highlights.getBoundingClientRect().top < triggerBottom)
      scrollElements.highlights.classList.add("visible");
  }

  // Team
  if (scrollElements.team) {
    if (scrollElements.team.getBoundingClientRect().top < triggerBottom)
      scrollElements.team.classList.add("visible");
  }

  // Sections animate children
  scrollElements.sectionsToAnimate.forEach((section) => {
    if (
      section.getBoundingClientRect().top < triggerBottom &&
      !section.classList.contains("animated")
    ) {
      const children = section.querySelectorAll(
        "h2, .lead, .card, p, a, iframe, img, .d-flex a"
      );
      children.forEach((el, index) =>
        setTimeout(() => el.classList.add("visible"), index * 100)
      );
      section.classList.add("animated");
    }
  });

  // Back-to-top button
  if (backToTop) backToTop.classList.toggle("show", window.scrollY > 300);

  // Parallax
  if (scrollElements.parallax)
    scrollElements.parallax.style.transform = `translateY(${
      window.scrollY * 0.2
    }px)`;
}

// Throttle scroll for performance
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
});
window.addEventListener("load", handleScroll);

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
