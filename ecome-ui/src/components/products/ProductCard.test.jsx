import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { IMAGE_PLACEHOLDER } from "../../config/constants";
import ProductCard from "./ProductCard";

// Mock ProductImageViewer to make tests stable and predictable
vi.mock("../products/ProductImageViewer", () => ({
    default: ({ initialImage }) => <img src={initialImage} alt="Product image" />,
}));

describe("ProductCard", () => {
    const product = {
        id: 1,
        name: "Test Product",
        price: 199,
        imageUrls: ["test-image.jpg"],
    };

    test("renders product name", () => {
        render(
            <MemoryRouter>
                <ProductCard product={product} selectedCategory={null} sort="" />
            </MemoryRouter>
        );

        expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    test("renders product price", () => {
        render(
            <MemoryRouter>
                <ProductCard product={product} selectedCategory={null} sort="" />
            </MemoryRouter>
        );

        expect(screen.getByText("$199")).toBeInTheDocument();
    });

    test("renders image with correct src", () => {
        render(
            <MemoryRouter>
                <ProductCard product={product} selectedCategory={null} sort="" />
            </MemoryRouter>
        );

        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", "test-image.jpg");
    });

    test("uses fallback image when no image is provided", () => {
        const noImageProduct = { ...product, imageUrls: [] };

        render(
            <MemoryRouter>
                <ProductCard product={noImageProduct} selectedCategory={null} sort="" />
            </MemoryRouter>
        );

        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", IMAGE_PLACEHOLDER);
    });

    test("renders correct alt text", () => {
        render(
            <MemoryRouter>
                <ProductCard product={product} selectedCategory={null} sort="" />
            </MemoryRouter>
        );

        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("alt", "Product image");
    });
});
