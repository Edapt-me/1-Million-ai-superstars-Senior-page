// Google Analytics 4 (GA4) Integration Utility
// Stateless, asynchronous, and production-ready.

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let isInitialized = false;
let lastTrackedPath = "";

/**
 * Dynamically loads the GA4 gtag.js script on the client side.
 */
export function initGA(): void {
  if (typeof window === "undefined" || !GA_ID || isInitialized) {
    return;
  }

  try {
    // Initialize dataLayer and global gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", GA_ID, {
      send_page_view: false, // Pageviews handled manually for SPA route changes
      anonymize_ip: true,
    });

    // Script injection is now handled directly in __root.tsx's <head>
    // to ensure Google's site verifier detects it reliably.

    isInitialized = true;
  } catch (error) {
    // Fail silently in production
  }
}

/**
 * Tracks SPA page views on TanStack Router location updates.
 */
export function trackPageView(path: string): void {
  if (typeof window === "undefined" || !GA_ID) {
    return;
  }

  // Prevent duplicate page view tracking for identical paths
  if (lastTrackedPath === path) {
    return;
  }

  try {
    if (!isInitialized) {
      initGA();
    }

    lastTrackedPath = path;

    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: path,
        page_location: window.location.origin + path,
        page_title: document.title,
      });
    }

    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  } catch (error) {
    // Fail silently
  }
}

/**
 * Tracks custom events (e.g. CTA clicks, registration attempts, project views).
 */
export function trackEvent(
  action: string,
  params?: Record<string, any>
): void {
  if (typeof window === "undefined" || !GA_ID) {
    return;
  }

  try {
    if (!isInitialized) {
      initGA();
    }

    if (typeof window.gtag === "function") {
      window.gtag("event", action, params);
    }

    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", action, params);
    }
  } catch (error) {
    // Fail silently
  }
}
