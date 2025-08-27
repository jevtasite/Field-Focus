// Smooth scroll
function smoothScrollTo(targetY, duration = 600) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const time = timestamp - startTime;
    const percent = Math.min(time / duration, 1);
    window.scrollTo(0, startY + diff * easeInOutQuad(percent));
    if (time < duration) {
      requestAnimationFrame(step);
    }
  }

  // Ease function
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  requestAnimationFrame(step);
}

// Smooth scroll for footer links
document.querySelectorAll("footer a[href^='#']").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);

    if (target) {
      const y = target.getBoundingClientRect().top + window.pageYOffset - 60; // adjust offset for navbar
      smoothScrollTo(y);
    }
  });
});

// Back to Top button smooth scroll
const backToTop = document.getElementById("backToTop");
if (backToTop) {
  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    smoothScrollTo(0);
  });
}

const backToTopBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    // show after scrolling 300px
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

// Marquee animation
const marquee = document.getElementById("heroMarquee");
if (marquee) {
  const speed = 0.5;
  const images = Array.from(marquee.children);

  images.forEach((img) => {
    const clone = img.cloneNode(true);
    marquee.appendChild(clone);
  });

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

// Navbar toggler animation
const toggler = document.querySelector(".navbar-toggler");
if (toggler) {
  toggler.addEventListener("click", function () {
    this.classList.toggle("open");
  });
}
// Animate mobile navbar collapse height
document.querySelectorAll(".navbar-collapse").forEach((collapse) => {
  collapse.addEventListener("show.bs.collapse", (e) => {
    const el = e.target;
    el.style.height = "0";
    setTimeout(() => {
      el.style.height = el.scrollHeight + "px";
    });
  });

  collapse.addEventListener("hide.bs.collapse", (e) => {
    const el = e.target;
    el.style.height = el.scrollHeight + "px";
    setTimeout(() => {
      el.style.height = "0";
    });
  });
});

// Ensure navbar toggler resets when navbar collapses
const navbarCollapse = document.querySelector(".navbar-collapse");
const navbarToggler = document.querySelector(".navbar-toggler");

if (navbarCollapse && navbarToggler) {
  navbarCollapse.addEventListener("hidden.bs.collapse", () => {
    navbarToggler.classList.remove("open");
  });
}

// Loader
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  if (!loader) return;
  loader.style.transition = "opacity 1s ease";
  loader.style.opacity = "0";
  setTimeout(() => {
    if (loader.parentNode) loader.parentNode.removeChild(loader);
  }, 1000);
});

// Safety timeout in case load hangs
setTimeout(() => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.transition = "opacity 0.5s ease";
    loader.style.opacity = "0";
    setTimeout(() => {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    }, 500);
  }
}, 5000);

// About section scroll reveal
const aboutElements = document.querySelectorAll(
  "#about h2, #about .lead, #about blockquote"
);

function revealAboutElements() {
  const triggerBottom = window.innerHeight * 0.85;
  aboutElements.forEach((el) => {
    const elTop = el.getBoundingClientRect().top;
    if (elTop < triggerBottom) {
      el.classList.add("reveal");
    }
  });
}

// About extra
const readMoreBtn = document.getElementById("readMoreBtn");
const aboutExtra = document.getElementById("aboutExtra");

if (readMoreBtn && aboutExtra) {
  readMoreBtn.addEventListener("click", () => {
    if (aboutExtra.classList.contains("show")) {
      aboutExtra.style.height = aboutExtra.scrollHeight + "px"; // start from current
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
        if (aboutExtra.classList.contains("show")) {
          aboutExtra.style.height = "auto";
        }
        aboutExtra.removeEventListener("transitionend", handler);
      });
    }
  });
}

// Parallax effect for about section
const aboutBg = document.querySelector(".about-bg");
function parallaxAbout() {
  if (aboutBg) {
    const scrollY = window.scrollY;
    aboutBg.style.transform = `translateY(${scrollY * 0.2}px)`;
  }
}

// Scroll listener
window.addEventListener("scroll", () => {
  revealAboutElements();
  parallaxAbout();
});
window.addEventListener("load", () => {
  revealAboutElements();
  parallaxAbout();
});

// Scroll-trigger fade-in for Work section
const workSection = document.getElementById("work");

function revealWorkSection() {
  const triggerBottom = window.innerHeight * 0.85;
  const top = workSection.getBoundingClientRect().top;

  if (top < triggerBottom) {
    workSection.classList.add("visible");
    window.removeEventListener("scroll", revealWorkSection);
  }
}

window.addEventListener("scroll", revealWorkSection);
window.addEventListener("load", revealWorkSection);

// Swiper initialization
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

// Handle "See More" button visibility
const seeMoreBtn = document.getElementById("seeMoreBtn");

if (seeMoreBtn) {
  swiper.on("slideChange", () => {
    if (swiper.isEnd) {
      seeMoreBtn.classList.remove("d-none");
      seeMoreBtn.classList.add("fade-in");
    } else {
      seeMoreBtn.classList.add("d-none");
    }
  });
}

// Service animation
const serviceElements = document.querySelectorAll(
  "#services h2, #services .card"
);

function revealServices() {
  const triggerBottom = window.innerHeight * 0.85;

  serviceElements.forEach((el) => {
    const elTop = el.getBoundingClientRect().top;
    if (elTop < triggerBottom) {
      el.classList.add("reveal");
    }
  });
}

window.addEventListener("scroll", revealServices);
window.addEventListener("load", revealServices);

// Scroll-triggered animation for Highlights section
const highlightsSection = document.getElementById("highlights");

function revealHighlights() {
  const triggerBottom = window.innerHeight * 0.85;
  const top = highlightsSection.getBoundingClientRect().top;

  if (top < triggerBottom) {
    highlightsSection.classList.add("visible");
    window.removeEventListener("scroll", revealHighlights);
  }
}

window.addEventListener("scroll", revealHighlights);
window.addEventListener("load", revealHighlights);

// Scroll-triggered animation for Team section
const teamSection = document.getElementById("team");

function revealTeam() {
  const triggerBottom = window.innerHeight * 0.85;
  const top = teamSection.getBoundingClientRect().top;

  if (top < triggerBottom) {
    teamSection.classList.add("visible");
    window.removeEventListener("scroll", revealTeam);
  }
}

window.addEventListener("scroll", revealTeam);
window.addEventListener("load", revealTeam);

// Animate elements in each section separately
const sectionsToAnimate = document.querySelectorAll("#work, #team, #contact");

function revealSectionElements() {
  const triggerBottom = window.innerHeight * 0.85;

  sectionsToAnimate.forEach((section) => {
    const elTop = section.getBoundingClientRect().top;
    if (elTop < triggerBottom) {
      // Only animate if not already visible
      if (!section.classList.contains("animated")) {
        const children = section.querySelectorAll(
          "h2, .lead, .card, p, a, iframe, img, .d-flex a"
        );
        children.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add("visible");
          }, index * 100);
        });
        section.classList.add("animated");
      }
    }
  });
}

window.addEventListener("scroll", revealSectionElements);
window.addEventListener("load", revealSectionElements);

// Smooth scroll for Work, Team (in Other) and Contact
document.addEventListener("DOMContentLoaded", () => {
  const OFFSET = 60;

  // Target only the specific links
  const smoothLinks = document.querySelectorAll(
    '#otherDropdown + .dropdown-menu a[href="#work"], ' +
      '#otherDropdown + .dropdown-menu a[href="#team"], ' +
      'a.nav-link[href="#contact"]'
  );

  smoothLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetID = link.getAttribute("href");
      const targetEl = document.querySelector(targetID);
      if (!targetEl) return;

      e.preventDefault();

      // Smooth scroll calculation
      const targetY =
        targetEl.getBoundingClientRect().top + window.scrollY - OFFSET;

      smoothScrollTo(targetY);

      // Close mobile navbar if open
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        bootstrap.Collapse.getInstance(navbarCollapse).hide();
      }
    });
  });
});
