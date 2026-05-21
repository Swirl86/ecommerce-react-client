import { addCartItem, clearCart, getCart } from "@api/cartApi";
import { getLocalCart, saveLocalCart } from "@utils";

// LOCAL → BACKEND
export async function syncLocalCartToBackend(accessToken) {
    const local = getLocalCart().items;
    if (local.length === 0) return;

    const backend = await getCart(accessToken);
    const merged = {};

    // Backend first (merge by productId)
    backend.items.forEach((item) => {
        merged[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            imageUrl: item.imageUrl,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
        };
    });

    // Merge local (also by productId)
    local.forEach((item) => {
        if (!merged[item.productId]) {
            merged[item.productId] = { ...item };
        } else {
            merged[item.productId].quantity += item.quantity;
        }
    });

    // Clear backend
    await clearCart(accessToken);

    // Send merged items (productId!)
    for (const productId in merged) {
        const item = merged[productId];
        await addCartItem(item.productId, item.quantity, accessToken);
    }

    // IMPORTANT: Fetch backend again to get REAL cartItemIds
    const backendAfter = await getCart(accessToken);
    saveLocalCart({
        items: backendAfter.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            imageUrl: item.imageUrl,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
        })),
    });
}

// BACKEND → LOCAL
export async function syncBackendCartToLocal(accessToken) {
    const backend = await getCart(accessToken);

    const items = backend.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        imageUrl: item.imageUrl,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
    }));

    saveLocalCart({ items });
}
