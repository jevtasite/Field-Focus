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

// Contact form placeholder (expand with backend/EmailJS later)
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Message sent! (connect backend or EmailJS here)");
});

//Marquee seemles loop
const marquee = document.getElementById("heroMarquee");
const speed = 0.5; // pixels per frame

// Convert HTMLCollection to array and clone images
const images = Array.from(marquee.children);
images.forEach((img) => {
  const clone = img.cloneNode(true);
  marquee.appendChild(clone); // append clone to end
});

let offset = 0;

function animateMarquee() {
  offset -= speed;

  // When the first image is fully out of view, move it to the end
  const firstImg = marquee.children[0];
  if (Math.abs(offset) >= firstImg.offsetWidth + 64) {
    // 64 = gap in px
    offset += firstImg.offsetWidth + 64; // reset offset
    marquee.appendChild(firstImg); // move first image to the end
  }

  marquee.style.transform = `translateX(${offset}px) translateY(-50%)`;
  requestAnimationFrame(animateMarquee);
}

animateMarquee();
