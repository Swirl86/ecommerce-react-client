import React from "react";
import { vi } from "vitest";

/* ---------------------------------------------------------
 * API_BASE_URL mock factory
 * ---------------------------------------------------------
 * Allows tests to override API_BASE_URL dynamically.
 * Returns both a setter and a moduleMock that can be used
 * inside vi.mock("@config/api", ...).
 *
 * Example:
 *   const apiBase = createMockApiBaseUrl();
 *   vi.mock("@config/api", () => apiBase.moduleMock);
 *   apiBase.set("http://new-url");
 * --------------------------------------------------------- */
export function createMockApiBaseUrl(initial = "http://mock-api") {
    let value = initial;

    return {
        set: (v) => (value = v),
        get: () => value,
        moduleMock: {
            get API_BASE_URL() {
                return value;
            },
        },
    };
}

/* ---------------------------------------------------------
 * ETag cache mock factory
 * ---------------------------------------------------------
 * Provides mock implementations for getCached() and
 * saveCached(), and a moduleMock that can be used in:
 *
 *   vi.mock("@utils/etagCache", () => etagCache.moduleMock)
 *
 * Useful for apiClient tests and any hook using ETag caching.
 * --------------------------------------------------------- */
export function createMockEtagCache() {
    const mockGetCached = vi.fn();
    const mockSaveCached = vi.fn();

    return {
        mockGetCached,
        mockSaveCached,
        moduleMock: {
            getCached: (...args) => mockGetCached(...args),
            saveCached: (...args) => mockSaveCached(...args),
        },
    };
}

/* ---------------------------------------------------------
 * Global fetch mock factory
 * ---------------------------------------------------------
 * Replaces global.fetch with a vi.fn() and returns it.
 *
 * Useful for apiClient tests and any code that performs
 * direct fetch() calls.
 *
 * Example:
 *   const mockFetch = createMockFetch();
 *   mockFetch.mockResolvedValueOnce(...)
 * --------------------------------------------------------- */
export function createMockFetch() {
    global.fetch = vi.fn();
    return global.fetch;
}

/* ---------------------------------------------------------
 * UIProvider passthrough mock (no JSX)
 * ---------------------------------------------------------
 * Some components (e.g. PageLayout) import and render
 * <UIProvider>. In tests we usually don't want the real
 * UIProvider logic (timers, state, side‑effects), we only
 * need it to render children without crashing.
 *
 * This mock replaces UIProvider with a minimal passthrough
 * implementation using React.createElement to avoid JSX
 * inside utility files (OXC parser limitation).
 *
 * Use this in tests that require UIProvider to exist but
 * do NOT need real UIContext behavior.
 * --------------------------------------------------------- */
export const mockUIProviderPassthrough = {
    __esModule: true,
    UIProvider: ({ children }) => React.createElement(React.Fragment, null, children),
};

/* ---------------------------------------------------------
 * UIContext mock factory
 * ---------------------------------------------------------
 * Creates a mock UI context object with default handler
 * functions (showSuccess, showError, showInfo, setLoading).
 *
 * You can override any of the default handlers by passing
 * an overrides object.
 *
 * Used in tests that mock UIContext directly (no Provider).
 * --------------------------------------------------------- */
export function createMockUI(overrides = {}) {
    return {
        showSuccess: vi.fn(),
        showError: vi.fn(),
        showInfo: vi.fn(),
        setLoading: vi.fn(),
        ...overrides,
    };
}

/* ---------------------------------------------------------
 * AuthContext mock factory (simple)
 * ---------------------------------------------------------
 * Returns a static mock AuthContext value.
 *
 * This is used in tests where components call useAuth()
 * directly and do NOT rely on AuthProvider logic.
 *
 * The returned object is static — it does not update if
 * you change values later in the test.
 * --------------------------------------------------------- */
export function createMockAuth(overrides = {}) {
    return {
        isAuthenticated: true,
        accessToken: "token123",
        user: { id: 1 },
        ...overrides,
    };
}

/* ---------------------------------------------------------
 * AuthContext mock factory (Provider-safe)
 * ---------------------------------------------------------
 * Used for components wrapped in AuthProvider (e.g. Navbar).
 *
 * This keeps the real AuthContext and AuthProvider intact,
 * but overrides the useAuth() hook with a mock.
 *
 * The returned object includes a "withActual" flag so the
 * test knows to merge this with the real module.
 * --------------------------------------------------------- */
export function createMockAuthForProviders(overrides = {}) {
    return {
        useAuth: () => ({
            isAuthenticated: true,
            user: { id: 1 },
            accessToken: "token123",
            ...overrides,
        }),
        withActual: true,
    };
}

/* ---------------------------------------------------------
 * Dynamic AuthContext mock
 * ---------------------------------------------------------
 * Used when tests need the accessToken to change between
 * test cases (e.g. useWishlist tests).
 *
 * Instead of returning a static object, this mock calls
 * getToken() every time useAuth() runs, ensuring the value
 * always reflects the latest state.
 * --------------------------------------------------------- */
export function createDynamicAuthMock(getToken) {
    return {
        useAuth: () => ({
            accessToken: getToken(),
        }),
    };
}

/* ---------------------------------------------------------
 * Wishlist mock factory
 * ---------------------------------------------------------
 * Creates a simple wishlist mock with a default empty list
 * and a toggle() function. Additional fields can be added
 * via the overrides object.
 * --------------------------------------------------------- */
export function createMockWishlist(overrides = {}) {
    return {
        wishlist: [],
        toggle: vi.fn(),
        ...overrides,
    };
}

/* ---------------------------------------------------------
 * Cart mock factory
 * ---------------------------------------------------------
 * Creates a mock cart object with default structure and
 * handler functions (addItem, updateQuantity, deleteItem,
 * clear). Useful for testing cart-related hooks/components.
 * --------------------------------------------------------- */
export function createMockCart(overrides = {}) {
    return {
        cart: [],
        version: 0,
        addItem: vi.fn(),
        updateQuantity: vi.fn(),
        deleteItem: vi.fn(),
        clear: vi.fn(),
        ...overrides,
    };
}

/* ---------------------------------------------------------
 * Generic form mock factory
 * ---------------------------------------------------------
 * Creates a stable mock implementation for any form hook
 * with email + password fields.
 * --------------------------------------------------------- */
export function createMockFormHook(overrides = {}) {
    const mockHandleSubmit = vi.fn();

    const base = {
        email: "",
        emailError: "",
        password: "",
        passwordError: "",
        isFormValid: true,

        handleEmailChange: vi.fn(),
        handleEmailBlur: vi.fn(),
        handlePasswordChange: vi.fn(),
        handlePasswordBlur: vi.fn(),
        handleSubmit: mockHandleSubmit,
    };

    return {
        mockHandleSubmit,
        mockHook: vi.fn(() => ({
            ...base,
            ...overrides,
        })),
    };
}

/* ---------------------------------------------------------
 * Mock JWT factory
 * ---------------------------------------------------------
 * Creates a fake JWT with a configurable expiry time.
 *
 * Example:
 *   const token = createMockJwt(5000); // expires in 5s
 *
 * Useful for testing hooks that depend on JWT expiry:
 *   - useTokenRefresh
 *   - useSessionTimers
 * --------------------------------------------------------- */
export function createMockJwt(expMsFromNow) {
    const exp = Math.floor((Date.now() + expMsFromNow) / 1000);
    const payload = btoa(JSON.stringify({ exp }));
    return `header.${payload}.sig`;
}
