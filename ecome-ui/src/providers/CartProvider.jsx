import { CartContext } from "@context/CartContext";
import { useCartInternal } from "@hooks/cart/useCartInternal";

export function CartProvider({ children }) {
    const value = useCartInternal();
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
