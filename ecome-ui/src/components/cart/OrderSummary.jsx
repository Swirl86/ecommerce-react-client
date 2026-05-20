import { H3 } from "@typography";
import { Link } from "react-router-dom";

export default function OrderSummary() {
    // TODO change to real data
    const subtotal = 39.99 + 29.99 * 2;

    return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-8">
            <H3 className="mb-4">Order Summary</H3>

            <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span className="text-gray-500">TBD</span>
            </div>

            <div className="flex justify-between mb-4">
                <span>Tax</span>
                <span className="text-gray-500">TBD</span>
            </div>

            <div className="flex justify-between font-semibold text-lg border-t pt-4">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>

            <button className="w-full mt-6 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition">
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
