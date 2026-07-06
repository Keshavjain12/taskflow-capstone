// Must be imported first, before any other module (including ./app), so
// Sentry can patch Node's core modules before other libraries wrap them.
// See: https://docs.sentry.io/platforms/javascript/guides/express/
import { initSentry } from "./config/sentry";

initSentry();
