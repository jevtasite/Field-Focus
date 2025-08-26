// Smooth scrolling for nav links
document.querySelectorAll("a.nav-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    if (this.hash !== "") {
      e.preventDefault();
      const target = document.querySelector(this.hash);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 60,
          behavior: "smooth",
        });
      }
    }
  });
});

// Contact form
const contactForm = document.querySelector("form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Message sent! (connect backend or EmailJS here)");
  });
}

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
const sectionsToAnimate = document.querySelectorAll(
  "#about, #services, #work, #highlights, #team, #contact"
);

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
          }, index * 100); // stagger within the section only
        });
        section.classList.add("animated");
      }
    }
  });
}

window.addEventListener("scroll", revealSectionElements);
window.addEventListener("load", revealSectionElements);
