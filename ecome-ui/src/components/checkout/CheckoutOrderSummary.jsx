export default function CheckoutOrderSummary() {
    return (
        <div className="p-6 rounded-xl shadow-sm border border-[var(--color-border)] bg-[var(--color-surface)]">
            <h2 className="text-xl font-semibold mb-6 text-[var(--color-text)]">Order Summary</h2>

            <div className="space-y-3 text-sm text-[var(--color-text)]">
                <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Subtotal</span>
                    <span>—</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Shipping</span>
                    <span>—</span>
                </div>

                <div className="border-t border-[var(--color-border)] pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>—</span>
                </div>
            </div>
        </div>
    );
}
