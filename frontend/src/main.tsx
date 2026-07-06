import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
import App from "./App";
import { queryClient } from "./lib/queryClient";
import "./index.css";

// Opt-in: only activates when VITE_SENTRY_DSN is set at build time, so the
// app behaves identically in environments (like local dev) where it isn't
// configured.
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    // Passing a plain array here would REPLACE Sentry's default integrations
    // entirely — including the one that actually catches uncaught errors
    // and unhandled promise rejections. The function form appends to the
    // defaults instead of overwriting them.
    integrations: (defaultIntegrations) => [
      ...defaultIntegrations,
      Sentry.browserTracingIntegration(),
    ],
    tracesSampleRate: 0.2,
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
