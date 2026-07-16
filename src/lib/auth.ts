// Lightweight client-side auth for the GalaxyAI demo.
// Only the user "kamogelo" is provisioned for this workspace.

export const ALLOWED_USERNAME = "kamogelo";
export const ALLOWED_EMAIL = "kamogelo@galaxyai.app";

type StoredUser = { username: string; email: string; passwordHash: string };

const USER_KEY = "galaxyai:auth:user:v2";
const SESSION_KEY = "galaxyai:auth:session:v2";
const EVENT = "galaxyai:auth";

async function hash(pw: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function hasAccount(): boolean {
  return !!readUser();
}

export function getSessionUsername(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  return !!getSessionUsername();
}

function emit() {
  window.dispatchEvent(new Event(EVENT));
}

export function onAuthChange(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  if (!EMAIL_RE.test(email.trim())) return "Please enter a valid email address.";
  return null;
}

/**
 * Password must be at least 12 characters and contain
 * letters, numbers, AND special characters.
 */
export function validatePassword(pw: string): string | null {
  if (pw.length < 12) return "Password must be at least 12 characters long.";
  if (!/[A-Za-z]/.test(pw)) return "Password must include at least one letter.";
  if (!/[0-9]/.test(pw)) return "Password must include at least one number.";
  if (!/[^A-Za-z0-9]/.test(pw))
    return "Password must include at least one special character (e.g. !@#$%).";
  return null;
}

export async function signUp(email: string, password: string): Promise<void> {
  const emailErr = validateEmail(email);
  if (emailErr) throw new Error(emailErr);
  if (email.trim().toLowerCase() !== ALLOWED_EMAIL) {
    throw new Error(`Only ${ALLOWED_EMAIL} is authorized for this workspace.`);
  }
  const pwErr = validatePassword(password);
  if (pwErr) throw new Error(pwErr);
  if (readUser()) throw new Error("An account already exists. Please sign in instead.");
  const user: StoredUser = {
    username: ALLOWED_USERNAME,
    email: ALLOWED_EMAIL,
    passwordHash: await hash(password),
  };
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.localStorage.setItem(SESSION_KEY, user.username);
  emit();
}

export async function signIn(email: string, password: string): Promise<void> {
  const user = readUser();
  if (!user) throw new Error("No account found. Please sign up first.");
  if (email.trim().toLowerCase() !== user.email) {
    throw new Error("Invalid email or password.");
  }
  const h = await hash(password);
  if (h !== user.passwordHash) throw new Error("Invalid email or password.");
  window.localStorage.setItem(SESSION_KEY, user.username);
  emit();
}

export function signOut(): void {
  window.localStorage.removeItem(SESSION_KEY);
  emit();
}
