import { createContext, useContext } from "react";

const CartContext = createContext(undefined);
CartContext.displayName = "CartContext";

function useCartContext() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used inside <CartProvider>");
    }
    return ctx;
}

export { CartContext, useCartContext };
