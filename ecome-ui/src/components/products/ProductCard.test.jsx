import { render, screen } from "@testing-library/react";
import { IMAGE_PLACEHOLDER } from "../../config/constants";
import ProductCard from "./ProductCard";

describe("ProductCard", () => {
    const product = {
        id: 1,
        name: "Test Product",
        price: 199,
        imageUrls: ["test-image.jpg"],
    };

    test("renders product name", () => {
        // Render the component with a product
        render(<ProductCard product={product} />);

        // The product name should be visible
        expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    test("renders product price", () => {
        render(<ProductCard product={product} />);

        // The formatted price should be visible
        expect(screen.getByText("$199")).toBeInTheDocument();
    });

    test("renders image with correct src", () => {
        render(<ProductCard product={product} />);

        // The <img> element should use the product image URL
        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", "test-image.jpg");
    });

    test("uses fallback image when no image is provided", () => {
        // Simulate a product with an empty image array
        const noImageProduct = { ...product, imageUrls: [] };

        render(<ProductCard product={noImageProduct} />);

        // The <img> element should use the fallback placeholder
        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", IMAGE_PLACEHOLDER);
    });

    test("renders alt text based on product name", () => {
        render(<ProductCard product={product} />);

        // The alt attribute should include the product name
        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("alt", "Image of Test Product");
    });
});
