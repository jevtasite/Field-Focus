// ======================= Smooth Scroll =======================
document.addEventListener("DOMContentLoaded", () => {
  const OFFSET = 70;

  // Simple, instant smooth scroll using native CSS
  document.documentElement.style.scrollBehavior = "smooth";

  // Handle all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Skip dropdown toggles (they have data-bs-toggle attribute)
      if (link.hasAttribute("data-bs-toggle")) return;

      // Skip if it's a dropdown toggle with just "#"
      if (href === "#" && (link.classList.contains("dropdown-toggle") || link.id === "otherDropdown")) {
        return;
      }

      // Handle back to top
      if (href === "#") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        closeNavbar();
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
      closeNavbar();
    });
  });

  // Back to top button
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Close navbar after clicking link
  function closeNavbar() {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navbarToggler = document.querySelector(".navbar-toggler");

    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) {
        bsCollapse.hide();
      } else {
        new bootstrap.Collapse(navbarCollapse).hide();
      }

      if (navbarToggler) {
        navbarToggler.classList.add("collapsed");
        navbarToggler.setAttribute("aria-expanded", "false");
      }
    }
  }
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
