//
// ─────────────────────────────────────────────
//   IMAGES & UI DEFAULTS
// ─────────────────────────────────────────────
//

// Default placeholder image used when no product image is available
export const IMAGE_PLACEHOLDER = "/images/placeholder.png";

// Default number of items per paginated request
export const DEFAULT_PAGE_SIZE = 20;

//
// ─────────────────────────────────────────────
//   SESSION MANAGEMENT
// ─────────────────────────────────────────────
//

// Total session duration before automatic logout (30 minutes)
export const SESSION_DURATION = 30 * 60 * 1000;

// Time before session expiration when a warning should be shown (1 minute)
export const WARNING_BEFORE = 1 * 60 * 1000;

//
// ─────────────────────────────────────────────
//   HEALTHCHECK & BACKEND MONITORING
// ─────────────────────────────────────────────
//

// Maximum time allowed for a healthcheck request before timing out
export const HEALTHCHECK_TIMEOUT = 3000;

// Initial delay for exponential backoff when backend is offline
export const HEALTHCHECK_BACKOFF_START = 1000;

// Maximum delay allowed for exponential backoff
export const HEALTHCHECK_BACKOFF_MAX = 30000;

// Time offline before switching into offline-mode
export const OFFLINE_MODE_THRESHOLD = 5000;

//
// ─────────────────────────────────────────────
//   UI MESSAGES & BADGES
// ─────────────────────────────────────────────
//

// Duration for toast messages
export const MESSAGE_DURATION = 8000;

// Duration for the "Backend restored" badge
export const BACKEND_RESTORED_DURATION = 3000;
