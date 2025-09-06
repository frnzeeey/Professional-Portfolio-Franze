// =====================
// Fade-in / Fade-out Observer
// =====================
function fadeOnScroll(selector, className = "show", once = false) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(className);
        if (once) observer.unobserve(entry.target);
      } else if (!once) {
        entry.target.classList.remove(className);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });

  elements.forEach(el => observer.observe(el));
}

fadeOnScroll(".fade-in");
fadeOnScroll(".skill-box");
fadeOnScroll(".work-page-fade", "work-page-visible");
fadeOnScroll(".resume-card", "show", true);
fadeOnScroll(".contact-card, .contact-images");


// =====================
// Navbar Burger Toggle
// =====================
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const closeBtn = document.getElementById("close-btn");

if (menuToggle && navLinks && closeBtn) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.add("show");
    menuToggle.classList.add("hide");
  });

  closeBtn.addEventListener("click", () => {
    navLinks.classList.remove("show");
    menuToggle.classList.remove("hide");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
      menuToggle.classList.remove("hide");
    });
  });
}


// =====================
// Skills Popup Interaction
// =====================
document.querySelectorAll(".skill-box").forEach(box => {
  box.addEventListener("click", () => {
    box.classList.toggle("active-popup");
  });
});


// =====================
// Featured Works Toggle
// =====================
const toggleBtns = document.querySelectorAll(".toggle-btn");
const workBoxes = document.querySelectorAll(".work-box");

if (toggleBtns.length && workBoxes.length) {
  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      toggleBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.category;
      workBoxes.forEach(box => {
        box.classList.toggle("hidden", !box.classList.contains(category));
      });
    });
  });
}


// =====================
// Work Modals (Preview Fix)
// =====================
const previewBtns = document.querySelectorAll(".preview-btn");
const modals = document.querySelectorAll(".modal");
const closeBtns = document.querySelectorAll(".close-modal");

if (previewBtns.length && modals.length) {
  previewBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.modal;
      const modal = document.getElementById(modalId);

      if (modal) {
        modal.style.display = "flex";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";

        const content = modal.querySelector(".modal-content");
        if (content) {
          content.style.width = "90%";
          content.style.maxWidth = "1200px";
          const iframe = content.querySelector("iframe");
          if (iframe) {
            iframe.style.width = "100%";
            iframe.style.height = "80vh";
          }
        }
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (modal) modal.style.display = "none";
    });
  });

  window.addEventListener("click", (e) => {
    modals.forEach(modal => {
      if (e.target === modal) modal.style.display = "none";
    });
  });
}


// =====================
// Carousel Functionality
// =====================
document.querySelectorAll(".carousel").forEach(carousel => {
  const track = carousel.querySelector(".carousel-track");
  if (!track) return;

  const slides = Array.from(track.children);
  const prev = carousel.querySelector(".prev");
  const next = carousel.querySelector(".next");
  let index = 0;

  const updateCarousel = () => {
    if (!slides.length) return;
    const slideWidth = slides[0].getBoundingClientRect().width + 16;
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  };

  if (next) next.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    updateCarousel();
  });
  if (prev) prev.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  // Touch swipe
  let startX = 0;
  let isDragging = false;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  track.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    track.style.transform = `translateX(calc(-${slides[0].getBoundingClientRect().width + 16}px * ${index} + ${diff}px))`;
  });

  track.addEventListener("touchend", (e) => {
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    const threshold = 50;

    if (diff > threshold) index = (index - 1 + slides.length) % slides.length;
    else if (diff < -threshold) index = (index + 1) % slides.length;

    updateCarousel();
  });

  window.addEventListener("resize", updateCarousel);
});


// =====================
// Contact Image Modal
// =====================
document.querySelectorAll(".contact-images img").forEach(img => {
  img.addEventListener("click", () => {
    let modal = document.createElement("div");
    modal.classList.add("image-modal");
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";

    modal.innerHTML = `
      <div class="image-modal-content">
        <span class="close">&times;</span>
        <img src="${img.src}" alt="Contact Image">
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector(".close").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
  });
});


// =====================
// Cover page overlay
// =====================
const overlay = document.getElementById("cover-overlay");
const circle = document.querySelector(".cover-circle");
const btn = document.getElementById("cover-btn");

if (btn && circle && overlay) {
  btn.addEventListener("click", () => {
    circle.classList.add("shrink");
    setTimeout(() => overlay.classList.add("hidden"), 1000);
  });
}


// =====================
// Testimonials Section
// =====================
const carouselEl = document.querySelector('.testimonial-carousel');
const cards = document.querySelectorAll('.testimonial-card');

if (carouselEl && cards.length) {
  let current = 0;
  let startX = 0;
  let endX = 0;

  function showCard(index) {
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
  }

  carouselEl.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  carouselEl.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  carouselEl.addEventListener('mousedown', (e) => {
    startX = e.clientX;
  });

  carouselEl.addEventListener('mouseup', (e) => {
    endX = e.clientX;
    handleSwipe();
  });

  function handleSwipe() {
    if (startX - endX > 50) {
      current = (current + 1) % cards.length;
      showCard(current);
    } else if (endX - startX > 50) {
      current = (current - 1 + cards.length) % cards.length;
      showCard(current);
    }
  }
}


// =====================
// Resume Section (Circular Skills)
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelectorAll(".skill-circle");
  if (!skills.length) return;

  const animateSkill = (skill) => {
    const value = parseInt(skill.getAttribute("data-skill"), 10);
    const circle = skill.querySelector(".progress");
    const label = skill.querySelector("strong");
    if (!circle || !label) return;

    const r = parseFloat(circle.getAttribute("r"));
    const circumference = 2 * Math.PI * r;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;

    const duration = 1500;
    const start = performance.now();

    function animate(now) {
      const elapsed = now - start;
      const progressRatio = Math.min(elapsed / duration, 1);
      const currentPercent = Math.round(progressRatio * value);

      const offset = circumference - (currentPercent / 100) * circumference;
      circle.style.strokeDashoffset = offset;
      label.textContent = `${currentPercent}%`;

      if (progressRatio < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkill(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  skills.forEach((skill) => observer.observe(skill));
});
