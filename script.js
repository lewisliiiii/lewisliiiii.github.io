const lightbox = document.querySelector(".image-lightbox");
const lightboxImage = lightbox.querySelector("img");
const closeButton = lightbox.querySelector(".lightbox-close");
const previousButton = lightbox.querySelector(".lightbox-previous");
const nextButton = lightbox.querySelector(".lightbox-next");
const thumbnailContainer = lightbox.querySelector(".lightbox-thumbnails");
const projectImages = [...document.querySelectorAll(".project-media img")];
let activeImageIndex = 0;
let activeGalleryImages = [];

function renderLightboxImage() {
  const image = activeGalleryImages[activeImageIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  thumbnailContainer.querySelectorAll("button").forEach((thumbnail, index) => {
    thumbnail.classList.toggle("active", index === activeImageIndex);
    thumbnail.setAttribute("aria-current", index === activeImageIndex ? "true" : "false");
  });
}

function changeImage(offset) {
  activeImageIndex = (activeImageIndex + offset + projectImages.length) % projectImages.length;
  renderLightboxImage();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  lightboxImage.src = "";
  lightboxImage.alt = "";
}

projectImages.forEach((image, index) => {
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", `Zoom in: ${image.alt}`);

  const openLightbox = () => {
    activeGalleryImages = [...image.closest(".project-card").querySelectorAll(".project-media img")];
    activeImageIndex = activeGalleryImages.indexOf(image);
    thumbnailContainer.replaceChildren();
    activeGalleryImages.forEach((galleryImage, galleryIndex) => {
      const thumbnail = document.createElement("button");
      thumbnail.type = "button";
      thumbnail.className = "lightbox-thumbnail";
      thumbnail.setAttribute("aria-label", `Show image ${galleryIndex + 1}: ${galleryImage.alt}`);
      thumbnail.innerHTML = `<img src="${galleryImage.src}" alt="" />`;
      thumbnail.addEventListener("click", () => {
        activeImageIndex = galleryIndex;
        renderLightboxImage();
      });
      thumbnailContainer.appendChild(thumbnail);
    });
    renderLightboxImage();
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  };

  image.addEventListener("click", openLightbox);
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox();
    }
  });
});

closeButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", () => changeImage(-1));
nextButton.addEventListener("click", () => changeImage(1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") changeImage(-1);
  if (event.key === "ArrowRight") changeImage(1);
});
