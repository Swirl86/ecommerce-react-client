import { useAuth } from "@context/AuthContext";
import { H3 } from "@typography";
import { CartUtils } from "@utils/cart/cartUtils";
import { Link, useNavigate } from "react-router-dom";

export default function OrderSummary({ items }) {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const subtotal = CartUtils.getSubtotal(items);
    const shipping = CartUtils.getShipping(subtotal);
    const tax = CartUtils.getTax(subtotal);
    const total = CartUtils.getTotal(items);

    const { reached, missing } = CartUtils.getFreeShippingProgress(subtotal);

    function handleCheckout() {
        if (!accessToken) {
            navigate("/login?redirect=/checkout");
            return;
        }
        navigate("/checkout");
    }

    return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-8">
            <H3 className="mb-4">Order Summary</H3>

            <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>

            <div className="flex justify-between mb-2">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
            </div>

            {reached ? (
                <p className="text-green-600 text-sm mb-2">You qualify for free shipping!</p>
            ) : (
                <p className="text-yellow-600 text-sm mb-2">
                    Spend ${missing.toFixed(2)} more to get free shipping
                </p>
            )}

            <div className="flex justify-between font-semibold text-lg border-t pt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>

            <button
                onClick={handleCheckout}
                className="w-full mt-6 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
            >
                Proceed to Checkout
            </button>

            <Link
                to="/products"
                className="block text-center mt-4 text-sm text-sky-600 hover:underline"
            >
                Continue shopping
            </Link>
        </div>
    );
}
