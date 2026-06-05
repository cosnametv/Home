import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  db,
  CONTACT_COLLECTION,
  RATE_LIMIT_COLLECTION,
  DAILY_MESSAGE_LIMIT,
  emailToRateLimitKey,
  localDayKey,
  firestoreWithTimeout
} from "./firebase-client.js";
import { attachNewsletterForm } from "./newsletter.js";
import { includeHTML, initHeader, onDocumentReady } from "./layout.js";

type FeedbackVariant = "success" | "error";

interface ContactFeedback {
  showContactFeedback: (variant: FeedbackVariant, title: string, message: string) => void;
  hideContactFeedback: () => void;
}

function initContactFeedbackOverlay(): ContactFeedback | null {
  const overlay = document.getElementById("contactFeedbackOverlay");
  if (!overlay) return null;

  const titleEl = document.getElementById("contactFeedbackTitle");
  const messageEl = document.getElementById("contactFeedbackMessage");
  const dismissBtn = overlay.querySelector<HTMLButtonElement>(".contact-feedback-overlay__dismiss");
  const iconOk = overlay.querySelector<HTMLElement>(".contact-feedback-overlay__icon-success");
  const iconErr = overlay.querySelector<HTMLElement>(".contact-feedback-overlay__icon-error");

  let hideAfterMs: ReturnType<typeof setTimeout> | null = null;
  let focusBeforeOpen: Element | null = null;

  function onEscapeKey(ev: KeyboardEvent): void {
    if (ev.key === "Escape") hideContactFeedback();
  }

  function hideContactFeedback(): void {
    document.removeEventListener("keydown", onEscapeKey);
    overlay.classList.remove("is-visible");
    if (hideAfterMs) clearTimeout(hideAfterMs);
    hideAfterMs = setTimeout(() => {
      overlay.setAttribute("hidden", "");
      hideAfterMs = null;
      if (focusBeforeOpen && "focus" in focusBeforeOpen && typeof (focusBeforeOpen as HTMLElement).focus === "function") {
        (focusBeforeOpen as HTMLElement).focus();
      }
      focusBeforeOpen = null;
    }, 320);
  }

  function showContactFeedback(variant: FeedbackVariant, title: string, message: string): void {
    overlay.dataset.variant = variant;
    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    if (iconOk && iconErr) {
      if (variant === "success") {
        iconOk.classList.remove("d-none");
        iconErr.classList.add("d-none");
      } else {
        iconOk.classList.add("d-none");
        iconErr.classList.remove("d-none");
      }
    }
    focusBeforeOpen = document.activeElement;
    overlay.removeAttribute("hidden");
    document.addEventListener("keydown", onEscapeKey);
    requestAnimationFrame(() => {
      overlay.classList.add("is-visible");
      if (dismissBtn) dismissBtn.focus();
    });
  }

  overlay.querySelectorAll("[data-dismiss-overlay]").forEach((el) => {
    el.addEventListener("click", hideContactFeedback);
  });

  return { showContactFeedback, hideContactFeedback };
}

async function assertDailyMessageLimit(email: string): Promise<void> {
  const emailKey = emailToRateLimitKey(email);
  const dayKey = localDayKey();
  const ref = doc(db, RATE_LIMIT_COLLECTION, emailKey);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as { dayKey?: string; count?: number };
  if (data.dayKey === dayKey && (data.count ?? 0) >= DAILY_MESSAGE_LIMIT) {
    throw new Error(`You can only send ${DAILY_MESSAGE_LIMIT} messages per day. Please try again tomorrow.`);
  }
}

async function recordDailyMessageSend(email: string): Promise<void> {
  const emailKey = emailToRateLimitKey(email);
  const dayKey = localDayKey();
  const ref = doc(db, RATE_LIMIT_COLLECTION, emailKey);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { count: 1, dayKey });
    return;
  }
  const data = snap.data() as { dayKey?: string; count?: number };
  if (data.dayKey === dayKey) {
    await updateDoc(ref, { count: (data.count || 0) + 1 });
  } else {
    await setDoc(ref, { count: 1, dayKey });
  }
}

function attachContactHandler(): void {
  const form = document.getElementById("contactForm") as HTMLFormElement | null;
  if (!form) return;

  const submitBtn = document.getElementById("contactSubmitBtn") as HTMLButtonElement | null;
  const feedback = initContactFeedbackOverlay();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!submitBtn || submitBtn.disabled) return;

    const firstName = (document.getElementById("firstName") as HTMLInputElement).value.trim();
    const lastName = (document.getElementById("lastName") as HTMLInputElement).value.trim();
    const phone = (document.getElementById("phone") as HTMLInputElement).value.trim();
    const email = (document.getElementById("email") as HTMLInputElement).value.trim();
    const message = (document.getElementById("message") as HTMLTextAreaElement).value.trim();

    submitBtn.disabled = true;
    submitBtn.classList.add("is-sending");
    submitBtn.setAttribute("aria-busy", "true");

    try {
      await firestoreWithTimeout(
        assertDailyMessageLimit(email),
        8000,
        "Could not verify send limit. Please try again."
      );

      await firestoreWithTimeout(
        addDoc(collection(db, CONTACT_COLLECTION), {
          firstName,
          lastName,
          phone,
          email,
          message,
          read: false,
          createdAt: serverTimestamp()
        }),
        12000,
        "Message could not be sent in time. Check your connection or try again."
      );

      await recordDailyMessageSend(email);

      form.reset();
      feedback?.showContactFeedback(
        "success",
        "Message sent",
        "Thanks for reaching out. We will get back to you soon."
      );
    } catch (error) {
      const err = error as Error;
      feedback?.showContactFeedback(
        "error",
        "Could not send",
        err?.message ? String(err.message) : "Something went wrong. Please try again in a moment."
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("is-sending");
      submitBtn.removeAttribute("aria-busy");
    }
  });
}

onDocumentReady(() => {
  includeHTML("header", "header.html", initHeader);
  includeHTML("footer", "footer.html", attachNewsletterForm);
  attachContactHandler();
});
