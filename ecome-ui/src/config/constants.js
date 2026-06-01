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

// Time before session expiration when a warning should be shown (1 minute)
export const WARNING_BEFORE = 58 * 60 * 1000; // 59 minutes

//
// ─────────────────────────────────────────────
//   LOCALCACHE MANAGEMENT
// ─────────────────────────────────────────────
//

export const DEFAULT_SHORT_MAX_AGE = 1000 * 60 * 5; // 5 minutes
export const DEFAULT_LONG_MAX_AGE = 1000 * 60 * 60 * 24 * 2; // Two days
export const LOCAL_CART_KEY = "local_cart";
export const LOCAL_AUTH_KEY = "auth";

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

//
// ─────────────────────────────────────────────
//   DUMMY DATA - SHIPPING & TAX
// ─────────────────────────────────────────────
//

// Minimum order value for free shipping
export const FREE_SHIPPING_THRESHOLD = 100;

// Shipping cost tiers
export const SHIPPING_COST_BASE = 4.99; // Orders under $50
export const SHIPPING_COST_REDUCED = 2.99; // Orders $50–$99.99
export const SHIPPING_COST_FREE = 0; // Orders >= FREE_SHIPPING_THRESHOLD

// VAT / Sales tax rate (25%)
export const TAX_RATE = 0.25;

// Estimated delivery window (in days)
export const DELIVERY_MIN_DAYS = 2;
export const DELIVERY_MAX_DAYS = 5;
