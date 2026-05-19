import { fireEvent, render, screen } from "@testing-library/react";
import ThemeToggle from "@ui/ThemeToggle";
import { vi } from "vitest";

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
        document.documentElement.classList.remove("dark");
        localStorage.clear();
        window.matchMedia = mockMatchMedia(false);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("renders light mode by default when no saved theme exists", () => {
        render(<ThemeToggle />);

        expect(screen.getByTitle("Switch to dark mode")).toBeInTheDocument();
        expect(screen.getByText("🌞")).toBeInTheDocument();
        expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    test("renders dark mode when localStorage contains 'dark'", () => {
        localStorage.setItem("theme", "dark");

        render(<ThemeToggle />);

        expect(screen.getByTitle("Switch to light mode")).toBeInTheDocument();
        expect(screen.getByText("🌙")).toBeInTheDocument();
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    test("toggles from light → dark when clicked", () => {
        render(<ThemeToggle />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(document.documentElement.classList.contains("dark")).toBe(true);
        expect(localStorage.getItem("theme")).toBe("dark");
        expect(screen.getByText("🌙")).toBeInTheDocument();
    });

    test("toggles from dark → light when clicked", () => {
        localStorage.setItem("theme", "dark");

        render(<ThemeToggle />);

        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(document.documentElement.classList.contains("dark")).toBe(false);
        expect(localStorage.getItem("theme")).toBe("light");
        expect(screen.getByText("🌞")).toBeInTheDocument();
    });
});
