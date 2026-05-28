import { checkout } from "@api/orderApi";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import { useCart } from "@hooks/cart/useCart";
import { useNavigate } from "react-router-dom";

export function useCheckout() {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const { clear: clearCart, cart } = useCart();
    const { setLoading, showError, showSuccess } = useUI();

    async function placeOrder() {
        if (!accessToken) return;

        setLoading(true);

        try {
            const order = await checkout(accessToken);

            clearCart();

            showSuccess("Order placed successfully");

            navigate(`/checkout/confirmation/${order.id}`);
        } catch (err) {
            showError(err.message || "Checkout failed");
        } finally {
            setLoading(false);
        }
    }

    return { placeOrder };
}
