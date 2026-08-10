import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { programConfig } from "@/lib/programConfig";
import { getWebsiteSettings } from "@/lib/cms";
import { trackPageView, trackEvent, initGA } from "@/lib/analytics";
import { BatchSelectionProvider, useBatchSelection } from "@/contexts/BatchSelectionContext";
import { BatchSelectionModal } from "@/components/shared/BatchSelectionModal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
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
      { title: "1 Million AI Superstars | Learn AI in Simple Malayalam" },
      {
        name: "description",
        content:
          "Live AI training in Malayalam for students, professionals, teachers, homemakers and business owners. 10 live classes, 15+ AI tools, certificate & 1-year recording access.",
      },
      { name: "author", content: "1 Million AI Superstars" },
      { property: "og:title", content: "1 Million AI Superstars | Learn AI in Simple Malayalam" },
      {
        property: "og:description",
        content:
          "Live AI training in Malayalam. 10 live sessions, 15+ practical AI tools, certificate & 1-year recording access.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Noto+Sans+Malayalam:wght@400;500;600;700;800&display=swap",
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
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1673306513692575');
fbq('track', 'PageView');
`
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1673306513692575&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className="relative w-full overflow-x-hidden bg-background font-sans text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function FloatingCTA() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { openModal } = useBatchSelection();

  // Do not show on the Contact page
  if (pathname === "/contact" || pathname === "/contact/") return null;

  return (
    <button
      type="button"
      onClick={() => {
        trackEvent("register_click", { location: "floating_cta" });
        openModal();
      }}
      className="sticky-cta-float fixed left-1/2 z-50 inline-flex items-center justify-center rounded-full gradient-bg px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(31,10,119,0.55)] backdrop-blur-sm md:hidden transition-transform active:scale-95"
      style={{
        bottom: "calc(20px + env(safe-area-inset-bottom))",
        width: "25vw",
        minWidth: "140px",
        maxWidth: "220px",
        transform: "translateX(-50%)",
      }}
    >
      Register
    </button>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    initGA();
    trackPageView(pathname);
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <BatchSelectionProvider>
        <SiteHeader />
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <SiteFooter />
        <FloatingCTA />
        <BatchSelectionModal />

        <a
          href={programConfig.contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          onClick={() => trackEvent("whatsapp_click", { location: pathname })}
          className="fixed z-[60] grid h-14 w-14 place-items-center rounded-full text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] transition-transform hover:scale-105 md:h-[60px] md:w-[60px]"
          style={{
            backgroundColor: "#25D366",
            right: "24px",
            bottom: "calc(24px + env(safe-area-inset-bottom))",
          }}
        >
          <svg viewBox="0 0 32 32" className="h-7 w-7 md:h-8 md:w-8" fill="currentColor" aria-hidden>
            <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.874 2.708.874.847 0 2.393-.66 2.694-1.475.13-.34.229-.72.229-1.088 0-.42-1.7-.777-1.9-1.462zm-2.973 7.593c-1.834 0-3.626-.5-5.188-1.448L5.55 25l1.687-4.99a9.895 9.895 0 0 1-1.833-5.79c0-5.545 4.583-10.06 10.203-10.06 5.62 0 10.203 4.515 10.203 10.06s-4.582 10.06-10.203 10.06zm0-22.087C9.263 2.71 3.68 8.192 3.68 15c0 2.334.652 4.51 1.79 6.377L3 30l8.83-2.813a12.417 12.417 0 0 0 4.305.795c6.874 0 12.457-5.482 12.457-12.29S23 2.71 16.137 2.71z" />
          </svg>
        </a>
      </BatchSelectionProvider>
    </QueryClientProvider>
  );
}
