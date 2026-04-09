import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  
  // Only enable in production
  enabled: process.env.NODE_ENV === "production" && !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring — sample 10% of transactions
  tracesSampleRate: 0.1,

  // Session replay — capture 1% of sessions, 100% on error
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,

  // Filter out noise
  ignoreErrors: [
    "ResizeObserver loop",
    "Non-Error promise rejection",
    "Load failed",
    "Failed to fetch",
    "NetworkError",
    "AbortError",
  ],

  // Don't send PII
  beforeSend(event) {
    // Strip user emails from error reports
    if (event.user) {
      delete event.user.email;
    }
    return event;
  },
});
