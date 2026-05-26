import { fireEvent, render, screen } from "@testing-library/react";
import { TestProviders } from "@utils/test-utils/TestProviders";
import { vi } from "vitest";

// ----------------------
// REQUIRED MOCKS
// ----------------------

// Domain hooks
vi.mock("@hooks/domain/useProduct", () => ({
    useProduct: vi.fn(),
}));

vi.mock("@hooks/domain/useCategories", () => ({
    useCategories: vi.fn(),
}));

// Auth + UI
vi.mock("@context/AuthContext", async () => {
    const actual = await vi.importActual("@context/AuthContext");
    return {
        ...actual,
        useAuth: () => ({
            accessToken: "token123",
            user: { id: 1 },
        }),
    };
});

vi.mock("@context/UIContext", async () => {
    const actual = await vi.importActual("@context/UIContext");
    return {
        ...actual,
        useUI: () => ({
            showSuccess: vi.fn(),
            showError: vi.fn(),
            showInfo: vi.fn(),
        }),
    };
});

// Wishlist hook
vi.mock("@hooks/profile/useWishlist", () => ({
    useWishlist: () => ({
        wishlist: [],
        toggle: vi.fn(),
    }),
}));

// Typography
vi.mock("@typography", () => ({
    H2: ({ children }) => <h2>{children}</h2>,
    H3: ({ children }) => <h3>{children}</h3>,
    Muted: ({ children }) => <span>{children}</span>,
}));

// Layout
vi.mock("@layout/PageContainer", () => ({
    default: ({ children }) => <div data-testid="page">{children}</div>,
}));

// UI components
vi.mock("@products/ProductImageViewer", () => ({
    default: () => <div data-testid="image-viewer">IMAGE</div>,
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

// Description
vi.mock("@products/CollapsibleDescription", () => ({
    default: ({ text }) => <div>{text}</div>,
}));

// Quantity selector
vi.mock("@ui/QuantitySelector", () => ({
    default: ({ value, onChange }) => (
        <div>
            <button onClick={() => onChange(value - 1)}>-</button>
            <span>{value}</span>
            <button onClick={() => onChange(value + 1)}>+</button>
        </div>
    ),
}));

// Router mocks
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useParams: () => ({ id: "1" }),
        useSearchParams: () => [new URLSearchParams("sort=price,asc"), vi.fn()],
        useNavigate: () => vi.fn(),
    };
});

// ----------------------
// IMPORT AFTER MOCKS
// ----------------------
import { useCategories } from "@hooks/domain/useCategories";
import { useProduct } from "@hooks/domain/useProduct";
import ProductDetail from "../ProductDetail";

// ----------------------
// TESTS
// ----------------------
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
            <TestProviders>
                <ProductDetail />
            </TestProviders>
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
            <TestProviders>
                <ProductDetail />
            </TestProviders>
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
            <TestProviders>
                <ProductDetail />
            </TestProviders>
        );

        const plus = screen.getByText("+");
        const minus = screen.getByText("-");

        expect(screen.getByText("1")).toBeInTheDocument();

        fireEvent.click(plus);
        expect(screen.getByText("2")).toBeInTheDocument();

        fireEvent.click(minus);
        expect(screen.getByText("1")).toBeInTheDocument();
    });
});
