import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { useProducts } from "../../hooks/useProducts";
import Products from "../Products";

// Mock router hooks
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useSearchParams: () => [new URLSearchParams(""), vi.fn()],
        useNavigate: () => vi.fn(),
    };
});

// Mock useProducts
vi.mock("../../hooks/useProducts", () => ({
    useProducts: vi.fn(),
}));

describe("Products page", () => {
    test("shows skeletons when loading is true", () => {
        useProducts.mockReturnValue({
            products: [],
            loading: true,
            error: false,
        });

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        const skeletons = screen.getAllByRole("generic", { hidden: true });
        expect(skeletons.length).toBeGreaterThan(0);
    });

    test("shows products when loading is false", () => {
        useProducts.mockReturnValue({
            products: [
                { id: 1, name: "Product A", price: 100, imageUrls: [] },
                { id: 2, name: "Product B", price: 200, imageUrls: [] },
            ],
            loading: false,
            error: false,
        });

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        expect(screen.getByText("Product A")).toBeInTheDocument();
        expect(screen.getByText("Product B")).toBeInTheDocument();
    });

    test("shows error message when error is true", () => {
        useProducts.mockReturnValue({
            products: [],
            loading: false,
            error: true,
        });

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        expect(
            screen.getByText("Could not connect to backend. Please try again later.")
        ).toBeInTheDocument();
    });
});
