import "@testing-library/jest-dom";

// For ThemeToggle and any component using matchMedia
if (typeof window !== "undefined" && !window.matchMedia) {
    window.matchMedia = () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
    });
}
