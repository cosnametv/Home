import { attachNewsletterForm } from "./newsletter.js";

export function includeHTML(id: string, file: string, callback?: () => void): void {
  fetch(file)
    .then((response) => {
      if (!response.ok) throw new Error(`Cannot load ${file}`);
      return response.text();
    })
    .then((html) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
      if (callback) callback();
    })
    .catch((err) => console.error(err));
}

export function initHeader(): void {
  window.addEventListener("scroll", () => {
    const nav = document.querySelector<HTMLElement>(".nav");
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 50);
  });

  const burger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  if (burger && menu) {
    burger.addEventListener("click", () => menu.classList.toggle("active"));
  }

  const links = document.querySelectorAll<HTMLAnchorElement>(".menu a");
  links.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

export function onDocumentReady(fn: () => void): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

export function bootStandardLayout(): void {
  onDocumentReady(() => {
    includeHTML("header", "header.html", initHeader);
    includeHTML("footer", "footer.html", attachNewsletterForm);
  });
}
