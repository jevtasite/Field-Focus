// ======================= Work Filters =======================
const filterBtns = document.querySelectorAll(".filter-btn");
const workItems = document.querySelectorAll(".work-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Active button styling
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.getAttribute("data-category");

    // Show/hide items based on category
    workItems.forEach((item) => {
      if (
        category === "all" ||
        item.getAttribute("data-category") === category
      ) {
        item.parentElement.style.display = "block";
      } else {
        item.parentElement.style.display = "none";
      }
    });
  });
});

// ======================= Lightbox Overlay =======================
workItems.forEach((item) => {
  const overlayIcon = item.querySelector(".view-icon");
  if (!overlayIcon) return;

  overlayIcon.addEventListener("click", () => {
    const imgSrc = item.querySelector("img").getAttribute("src");
    const overlay = document.createElement("div");
    overlay.classList.add("work-overlay");
    overlay.innerHTML = `
      <div class="overlay-content">
        <img src="${imgSrc}" alt="Preview" />
        <span class="close-overlay">&times;</span>
      </div>
    `;
    document.body.appendChild(overlay);

    // Close button
    overlay.querySelector(".close-overlay").addEventListener("click", () => {
      overlay.remove();
    });

    // Close on clicking outside
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
  });
});

// ======================= Client Logos Marquee =======================
const clientMarquee = document.querySelector(".marquee .marquee-content");
if (clientMarquee) {
  const speed = 0.5;
  const logos = Array.from(clientMarquee.children);
  logos.forEach((logo) => clientMarquee.appendChild(logo.cloneNode(true)));

  let offset = 0;
  function animateClientMarquee() {
    offset -= speed;
    const firstLogo = clientMarquee.children[0];
    if (Math.abs(offset) >= firstLogo.offsetWidth) {
      offset += firstLogo.offsetWidth;
      clientMarquee.appendChild(firstLogo);
    }
    clientMarquee.style.transform = `translateX(${offset}px)`;
    requestAnimationFrame(animateClientMarquee);
  }
  animateClientMarquee();
}

// ======================= Testimonials Swiper =======================
const swiperTestimonials = new Swiper(".mySwiperTestimonials", {
  slidesPerView: 1,
  loop: true,
  spaceBetween: 30,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// ======================= Graphics Hero Marquee =======================
const marqueeContainer = document.getElementById("graphicsHeroMarquee");
if (marqueeContainer) {
  const track = marqueeContainer.querySelector(".marquee-track");
  const speed = 0.2; // slower speed
  let offset = 0;
  let paused = false;

  // Clone images for seamless scroll
  Array.from(track.children).forEach((img) =>
    track.appendChild(img.cloneNode(true))
  );

  // Animate marquee
  function animate() {
    if (!paused) {
      offset -= speed;
      const firstImg = track.children[0];
      const imgStyle = getComputedStyle(firstImg);
      const totalWidth = firstImg.offsetWidth + parseInt(imgStyle.marginRight);
      if (Math.abs(offset) >= totalWidth) {
        offset += totalWidth;
        track.appendChild(firstImg);
      }
      track.style.transform = `translateX(${offset}px)`;
    }
    requestAnimationFrame(animate);
  }
  animate();

  // Pause on hover
  marqueeContainer.addEventListener("mouseenter", () => (paused = true));
  marqueeContainer.addEventListener("mouseleave", () => (paused = false));

  // Lightbox functionality
  track.querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", () => {
      let lightbox = document.querySelector(".graphics-lightbox");
      if (!lightbox) {
        lightbox = document.createElement("div");
        lightbox.classList.add("graphics-lightbox", "lightbox");
        lightbox.innerHTML = `<span class="close">&times;</span><img src="${img.src}" alt="${img.alt}">`;
        document.body.appendChild(lightbox);

        // Show lightbox
        lightbox.style.display = "flex";

        // Close button
        lightbox
          .querySelector(".close")
          .addEventListener("click", () => lightbox.remove());
        lightbox.addEventListener("click", (e) => {
          if (e.target === lightbox) lightbox.remove();
        });
      }
    });
  });
}
