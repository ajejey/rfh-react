// Thin PostHog wrapper. No-ops if PostHog isn't loaded (env var missing).
// PostHog is loaded via CDN snippet in public/index.html, gated by REACT_APP_POSTHOG_KEY.

export const track = (event, properties) => {
  try {
    if (typeof window !== 'undefined' && window.posthog && window.posthog.capture) {
      window.posthog.capture(event, properties || {});
    }
  } catch (_) { /* swallow */ }
};

export const identify = (distinctId, properties) => {
  try {
    if (typeof window !== 'undefined' && window.posthog && window.posthog.identify) {
      window.posthog.identify(distinctId, properties || {});
    }
  } catch (_) { /* swallow */ }
};
