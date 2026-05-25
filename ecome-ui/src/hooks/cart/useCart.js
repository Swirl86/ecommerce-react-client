import { useCartContext } from "@context/CartContext";

// NOTE:
// useCart is split into two parts: useCartInternal + useCartContext.
// useCartInternal contains the actual cart logic and is executed only once inside <CartProvider>.
// useCartContext simply exposes that single shared instance to all components.
// This prevents multiple independent cart states (e.g., Navbar vs Product pages)
// and ensures the cart stays globally synchronized across the entire app.
export function useCart() {
    return useCartContext();
}
