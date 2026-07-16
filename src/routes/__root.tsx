import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { isAuthenticated, onAuthChange } from "../lib/auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-galaxy">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the galaxy</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for drifted out of orbit.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-galaxy px-5 py-2.5 text-sm font-medium text-primary-foreground glow transition-transform hover:scale-105"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass max-w-md rounded-2xl p-8 text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-lg bg-galaxy px-4 py-2 text-sm font-medium text-primary-foreground glow"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-lg border border-border bg-secondary/40 px-4 py-2 text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GalaxyAI — Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A futuristic AI productivity suite: write emails, summarize meetings, and plan your day.",
      },
      { property: "og:title", content: "GalaxyAI — Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "A futuristic AI productivity suite: write emails, summarize meetings, and plan your day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "GalaxyAI — Workplace Productivity Assistant" },
      { name: "twitter:description", content: "A futuristic AI productivity suite: write emails, summarize meetings, and plan your day." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/683ec5ee-8536-4ba9-b175-eee140d9236a" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/683ec5ee-8536-4ba9-b175-eee140d9236a" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen">
        <div className="pointer-events-none fixed inset-0 -z-20 starfield opacity-70" />
        <div className="pointer-events-none fixed inset-0 -z-10 nebula-glow" />
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex min-h-screen flex-1 flex-col">
              <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/40 bg-background/60 px-4 backdrop-blur-xl">
                <SidebarTrigger className="click-glow" />
                <span className="font-display text-sm font-semibold text-galaxy">
                  Workplace Productivity Assistant
                </span>
              </header>
              <main className="flex-1 px-4 py-8 sm:px-8">
                <div className="mx-auto max-w-6xl">
                  <Outlet />
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster theme="dark" position="bottom-right" />
      </div>
    </QueryClientProvider>
  );
}
