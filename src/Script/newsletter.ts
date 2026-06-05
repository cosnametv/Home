import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db, NEWSLETTER_COLLECTION, firestoreWithTimeout } from "./firebase-client.js";

type FeedbackVariant = "success" | "error";

interface FeedbackOverlay {
  show: (variant: FeedbackVariant, title: string, message: string) => void;
  hide: () => void;
}

let overlayApi: FeedbackOverlay | null = null;

export function initNewsletterFeedbackOverlay(): FeedbackOverlay {
  let overlay = document.getElementById("newsletterFeedbackOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "newsletterFeedbackOverlay";
    overlay.className = "site-feedback-overlay";
    overlay.setAttribute("role", "alertdialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "newsletterFeedbackTitle");
    overlay.setAttribute("aria-describedby", "newsletterFeedbackMessage");
    overlay.hidden = true;

    const backdrop = document.createElement("div");
    backdrop.className = "site-feedback-overlay__backdrop";
    backdrop.dataset.dismissNewsletterOverlay = "";
    backdrop.tabIndex = -1;
    backdrop.setAttribute("aria-hidden", "true");

    const panel = document.createElement("div");
    panel.className = "site-feedback-overlay__panel";

    const iconWrap = document.createElement("div");
    iconWrap.className = "site-feedback-overlay__icon";
    iconWrap.setAttribute("aria-hidden", "true");
    iconWrap.innerHTML =
      '<i class="fas fa-check site-feedback-overlay__icon-success"></i>' +
      '<i class="fas fa-triangle-exclamation site-feedback-overlay__icon-error d-none"></i>';

    const title = document.createElement("h2");
    title.id = "newsletterFeedbackTitle";
    title.className = "site-feedback-overlay__title";
    title.textContent = "Subscribed";

    const message = document.createElement("p");
    message.id = "newsletterFeedbackMessage";
    message.className = "site-feedback-overlay__message";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-primary rounded-pill px-4 site-feedback-overlay__dismiss";
    btn.dataset.dismissNewsletterOverlay = "";
    btn.textContent = "OK";

    panel.append(iconWrap, title, message, btn);
    overlay.append(backdrop, panel);
    document.body.appendChild(overlay);
  }

  if (overlayApi) return overlayApi;

  const titleEl = document.getElementById("newsletterFeedbackTitle");
  const messageEl = document.getElementById("newsletterFeedbackMessage");
  const dismissBtn = overlay.querySelector<HTMLButtonElement>(".site-feedback-overlay__dismiss");
  const iconOk = overlay.querySelector<HTMLElement>(".site-feedback-overlay__icon-success");
  const iconErr = overlay.querySelector<HTMLElement>(".site-feedback-overlay__icon-error");

  let hideTimer: ReturnType<typeof setTimeout> | null = null;
  let focusBefore: Element | null = null;

  function onEscape(ev: KeyboardEvent): void {
    if (ev.key === "Escape") hide();
  }

  function hide(): void {
    document.removeEventListener("keydown", onEscape);
    overlay!.classList.remove("is-visible");
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      overlay!.setAttribute("hidden", "");
      if (focusBefore && "focus" in focusBefore && typeof (focusBefore as HTMLElement).focus === "function") {
        (focusBefore as HTMLElement).focus();
      }
      focusBefore = null;
    }, 320);
  }

  function show(variant: FeedbackVariant, titleText: string, messageText: string): void {
    overlay!.dataset.variant = variant;
    if (titleEl) titleEl.textContent = titleText;
    if (messageEl) messageEl.textContent = messageText;
    if (iconOk && iconErr) {
      iconOk.classList.toggle("d-none", variant !== "success");
      iconErr.classList.toggle("d-none", variant !== "error");
    }
    focusBefore = document.activeElement;
    overlay!.removeAttribute("hidden");
    document.addEventListener("keydown", onEscape);
    requestAnimationFrame(() => {
      overlay!.classList.add("is-visible");
      if (dismissBtn) dismissBtn.focus();
    });
  }

  overlay.querySelectorAll("[data-dismiss-newsletter-overlay]").forEach((el) => {
    el.addEventListener("click", hide);
  });

  overlayApi = { show, hide };
  return overlayApi;
}

export function attachNewsletterForm(): void {
  const form = document.getElementById("newsletterForm") as HTMLFormElement | null;
  if (!form || form.dataset.newsletterBound === "true") return;

  const feedback = initNewsletterFeedbackOverlay();
  form.dataset.newsletterBound = "true";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailField = document.getElementById("newsletterEmail") as HTMLInputElement | null;
    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!emailField) return;

    const email = emailField.value.trim();
    if (!email) return;

    if (submitBtn) submitBtn.disabled = true;

    try {
      const q = query(collection(db, NEWSLETTER_COLLECTION), where("email", "==", email));
      const querySnapshot = await firestoreWithTimeout(
        getDocs(q),
        12000,
        "Could not verify subscription. Please try again."
      );

      if (!querySnapshot.empty) {
        feedback.show("error", "Already subscribed", "This email is already on our newsletter list.");
        return;
      }

      await firestoreWithTimeout(
        addDoc(collection(db, NEWSLETTER_COLLECTION), {
          email,
          subscribedAt: serverTimestamp()
        }),
        12000,
        "Subscription could not be completed. Please try again."
      );

      form.reset();
      feedback.show(
        "success",
        "Thanks for subscribing!",
        "You will receive updates from Cosname Technologies."
      );
    } catch (error) {
      const err = error as Error;
      feedback.show(
        "error",
        "Subscription failed",
        err?.message ? String(err.message) : "Something went wrong. Please try again."
      );
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
