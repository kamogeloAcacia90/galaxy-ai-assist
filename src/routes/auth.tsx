import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Orbit, LogIn, UserPlus, Loader2 } from "lucide-react";
import {
  ALLOWED_USERNAME,
  hasAccount,
  isAuthenticated,
  signIn,
  signUp,
} from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in — GalaxyAI" },
      { name: "description", content: "Sign in to your GalaxyAI workspace." },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [username, setUsername] = useState(ALLOWED_USERNAME);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMode(hasAccount() ? "signin" : "signup");
    if (isAuthenticated()) navigate({ to: "/" });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        await signUp(username, password);
        toast.success("Account created — welcome to GalaxyAI!");
      } else {
        await signIn(username, password);
        toast.success("Signed in");
      }
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
      <div className="glass w-full rounded-2xl border border-border/40 p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="relative">
            <Orbit className="h-8 w-8 text-primary animate-float" />
            <span className="absolute inset-0 -z-10 rounded-full blur-lg bg-primary/60" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-galaxy">GalaxyAI</h1>
            <p className="text-xs text-muted-foreground">
              {mode === "signup" ? "Create your workspace account" : "Welcome back, astronaut"}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
              placeholder={ALLOWED_USERNAME}
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              This workspace is provisioned for <span className="font-mono">{ALLOWED_USERNAME}</span>.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="w-full rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
              placeholder="••••••••"
              minLength={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="click-glow inline-flex w-full items-center justify-center gap-2 rounded-lg bg-galaxy px-4 py-2.5 text-sm font-semibold text-primary-foreground glow disabled:opacity-70"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "signup" ? (
              <UserPlus className="h-4 w-4" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                className="text-primary hover:underline"
                onClick={() => setMode("signin")}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Need to set a password?{" "}
              <button
                className="text-primary hover:underline"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
