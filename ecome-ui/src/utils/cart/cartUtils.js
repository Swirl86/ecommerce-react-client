import {
    FREE_SHIPPING_THRESHOLD,
    SHIPPING_COST_BASE,
    SHIPPING_COST_FREE,
    SHIPPING_COST_REDUCED,
    TAX_RATE,
} from "@config/constants";

export const CartUtils = {
    // Calculate subtotal
    getSubtotal(items) {
        return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    },

    // Shipping tiers
    getShipping(subtotal) {
        if (subtotal === 0) return 0;
        if (subtotal >= FREE_SHIPPING_THRESHOLD) return SHIPPING_COST_FREE;
        if (subtotal >= 50) return SHIPPING_COST_REDUCED;
        return SHIPPING_COST_BASE;
    },

    // Tax calculation
    getTax(subtotal) {
        return subtotal * TAX_RATE;
    },

    // Total including shipping + tax
    getTotal(items) {
        const subtotal = this.getSubtotal(items);
        const shipping = this.getShipping(subtotal);
        const tax = this.getTax(subtotal);
        return subtotal + shipping + tax;
    },

    // Free shipping progress
    getFreeShippingProgress(subtotal) {
        const missing = FREE_SHIPPING_THRESHOLD - subtotal;
        return {
            reached: missing <= 0,
            missing: Math.max(0, missing),
        };
    },
};
