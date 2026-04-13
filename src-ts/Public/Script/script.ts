declare const AOS: { init: () => void } | undefined;

document.addEventListener("DOMContentLoaded", () => {
  const fadeInElements = document.querySelectorAll<HTMLElement>(".fade-in, .slide-in");
  fadeInElements.forEach((element) => {
    element.style.opacity = "1";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const serviceCards = document.querySelectorAll<HTMLElement>(".fade-in");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("show");
        }
      });
    },
    { threshold: 0.2 }
  );

  serviceCards.forEach((card) => {
    observer.observe(card);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector<HTMLElement>(".animated-button");
  if (!button) {
    return;
  }

  const checkVisibility = () => {
    const rect = button.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      button.classList.add("show");
    }
  };

  window.addEventListener("scroll", checkVisibility);
  checkVisibility();
});

document.addEventListener("DOMContentLoaded", () => {
  if (typeof AOS !== "undefined") {
    AOS.init();
  }

  const testimonials = document.querySelectorAll<HTMLElement>(".testimonial");
  if (testimonials.length === 0) {
    return;
  }

  let index = 0;

  const showTestimonial = () => {
    testimonials.forEach((testimonial, i) => {
      testimonial.style.transform = i === index ? "scale(1.1)" : "scale(1)";
      testimonial.style.opacity = i === index ? "1" : "0.5";
    });
    index = (index + 1) % testimonials.length;
  };

  showTestimonial();
  setInterval(showTestimonial, 3000);
});
