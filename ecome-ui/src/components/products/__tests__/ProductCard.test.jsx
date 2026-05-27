import { IMAGE_PLACEHOLDER } from "@config/constants";
import ProductCard from "@products/ProductCard";
import { render, screen } from "@testing-library/react";
import { createMockAuth, createMockUI, createMockWishlist } from "@utils/test-utils/mockUtils";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// ----------------------
// Mock instances
// ----------------------
const mockUI = createMockUI();
const mockAuth = createMockAuth();
const mockWishlist = createMockWishlist();

// ----------------------
// Mock UIContext
// ----------------------
vi.mock("@context/UIContext", () => ({
    useUI: () => mockUI,
}));

// ----------------------
// Mock AuthContext
// ----------------------
vi.mock("@context/AuthContext", () => ({
    useAuth: () => mockAuth,
}));

// ----------------------
// Mock Wishlist hook
// ----------------------
vi.mock("@hooks/profile/useWishlist", () => ({
    useWishlist: () => mockWishlist,
}));

// ----------------------
// Mock Typography components
// ----------------------
vi.mock("@typography", () => ({
    H3: ({ children }) => <h3>{children}</h3>,
    Muted: ({ children }) => <span>{children}</span>,
}));

// ----------------------
// Mock ProductImageViewer
// ----------------------
vi.mock("@products/ProductImageViewer", () => ({
    default: ({ initialImage }) => (
        <img src={initialImage} alt="Product image" data-testid="product-image" />
    ),
}));

// ----------------------
// Tests
// ----------------------
describe("ProductCard", () => {
    const baseProduct = {
        id: 1,
        name: "Test Product",
        price: 199,
        imageUrls: ["test-image.jpg"],
    };

    const renderCard = (product = baseProduct, selectedCategory = null, sort = "") =>
        render(
            <MemoryRouter>
                <ProductCard product={product} selectedCategory={selectedCategory} sort={sort} />
            </MemoryRouter>
        );

    test("renders product name", () => {
        renderCard();
        expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    test("renders product price", () => {
        renderCard();
        expect(screen.getByText("$199")).toBeInTheDocument();
    });

    test("renders product image when available", () => {
        renderCard();
        const img = screen.getByTestId("product-image");
        expect(img).toHaveAttribute("src", "test-image.jpg");
    });

    test("uses fallback image when no image is provided", () => {
        const product = { ...baseProduct, imageUrls: [] };
        renderCard(product);

        const img = screen.getByTestId("product-image");
        expect(img).toHaveAttribute("src", IMAGE_PLACEHOLDER);
    });

    test("renders correct alt text", () => {
        renderCard();
        const img = screen.getByTestId("product-image");
        expect(img).toHaveAttribute("alt", "Product image");
    });

    test("renders correct link without query params", () => {
        renderCard();
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/products/1");
    });

    test("renders correct link with category and sort params", () => {
        renderCard(baseProduct, 5, "price_desc");

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/products/1?category=5&sort=price_desc");
    });

    test("renders fallback name when missing", () => {
        const product = { ...baseProduct, name: null };
        renderCard(product);

        expect(screen.getByText("Unnamed Product")).toBeInTheDocument();
    });

    test("renders fallback price when missing", () => {
        const product = { ...baseProduct, price: null };
        renderCard(product);

        expect(screen.getByText("No price available")).toBeInTheDocument();
    });
});
