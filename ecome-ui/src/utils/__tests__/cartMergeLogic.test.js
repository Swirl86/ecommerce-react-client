import { describe, expect, it } from "vitest";

// ---- MERGE FUNCTION  ----
function mergeCarts(local, backend) {
    const merged = {};

    backend.forEach((item) => {
        merged[item.productId] = item.quantity;
    });

    local.forEach((item) => {
        merged[item.productId] = (merged[item.productId] || 0) + item.quantity;
    });

    return Object.entries(merged).map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity,
    }));
}

// ---------------------------------------------------

describe("Cart merge logic", () => {
    it("merges two carts and sums quantities", () => {
        const local = [
            { productId: 1, quantity: 2 },
            { productId: 2, quantity: 1 },
        ];

        const backend = [
            { productId: 1, quantity: 3 },
            { productId: 3, quantity: 5 },
        ];

        const result = mergeCarts(local, backend);

        const sorted = result.sort((a, b) => a.productId - b.productId);

        expect(sorted).toEqual([
            { productId: 1, quantity: 5 },
            { productId: 2, quantity: 1 },
            { productId: 3, quantity: 5 },
        ]);
    });

    it("handles empty local cart", () => {
        const result = mergeCarts([], [{ productId: 10, quantity: 2 }]);

        expect(result).toEqual([{ productId: 10, quantity: 2 }]);
    });

    it("handles empty backend cart", () => {
        const result = mergeCarts([{ productId: 5, quantity: 7 }], []);

        expect(result).toEqual([{ productId: 5, quantity: 7 }]);
    });

    it("handles both carts empty", () => {
        const result = mergeCarts([], []);
        expect(result).toEqual([]);
    });

    it("treats different item IDs as same product if productId matches", () => {
        const local = [{ id: "local-1", productId: 10, quantity: 1 }];

        const backend = [{ id: "backend-99", productId: 10, quantity: 4 }];

        const result = mergeCarts(local, backend);

        expect(result).toEqual([{ productId: 10, quantity: 5 }]);
    });

    it("keeps productId as number", () => {
        const result = mergeCarts(
            [{ productId: "7", quantity: 2 }],
            [{ productId: 7, quantity: 3 }]
        );

        expect(result).toEqual([{ productId: 7, quantity: 5 }]);
    });
});
