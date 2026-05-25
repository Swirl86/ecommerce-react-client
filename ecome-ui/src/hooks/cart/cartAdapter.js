import { addCartItem, clearCart, removeCartItem, updateCartItem } from "@api/cartApi";
import { IMAGE_PLACEHOLDER } from "@config/constants";
import { clearLocalCart, getLocalCart, saveLocalCart } from "@utils";

// -----------------------------------------------------
// Helpers
// -----------------------------------------------------
function normalizeProduct(product) {
    return {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrls?.[0] ?? IMAGE_PLACEHOLDER,
        price: Number(product.price) || 0,
    };
}

function generateLocalId() {
    return crypto.randomUUID();
}

// -----------------------------------------------------
// LOCAL CART ADAPTER
// -----------------------------------------------------
export const localAdapter = {
    get: () => getLocalCart(),

    add: (product, quantity = 1) => {
        const normalized = normalizeProduct(product);
        const cart = getLocalCart();

        const existing = cart.items.find((i) => i.productId === normalized.id);

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.items.push({
                id: generateLocalId(),
                productId: normalized.id,
                productName: normalized.name,
                imageUrl: normalized.imageUrl,
                unitPrice: normalized.price,
                quantity,
            });
        }

        saveLocalCart(cart);
    },

    update: (itemId, quantity) => {
        const cart = getLocalCart();
        const item = cart.items.find((i) => i.id === itemId);
        if (item) item.quantity = quantity;
        saveLocalCart(cart);
    },

    delete: (itemId) => {
        const cart = getLocalCart();
        cart.items = cart.items.filter((i) => i.id !== itemId);
        saveLocalCart(cart);
    },

    clear: () => clearLocalCart(),
};

// -----------------------------------------------------
// BACKEND CART ADAPTER
// -----------------------------------------------------
export const backendAdapter = (accessToken, onChange) => ({
    get: (data) => data,

    add: async (product, quantity = 1) => {
        await addCartItem(product.id, quantity, accessToken);
        await onChange();
    },

    update: async (itemId, quantity) => {
        await updateCartItem(itemId, quantity, accessToken);
        await onChange();
    },

    delete: async (itemId) => {
        await removeCartItem(itemId, accessToken);
        await onChange();
    },

    clear: async () => {
        await clearCart(accessToken);
        await onChange();
    },
});
