import {
  collection,
  query,
  limit,
  getDocsFromServer,
  doc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  db,
  auth,
  CONTACT_COLLECTION,
  NEWSLETTER_COLLECTION,
  firestoreWithTimeout,
  ensureAuthReady
} from "../Script/firebase-client.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

interface FirestoreTimestamp {
  toMillis?: () => number;
  toDate?: () => Date;
}

interface ContactMessage {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  message?: string;
  read?: boolean;
  createdAt?: FirestoreTimestamp;
}

interface NewsletterSubscriber {
  id: string;
  email?: string;
  subscribedAt?: FirestoreTimestamp;
}

/** Remove credentials if the form submitted before JS loaded (cleanUrls + relative script path). */
function stripCredentialQueryParams(): void {
  if (!location.search) return;
  const params = new URLSearchParams(location.search);
  if (!params.has("email") && !params.has("password")) return;
  history.replaceState(null, "", location.pathname + location.hash);
}

stripCredentialQueryParams();

const loginPanel = document.getElementById("loginPanel")!;
const appPanel = document.getElementById("appPanel")!;
const adminHero = document.getElementById("adminHero");
const heroDesc = document.getElementById("heroDesc");
const loginForm = document.getElementById("loginForm") as HTMLFormElement;
const loginError = document.getElementById("loginError")!;
const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;
const signedInEmail = document.getElementById("signedInEmail")!;
const listError = document.getElementById("listError")!;
const listLoading = document.getElementById("listLoading")!;
const msgList = document.getElementById("msgList")!;
const msgEmpty = document.getElementById("msgEmpty")!;
const msgNoResults = document.getElementById("msgNoResults")!;
const refreshBtn = document.getElementById("refreshBtn") as HTMLButtonElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const statTotal = document.getElementById("statTotal")!;
const statUnread = document.getElementById("statUnread")!;
const statLatest = document.getElementById("statLatest")!;
const footUpdated = document.getElementById("footUpdated")!;
const newsletterList = document.getElementById("newsletterList")!;
const newsletterLoading = document.getElementById("newsletterLoading")!;
const newsletterEmpty = document.getElementById("newsletterEmpty")!;
const newsletterError = document.getElementById("newsletterError")!;
const newsletterCount = document.getElementById("newsletterCount");
const newsletterSearchInput = document.getElementById("newsletterSearchInput") as HTMLInputElement;
const newsletterNoResults = document.getElementById("newsletterNoResults")!;
const messagesView = document.getElementById("messagesView")!;
const newsletterView = document.getElementById("newsletterView")!;
const messagesStats = document.getElementById("messagesStats")!;
const newsletterStats = document.getElementById("newsletterStats")!;
const tabMessages = document.getElementById("tabMessages")!;
const tabNewsletter = document.getElementById("tabNewsletter")!;
const statSubscribers = document.getElementById("statSubscribers");
const statSubLatest = document.getElementById("statSubLatest");
const deleteOverlay = document.getElementById("deleteOverlay")!;
const deleteOverlayText = document.getElementById("deleteOverlayText")!;
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn") as HTMLButtonElement;

let loadRequestId = 0;
let activeAuthUid: string | null = null;
let allMessages: ContactMessage[] = [];
let allSubscribers: NewsletterSubscriber[] = [];
let pendingDeleteId: string | null = null;
let pendingDeleteName = "";
let activeAdminView: "messages" | "newsletter" = "messages";

function setAdminView(view: "messages" | "newsletter"): void {
  activeAdminView = view;
  const isMessages = view === "messages";
  tabMessages.classList.toggle("is-active", isMessages);
  tabNewsletter.classList.toggle("is-active", !isMessages);
  tabMessages.setAttribute("aria-selected", String(isMessages));
  tabNewsletter.setAttribute("aria-selected", String(!isMessages));
  messagesView.classList.toggle("d-none", !isMessages);
  newsletterView.classList.toggle("d-none", isMessages);
  messagesStats.classList.toggle("d-none", !isMessages);
  newsletterStats.classList.toggle("d-none", isMessages);
}

document.querySelectorAll<HTMLButtonElement>(".admin-view-tab").forEach((btn) => {
  btn.addEventListener("click", () => setAdminView(btn.dataset.view as "messages" | "newsletter"));
});

function showLoginError(msg: string): void {
  loginError.textContent = msg;
  loginError.classList.remove("d-none");
}

function hideLoginError(): void {
  loginError.classList.add("d-none");
}

function showListError(msg: string): void {
  listError.textContent = msg;
  listError.classList.remove("d-none");
}

function hideListError(): void {
  listError.classList.add("d-none");
}

function sortMessagesNewestFirst(messages: ContactMessage[]): ContactMessage[] {
  return messages.slice().sort((a, b) => {
    const da = a.createdAt?.toMillis?.() ?? 0;
    const db = b.createdAt?.toMillis?.() ?? 0;
    return db - da;
  });
}

function isUnread(msg: ContactMessage): boolean {
  return msg.read !== true;
}

function messageSearchText(msg: ContactMessage): string {
  return [msg.firstName, msg.lastName, msg.email, msg.phone, msg.message]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function formatTime(ts?: FirestoreTimestamp): string {
  try {
    if (ts?.toDate) {
      return ts.toDate().toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      });
    }
  } catch {
    /* ignore */
  }
  return "-";
}

function formatRelative(ts?: FirestoreTimestamp): string {
  try {
    if (ts?.toDate) {
      const date = ts.toDate();
      const diff = Date.now() - date.getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "Just now";
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      if (days < 7) return `${days}d ago`;
    }
  } catch {
    /* ignore */
  }
  return formatTime(ts);
}

function escapeHtml(s: unknown): string {
  const div = document.createElement("div");
  div.textContent = s == null ? "" : String(s);
  return div.innerHTML;
}

function getInitials(name: string): string {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function updateStats(): void {
  statTotal.textContent = String(allMessages.length);
  statUnread.textContent = String(allMessages.filter(isUnread).length);
  const newest = allMessages[0];
  statLatest.textContent = newest ? formatRelative(newest.createdAt) : "-";
}

function sortSubscribersNewestFirst(rows: NewsletterSubscriber[]): NewsletterSubscriber[] {
  return rows.slice().sort((a, b) => {
    const da = a.subscribedAt?.toMillis?.() ?? 0;
    const db = b.subscribedAt?.toMillis?.() ?? 0;
    return db - da;
  });
}

function updateNewsletterStats(): void {
  if (statSubscribers) statSubscribers.textContent = String(allSubscribers.length);
  const newest = allSubscribers[0];
  if (statSubLatest) {
    statSubLatest.textContent =
      newest?.subscribedAt ? formatRelative(newest.subscribedAt) : "-";
  }
  if (newsletterCount) newsletterCount.textContent = String(allSubscribers.length);
}

function renderNewsletterList(subscribers: NewsletterSubscriber[]): void {
  newsletterLoading.classList.add("d-none");
  newsletterList.innerHTML = "";
  newsletterError.classList.add("d-none");
  newsletterNoResults.classList.add("d-none");

  if (!allSubscribers.length) {
    newsletterList.classList.add("d-none");
    newsletterEmpty.classList.remove("d-none");
    return;
  }

  newsletterEmpty.classList.add("d-none");

  if (!subscribers.length) {
    newsletterList.classList.add("d-none");
    newsletterNoResults.classList.remove("d-none");
    return;
  }

  newsletterList.classList.remove("d-none");

  for (const sub of subscribers) {
    const email = sub.email != null ? String(sub.email) : "-";
    const when = sub.subscribedAt ? formatTime(sub.subscribedAt) : "-";
    const li = document.createElement("li");
    li.className = "admin-subscriber";
    li.innerHTML = `
      <a class="admin-subscriber__email" href="mailto:${escapeHtml(email)}">
        <i class="fas fa-envelope"></i>${escapeHtml(email)}
      </a>
      <span class="admin-subscriber__date">${escapeHtml(when)}</span>
    `;
    newsletterList.appendChild(li);
  }
}

function applyNewsletterSearch(): void {
  const q = (newsletterSearchInput.value || "").trim().toLowerCase();
  if (!q) {
    renderNewsletterList(allSubscribers);
    return;
  }
  const filtered = allSubscribers.filter((sub) =>
    String(sub.email || "").toLowerCase().includes(q)
  );
  renderNewsletterList(filtered);
}

async function loadNewsletter(): Promise<void> {
  newsletterLoading.classList.remove("d-none");
  newsletterList.classList.add("d-none");
  newsletterEmpty.classList.add("d-none");
  newsletterError.classList.add("d-none");

  try {
    await ensureAuthReady();
    const q = query(collection(db, NEWSLETTER_COLLECTION), limit(500));
    const snap = await firestoreWithTimeout(
      getDocsFromServer(q),
      12000,
      "Could not load newsletter subscribers."
    );
    allSubscribers = sortSubscribersNewestFirst(
      snap.docs.map((d: { id: string; data: () => Record<string, unknown> }) => ({
        id: d.id,
        ...d.data()
      })) as NewsletterSubscriber[]
    );
    updateNewsletterStats();
    applyNewsletterSearch();
  } catch (err) {
    const error = err as Error;
    newsletterLoading.classList.add("d-none");
    newsletterList.classList.add("d-none");
    newsletterEmpty.classList.add("d-none");
    newsletterError.textContent = error.message || "Could not load subscribers.";
    newsletterError.classList.remove("d-none");
    if (newsletterCount) newsletterCount.textContent = "-";
  }
}

async function loadDashboard(): Promise<void> {
  await Promise.all([loadMessages(true), loadNewsletter()]);
}

function renderMessages(messages: ContactMessage[]): void {
  listLoading.classList.add("d-none");
  msgList.innerHTML = "";
  msgNoResults.classList.add("d-none");

  if (!allMessages.length) {
    msgList.classList.add("d-none");
    msgEmpty.classList.remove("d-none");
    updateStats();
    return;
  }

  msgEmpty.classList.add("d-none");

  if (!messages.length) {
    msgList.classList.add("d-none");
    msgNoResults.classList.remove("d-none");
    updateStats();
    return;
  }

  msgList.classList.remove("d-none");

  for (const msg of messages) {
    const name = [msg.firstName, msg.lastName].filter(Boolean).join(" ").trim() || "Unknown sender";
    const email = msg.email != null ? String(msg.email) : "";
    const phone = msg.phone != null ? String(msg.phone) : "";
    const message = msg.message != null ? String(msg.message) : "";
    const when = formatTime(msg.createdAt);
    const relative = formatRelative(msg.createdAt);
    const unread = isUnread(msg);

    const el = document.createElement("article");
    el.className = "admin-msg" + (unread ? " admin-msg--unread" : "");
    el.dataset.id = msg.id;
    el.innerHTML = `
      <div class="admin-msg__head">
        <div class="admin-msg__avatar" aria-hidden="true">${escapeHtml(getInitials(name))}</div>
        <div class="admin-msg__who">
          <h3 class="admin-msg__name">${escapeHtml(name)}</h3>
          <p class="admin-msg__time mb-0">
            <span>${escapeHtml(relative)}</span> · ${escapeHtml(when)}
          </p>
        </div>
        <div class="admin-msg__actions">
          <button type="button"
            class="admin-msg-action admin-msg-action--read${unread ? "" : " is-read"}"
            data-action="read"
            data-id="${escapeHtml(msg.id)}"
            title="${unread ? "Mark as read" : "Read"}"
            aria-label="${unread ? "Mark as read" : "Message read"}"
            ${unread ? "" : "disabled"}>
            <i class="fas ${unread ? "fa-envelope-open" : "fa-check-double"}"></i>
          </button>
          <button type="button"
            class="admin-msg-action admin-msg-action--delete"
            data-action="delete"
            data-id="${escapeHtml(msg.id)}"
            title="Delete message"
            aria-label="Delete message">
            <i class="fas fa-trash-can"></i>
          </button>
        </div>
      </div>
      <div class="admin-msg__chips">
        ${email ? `<a class="admin-chip" href="mailto:${escapeHtml(email)}"><i class="fas fa-envelope"></i>${escapeHtml(email)}</a>` : ""}
        ${phone ? `<a class="admin-chip" href="tel:${escapeHtml(phone.replace(/\s/g, ""))}"><i class="fas fa-phone"></i>${escapeHtml(phone)}</a>` : ""}
      </div>
      <blockquote class="admin-msg__body${unread ? "" : " admin-msg__body--read"}">${escapeHtml(message)}</blockquote>
    `;
    msgList.appendChild(el);
  }

  updateStats();
}

function applySearch(): void {
  const q = (searchInput.value || "").trim().toLowerCase();
  if (!q) {
    renderMessages(allMessages);
    return;
  }
  const filtered = allMessages.filter((msg) => messageSearchText(msg).includes(q));
  renderMessages(filtered);
}

function showDeleteOverlay(id: string): void {
  const msg = allMessages.find((m) => m.id === id);
  const name = msg
    ? [msg.firstName, msg.lastName].filter(Boolean).join(" ").trim() || "this sender"
    : "this sender";
  pendingDeleteId = id;
  pendingDeleteName = name;
  deleteOverlayText.textContent = `Delete the message from ${name}? This cannot be undone.`;
  deleteOverlay.removeAttribute("hidden");
  requestAnimationFrame(() => deleteOverlay.classList.add("is-visible"));
  confirmDeleteBtn.focus();
}

function hideDeleteOverlay(): void {
  deleteOverlay.classList.remove("is-visible");
  setTimeout(() => {
    deleteOverlay.setAttribute("hidden", "");
    pendingDeleteId = null;
    pendingDeleteName = "";
  }, 280);
}

async function markMessageRead(id: string): Promise<void> {
  const btn = msgList.querySelector<HTMLButtonElement>(`[data-action="read"][data-id="${CSS.escape(id)}"]`);
  if (btn) btn.disabled = true;
  try {
    await ensureAuthReady();
    await firestoreWithTimeout(
      updateDoc(doc(db, CONTACT_COLLECTION, id), { read: true }),
      10000,
      "Could not mark as read."
    );
    allMessages = allMessages.map((m) => (m.id === id ? { ...m, read: true } : m));
    applySearch();
  } catch (err) {
    const error = err as Error;
    showListError(error.message || "Could not mark message as read.");
    if (btn) btn.disabled = false;
  }
}

async function deleteMessage(id: string): Promise<void> {
  confirmDeleteBtn.disabled = true;
  try {
    await ensureAuthReady();
    await firestoreWithTimeout(
      deleteDoc(doc(db, CONTACT_COLLECTION, id)),
      10000,
      "Could not delete message."
    );
    allMessages = allMessages.filter((m) => m.id !== id);
    hideDeleteOverlay();
    applySearch();
  } catch (err) {
    const error = err as Error;
    showListError(error.message || "Could not delete message.");
  } finally {
    confirmDeleteBtn.disabled = false;
  }
}

msgList.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const btn = target.closest<HTMLButtonElement>("[data-action]");
  if (!btn || btn.disabled) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (!id) return;
  if (action === "read") {
    markMessageRead(id);
  } else if (action === "delete") {
    showDeleteOverlay(id);
  }
});

deleteOverlay.querySelectorAll("[data-dismiss-delete]").forEach((el) => {
  el.addEventListener("click", hideDeleteOverlay);
});

confirmDeleteBtn.addEventListener("click", () => {
  if (pendingDeleteId) deleteMessage(pendingDeleteId);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !deleteOverlay.hasAttribute("hidden")) {
    hideDeleteOverlay();
  }
});

async function loadMessages(force = false): Promise<void> {
  const reqId = ++loadRequestId;
  hideListError();
  listLoading.classList.remove("d-none");
  msgList.classList.add("d-none");
  msgEmpty.classList.add("d-none");
  msgNoResults.classList.add("d-none");
  refreshBtn.disabled = true;

  const slowHint = setTimeout(() => {
    if (reqId === loadRequestId) {
      const loadingLabel = listLoading.querySelector("span");
      if (loadingLabel) loadingLabel.textContent = "Still connecting to Firestore…";
    }
  }, 4000);

  try {
    const user = await ensureAuthReady();
    if (reqId !== loadRequestId) return;

    signedInEmail.textContent = user.email || "Admin";

    const q = query(collection(db, CONTACT_COLLECTION), limit(300));
    const snap = await firestoreWithTimeout(
      getDocsFromServer(q),
      12000,
      "Could not reach Firestore in time. Confirm Firestore is enabled for project “cosname”, rules are published, and you are signed in as cosnametech@gmail.com."
    );
    if (reqId !== loadRequestId) return;

    allMessages = sortMessagesNewestFirst(
      snap.docs.map((d: { id: string; data: () => Record<string, unknown> }) => ({
        id: d.id,
        ...d.data()
      })) as ContactMessage[]
    );
    footUpdated.textContent =
      "Updated " +
      new Date().toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit"
      });
    applySearch();
  } catch (err) {
    if (reqId !== loadRequestId) return;
    listLoading.classList.add("d-none");
    msgList.classList.add("d-none");
    msgEmpty.classList.add("d-none");
    msgNoResults.classList.add("d-none");
    const error = err as { message?: string; code?: string };
    const code = error?.code ?? "";
    let hint = error.message || "Could not load messages.";
    if (code === "permission-denied") {
      const email = auth.currentUser?.email ?? "unknown";
      hint = `Permission denied for ${email}. Firestore rules must allow cosnametech@gmail.com and be published in the cosname project.`;
    }
    showListError(hint);
  } finally {
    clearTimeout(slowHint);
    if (reqId === loadRequestId) {
      refreshBtn.disabled = false;
      const loadingLabel = listLoading.querySelector("span");
      if (loadingLabel) loadingLabel.textContent = "Loading messages…";
    }
  }
}

searchInput.addEventListener("input", applySearch);
newsletterSearchInput.addEventListener("input", applyNewsletterSearch);
refreshBtn.addEventListener("click", () => loadDashboard());

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideLoginError();
  const email = (document.getElementById("adminEmail") as HTMLInputElement).value.trim();
  const password = (document.getElementById("adminPassword") as HTMLInputElement).value;
  loginBtn.disabled = true;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    const error = err as { code?: string; message?: string };
    const map: Record<string, string> = {
      "auth/invalid-credential": "Invalid email or password.",
      "auth/invalid-email": "Invalid email address.",
      "auth/user-disabled": "This account is disabled.",
      "auth/too-many-requests": "Too many attempts. Try again later."
    };
    showLoginError(map[error.code ?? ""] || error.message || "Sign-in failed.");
  } finally {
    loginBtn.disabled = false;
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginPanel.classList.add("d-none");
    appPanel.classList.remove("d-none");
    adminHero?.classList.add("d-none");
    signedInEmail.textContent = user.email || "Admin";

    if (user.uid !== activeAuthUid) {
      activeAuthUid = user.uid;
      setAdminView("messages");
      loadDashboard();
    }
  } else {
    activeAuthUid = null;
    loadRequestId++;
    appPanel.classList.add("d-none");
    loginPanel.classList.remove("d-none");
    adminHero?.classList.remove("d-none");
    if (heroDesc) {
      heroDesc.textContent = "Sign in to view submissions from your website contact form.";
    }
    allMessages = [];
    allSubscribers = [];
    setAdminView("messages");
    searchInput.value = "";
    newsletterSearchInput.value = "";
    listLoading.classList.remove("d-none");
    msgList.classList.add("d-none");
    msgEmpty.classList.add("d-none");
    msgNoResults.classList.add("d-none");
    newsletterList.classList.add("d-none");
    newsletterEmpty.classList.add("d-none");
    newsletterLoading.classList.add("d-none");
    newsletterError.classList.add("d-none");
    hideListError();
  }
});
