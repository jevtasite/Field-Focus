const gallery = document.querySelectorAll(".graphics-card img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".lightbox-close");
const prevBtn = document.querySelector(".lightbox-prev");
const nextBtn = document.querySelector(".lightbox-next");

let currentIndex = 0;
let images = Array.from(gallery).map((img) => img.src);

function showLightbox(index) {
  currentIndex = index;
  lightboxImg.src = images[currentIndex];
  lightbox.style.display = "flex";
}

function closeLightbox() {
  lightbox.style.display = "none";
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  lightboxImg.src = images[currentIndex];
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  lightboxImg.src = images[currentIndex];
}

gallery.forEach((img, index) => {
  img.parentElement.addEventListener("click", () => showLightbox(index));
});

closeBtn.addEventListener("click", closeLightbox);
nextBtn.addEventListener("click", nextImage);
prevBtn.addEventListener("click", prevImage);

// Close on outside click
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Navigate with arrow keys
document.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "flex") {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") closeLightbox();
  }
});

// ======================= Hero Marquee for Graphics Page =======================
const marquee = document.getElementById("heroMarquee");
if (marquee) {
  const speed = 0.5; // scroll speed
  const images = Array.from(marquee.children);

  // duplicate images for continuous scroll
  images.forEach((img) => marquee.appendChild(img.cloneNode(true)));

  let offset = 0;

  function animateMarquee() {
    offset -= speed;
    const firstImg = marquee.children[0];

    // move first image to end when it scrolls out
    if (Math.abs(offset) >= firstImg.offsetWidth + 64) {
      offset += firstImg.offsetWidth + 64;
      marquee.appendChild(firstImg);
    }

    // translate marquee
    marquee.style.transform = `translateX(${offset}px) translateY(-50%)`;

    requestAnimationFrame(animateMarquee);
  }

  animateMarquee();
}
