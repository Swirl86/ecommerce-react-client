vi.mock("@context/UIContext", () => ({
    __esModule: true,
    UIProvider: ({ children }) => <div>{children}</div>,
}));

vi.mock("@hooks/useProducts", () => ({
    useProducts: vi.fn(),
}));

vi.mock("@hooks/useCategories", () => ({
    useCategories: vi.fn(() => ({
        categories: [],
        loading: false,
        error: false,
    })),
}));

import { useProducts } from "@hooks/useProducts";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Products from "../Products";

describe("Products page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

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

        expect(screen.getAllByRole("generic").length).toBeGreaterThan(0);
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
});
