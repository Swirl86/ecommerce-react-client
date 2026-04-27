import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ThemeToggle from "./ThemeToggle";

// Helper to mock matchMedia
function mockMatchMedia(matches) {
    return vi.fn().mockReturnValue({
        matches,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    });
}

describe("ThemeToggle", () => {
    beforeEach(() => {
        // Reset DOM state before each test
        document.documentElement.classList.remove("dark");

        // Clear localStorage
        localStorage.clear();

        // Mock matchMedia (default: prefers light mode)
        window.matchMedia = mockMatchMedia(false);
    });

    test("renders light mode by default when no saved theme exists", () => {
        render(<ThemeToggle />);

        // Button title should indicate switching to dark mode
        expect(screen.getByTitle("Switch to dark mode")).toBeInTheDocument();

        // Light mode icon should be visible
        expect(screen.getByText("🌞")).toBeInTheDocument();

        // Document should NOT have the dark class
        expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    test("renders dark mode when localStorage contains 'dark'", () => {
        // Simulate saved theme
        localStorage.setItem("theme", "dark");

        render(<ThemeToggle />);

        // Button title should indicate switching to light mode
        expect(screen.getByTitle("Switch to light mode")).toBeInTheDocument();

        // Dark mode icon should be visible
        expect(screen.getByText("🌙")).toBeInTheDocument();

        // Document should have the dark class
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    test("toggles from light → dark when clicked", () => {
        render(<ThemeToggle />);

        const button = screen.getByRole("button");

        // Simulate user clicking the toggle
        fireEvent.click(button);

        // Document should now be in dark mode
        expect(document.documentElement.classList.contains("dark")).toBe(true);

        // Theme should be saved to localStorage
        expect(localStorage.getItem("theme")).toBe("dark");

        // Dark mode icon should be visible
        expect(screen.getByText("🌙")).toBeInTheDocument();
    });

    test("toggles from dark → light when clicked", () => {
        // Start in dark mode
        localStorage.setItem("theme", "dark");

        render(<ThemeToggle />);

        const button = screen.getByRole("button");

        // Simulate user clicking the toggle
        fireEvent.click(button);

        // Document should now be in light mode
        expect(document.documentElement.classList.contains("dark")).toBe(false);

        // Theme should be saved to localStorage
        expect(localStorage.getItem("theme")).toBe("light");

        // Light mode icon should be visible
        expect(screen.getByText("🌞")).toBeInTheDocument();
    });
});
