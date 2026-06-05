import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

export const CONTACT_COLLECTION = "contact_messages";
export const NEWSLETTER_COLLECTION = "newsletter_subscribers";
export const RATE_LIMIT_COLLECTION = "contact_rate_limits";
export const DAILY_MESSAGE_LIMIT = 2;

/** Firestore doc id from email (safe for document paths). */
export function emailToRateLimitKey(email: string): string {
  return (
    String(email || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "_")
      .slice(0, 120) || "unknown"
  );
}

/** Local calendar day YYYY-MM-DD for daily rate limits. */
export function localDayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function firestoreWithTimeout<T>(
  promise: Promise<T>,
  ms = 12000,
  message?: string
): Promise<T> {
  const text =
    message ||
    "Request timed out. Check your connection and that Firestore is enabled in the cosname Firebase project.";
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(text)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/** Ensure Firestore has a fresh auth token before protected reads/writes. */
export async function ensureAuthReady(): Promise<{ email: string | null; uid: string; getIdToken: (force?: boolean) => Promise<string> }> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in.");
  await user.getIdToken(true);
  return user;
}
