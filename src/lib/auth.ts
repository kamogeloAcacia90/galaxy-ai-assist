// Lightweight client-side auth for the GalaxyAI demo.
// Only the username "kamogelo" is allowed to register / sign in.

export const ALLOWED_USERNAME = "kamogelo";

type StoredUser = { username: string; passwordHash: string };

const USER_KEY = "galaxyai:auth:user:v1";
const SESSION_KEY = "galaxyai:auth:session:v1";
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

export async function signUp(username: string, password: string): Promise<void> {
  if (username.trim().toLowerCase() !== ALLOWED_USERNAME) {
    throw new Error(`Only the username "${ALLOWED_USERNAME}" is authorized for this workspace.`);
  }
  if (password.length < 4) throw new Error("Password must be at least 4 characters.");
  if (readUser()) throw new Error("An account already exists. Please sign in instead.");
  const user: StoredUser = { username: ALLOWED_USERNAME, passwordHash: await hash(password) };
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.localStorage.setItem(SESSION_KEY, user.username);
  emit();
}

export async function signIn(username: string, password: string): Promise<void> {
  const user = readUser();
  if (!user) throw new Error("No account found. Please sign up first.");
  if (username.trim().toLowerCase() !== user.username) {
    throw new Error("Invalid username or password.");
  }
  const h = await hash(password);
  if (h !== user.passwordHash) throw new Error("Invalid username or password.");
  window.localStorage.setItem(SESSION_KEY, user.username);
  emit();
}

export function signOut(): void {
  window.localStorage.removeItem(SESSION_KEY);
  emit();
}
