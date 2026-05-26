import { IMAGE_PLACEHOLDER } from "@config/constants";
import { localAdapter } from "@hooks/cart/cartAdapter";
import { clearLocalCart, getLocalCart, saveLocalCart } from "@utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ----------------------
// MOCKS
// ----------------------
vi.mock("@utils", () => ({
    getLocalCart: vi.fn(),
    saveLocalCart: vi.fn(),
    clearLocalCart: vi.fn(),
}));

// Mock crypto.randomUUID
vi.stubGlobal("crypto", {
    randomUUID: vi.fn(() => "uuid-123"),
});

describe("localAdapter", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        getLocalCart.mockReturnValue({ items: [] });
    });

    it("returns cart from getLocalCart()", () => {
        getLocalCart.mockReturnValue({ items: [{ id: "x" }] });

        const cart = localAdapter.get();
        expect(cart).toEqual({ items: [{ id: "x" }] });
    });

    it("adds a new item when productId does not exist", () => {
        const product = {
            id: 10,
            name: "Test Product",
            price: 199,
            imageUrls: ["img.jpg"],
        };

        localAdapter.add(product, 2);

        expect(saveLocalCart).toHaveBeenCalledWith({
            items: [
                {
                    id: "uuid-123",
                    productId: 10,
                    productName: "Test Product",
                    imageUrl: "img.jpg",
                    unitPrice: 199,
                    quantity: 2,
                },
            ],
        });
    });

    it("normalizes product fields correctly", () => {
        const product = {
            id: 5,
            name: "No Image Product",
            price: "49",
            imageUrls: null,
        };

        localAdapter.add(product, 1);

        expect(saveLocalCart).toHaveBeenCalledWith({
            items: [
                {
                    id: "uuid-123",
                    productId: 5,
                    productName: "No Image Product",
                    imageUrl: IMAGE_PLACEHOLDER,
                    unitPrice: 49,
                    quantity: 1,
                },
            ],
        });
    });

    it("increments quantity when productId already exists", () => {
        getLocalCart.mockReturnValue({
            items: [
                {
                    id: "uuid-111",
                    productId: 10,
                    productName: "Test Product",
                    imageUrl: "img.jpg",
                    unitPrice: 199,
                    quantity: 2,
                },
            ],
        });

        const product = {
            id: 10,
            name: "Test Product",
            price: 199,
            imageUrls: ["img.jpg"],
        };

        localAdapter.add(product, 3);

        expect(saveLocalCart).toHaveBeenCalledWith({
            items: [
                {
                    id: "uuid-111",
                    productId: 10,
                    productName: "Test Product",
                    imageUrl: "img.jpg",
                    unitPrice: 199,
                    quantity: 5, // 2 + 3
                },
            ],
        });
    });

    it("updates item quantity", () => {
        getLocalCart.mockReturnValue({
            items: [{ id: "uuid-111", productId: 10, quantity: 2 }],
        });

        localAdapter.update("uuid-111", 7);

        expect(saveLocalCart).toHaveBeenCalledWith({
            items: [{ id: "uuid-111", productId: 10, quantity: 7 }],
        });
    });

    it("deletes an item", () => {
        getLocalCart.mockReturnValue({
            items: [
                { id: "a", productId: 1 },
                { id: "b", productId: 2 },
            ],
        });

        localAdapter.delete("a");

        expect(saveLocalCart).toHaveBeenCalledWith({
            items: [{ id: "b", productId: 2 }],
        });
    });

    it("clears the cart", () => {
        localAdapter.clear();
        expect(clearLocalCart).toHaveBeenCalled();
    });
});
