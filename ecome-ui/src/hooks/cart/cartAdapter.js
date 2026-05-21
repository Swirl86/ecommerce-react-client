import { addCartItem, clearCart, removeCartItem, updateCartItem } from "@api/cartApi";
import { IMAGE_PLACEHOLDER } from "@config/constants";
import { clearLocalCart, getLocalCart, saveLocalCart } from "@utils";

// -----------------------------
// LOCAL CART ADAPTER
// -----------------------------
export const localAdapter = {
    get: () => getLocalCart().items,

    add: (productId, quantity = 1) => {
        const c = getLocalCart();
        const item = c.items.find((i) => i.productId === productId);

        let product = window.__PRODUCTS__?.find((p) => p.id === productId);

        if (!product) {
            product = {
                id: productId,
                name: "Unknown product",
                imageUrl: IMAGE_PLACEHOLDER,
                price: 0,
            };
        }

        if (item) {
            item.quantity += quantity;
        } else {
            c.items.push({
                id: Date.now(), // fake cartItemId offline,
                productId,
                productName: product.name,
                imageUrl: product.imageUrl,
                unitPrice: product.price,
                quantity,
            });
        }

        saveLocalCart(c);
    },

    update: (id, quantity) => {
        const c = getLocalCart();
        const item = c.items.find((i) => i.id === id);
        if (item) item.quantity = quantity;
        saveLocalCart(c);
    },

    delete: (id) => {
        const c = getLocalCart();
        c.items = c.items.filter((i) => i.id !== id);
        saveLocalCart(c);
    },

    clear: () => clearLocalCart(),
};

// -----------------------------
// BACKEND CART ADAPTER
// -----------------------------
export const backendAdapter = (accessToken, refetch) => ({
    get: (data) => data?.items || [],

    add: async (productId, quantity = 1) => {
        await addCartItem(productId, quantity, accessToken);
        await refetch();
    },

    update: async (itemId, quantity) => {
        await updateCartItem(itemId, quantity, accessToken);
        await refetch();
    },

    delete: async (itemId) => {
        await removeCartItem(itemId, accessToken);
        await refetch();
    },

    clear: async () => {
        await clearCart(accessToken);
        await refetch();
    },
});
