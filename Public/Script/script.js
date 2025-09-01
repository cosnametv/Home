document.addEventListener("DOMContentLoaded", function() {
    const fadeInElements = document.querySelectorAll('.fade-in, .slide-in');

    fadeInElements.forEach(element => {
        element.style.opacity = '1';
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const serviceCards = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.2 });

    serviceCards.forEach(card => {
        observer.observe(card);
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".animated-button");

    function checkVisibility() {
        const rect = button.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            button.classList.add("show");
        }
    }

    window.addEventListener("scroll", checkVisibility);
    checkVisibility(); // Run once on load in case it's already visible
});
document.addEventListener("DOMContentLoaded", function () {
    AOS.init();
    
    const testimonials = document.querySelectorAll(".testimonial");
    let index = 0;

    function showTestimonial() {
        testimonials.forEach((t, i) => {
            t.style.transform = i === index ? "scale(1.1)" : "scale(1)";
            t.style.opacity = i === index ? "1" : "0.5";
        });

        index = (index + 1) % testimonials.length;
    }

    showTestimonial();
    setInterval(showTestimonial, 3000);
});
