import { backendAdapter } from "@hooks/cart/cartAdapter";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { addCartItem, clearCart, removeCartItem, updateCartItem } from "@api/cartApi";

// ----------------------
// MOCK API FUNCTIONS
// ----------------------
vi.mock("@api/cartApi", () => ({
    addCartItem: vi.fn(),
    updateCartItem: vi.fn(),
    removeCartItem: vi.fn(),
    clearCart: vi.fn(),
}));

describe("backendAdapter", () => {
    const accessToken = "token123";
    const onChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("get() returns data unchanged", () => {
        const adapter = backendAdapter(accessToken, onChange);
        const data = { items: [{ id: 1 }] };

        expect(adapter.get(data)).toBe(data);
    });

    it("add() calls addCartItem and then onChange", async () => {
        const adapter = backendAdapter(accessToken, onChange);

        await adapter.add({ id: 10 }, 3);

        expect(addCartItem).toHaveBeenCalledWith(10, 3, accessToken);
        expect(onChange).toHaveBeenCalled();
    });

    it("update() calls updateCartItem and then onChange", async () => {
        const adapter = backendAdapter(accessToken, onChange);

        await adapter.update("item-1", 5);

        expect(updateCartItem).toHaveBeenCalledWith("item-1", 5, accessToken);
        expect(onChange).toHaveBeenCalled();
    });

    it("delete() calls removeCartItem and then onChange", async () => {
        const adapter = backendAdapter(accessToken, onChange);

        await adapter.delete("item-1");

        expect(removeCartItem).toHaveBeenCalledWith("item-1", accessToken);
        expect(onChange).toHaveBeenCalled();
    });

    it("clear() calls clearCart and then onChange", async () => {
        const adapter = backendAdapter(accessToken, onChange);

        await adapter.clear();

        expect(clearCart).toHaveBeenCalledWith(accessToken);
        expect(onChange).toHaveBeenCalled();
    });
});
