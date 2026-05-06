import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// --- MOCKS (HAVE TO BE BEFORE IMPORTS) ---
vi.mock("@hooks/useProduct", () => ({
    useProduct: vi.fn(),
}));

vi.mock("@hooks/useCategories", () => ({
    useCategories: vi.fn(),
}));

vi.mock("@products/ProductImageViewer", () => ({
    default: () => <div>IMAGE</div>,
}));

vi.mock("@ui/SkeletonCard", () => ({
    default: () => <div data-testid="skeleton-card">SKELETON</div>,
}));

vi.mock("@ui/Breadcrumbs", () => ({
    default: () => <div>BREADCRUMBS</div>,
}));

vi.mock("@ui/BackButtonFloating", () => ({
    default: () => <div>BACK</div>,
}));

vi.mock("@layout/PageLayout", () => ({
    default: ({ children }) => <div>{children}</div>,
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useParams: () => ({ id: "1" }),
        useSearchParams: () => [new URLSearchParams("sort=price,asc"), vi.fn()],
        useNavigate: () => vi.fn(),
    };
});

// --- IMPORT AFTER MOCKS ---
import { useCategories } from "@hooks/useCategories";
import { useProduct } from "@hooks/useProduct";
import ProductDetail from "../ProductDetail";

describe("ProductDetail (minimal version)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("shows skeleton when loading", () => {
        useProduct.mockReturnValue({
            product: null,
            loading: true,
            error: false,
        });

        useCategories.mockReturnValue({
            categories: [],
        });

        render(
            <MemoryRouter>
                <ProductDetail />
            </MemoryRouter>
        );

        expect(screen.getByTestId("skeleton-card")).toBeInTheDocument();
    });

    test("renders product details when loaded", () => {
        useProduct.mockReturnValue({
            product: {
                id: 1,
                name: "Test Product",
                price: 199,
                description: "A great product",
                categoryId: 10,
                imageUrls: ["image1.jpg"],
            },
            loading: false,
            error: false,
        });

        useCategories.mockReturnValue({
            categories: [{ id: 10, name: "Electronics" }],
        });

        render(
            <MemoryRouter>
                <ProductDetail />
            </MemoryRouter>
        );

        expect(screen.getByText("Test Product")).toBeInTheDocument();
        expect(screen.getByText("$199")).toBeInTheDocument();
        expect(screen.getByText("A great product")).toBeInTheDocument();
        expect(screen.getByText("BREADCRUMBS")).toBeInTheDocument();
    });

    test("quantity selector increments and decrements", () => {
        useProduct.mockReturnValue({
            product: {
                id: 1,
                name: "Test Product",
                price: 199,
                description: "",
                categoryId: 10,
                imageUrls: ["image1.jpg"],
            },
            loading: false,
            error: false,
        });

        useCategories.mockReturnValue({
            categories: [{ id: 10, name: "Electronics" }],
        });

        render(
            <MemoryRouter>
                <ProductDetail />
            </MemoryRouter>
        );

        const plus = screen.getByRole("button", { name: "Increase quantity" });
        const minus = screen.getByRole("button", { name: "Decrease quantity" });

        expect(screen.getByText("1")).toBeInTheDocument();

        fireEvent.click(plus);
        expect(screen.getByText("2")).toBeInTheDocument();

        fireEvent.click(minus);
        expect(screen.getByText("1")).toBeInTheDocument();
    });
});
