import { useCart } from "@hooks/cart/useCart";

export default function CheckoutOrderSummary() {
    const { subtotal, shipping, tax, total } = useCart();

    return (
        <div className="p-6 rounded-xl shadow-sm border border-[var(--color-border)] bg-[var(--color-surface)]">
            <h2 className="text-xl font-semibold mb-6 text-[var(--color-text)]">Order Summary</h2>

            <div className="space-y-3 text-sm text-[var(--color-text)]">
                <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Subtotal</span>
                    <span>{subtotal.toFixed(2)} kr</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `${shipping.toFixed(2)} kr`}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Tax</span>
                    <span>{tax.toFixed(2)} kr</span>
                </div>

                <div className="border-t border-[var(--color-border)] pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{total.toFixed(2)} kr</span>
                </div>
            </div>
        </div>
    );
}
