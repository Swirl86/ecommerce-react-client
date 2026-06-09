export default function CheckoutPaymentMethod() {
    return (
        <div className="p-6 rounded-xl shadow-sm border border-[var(--color-border)] bg-[var(--color-surface)]">
            <h2 className="text-xl font-semibold mb-6 text-[var(--color-text)]">Payment Method</h2>

            <div className="space-y-3 text-sm text-[var(--color-text)]">
                {/* Card */}
                <label className="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-surface-hover)] transition">
                    <input
                        type="radio"
                        name="payment"
                        value="card"
                        defaultChecked
                        className="h-4 w-4 text-blue-600"
                    />
                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1">
                            <img src="/payment-icons/mastercard.svg" className="h-5" alt="Mastercard" />
                            <img src="/payment-icons/visa.svg" className="h-5" alt="Visa" />
                        </div>

                        <div>
                            <p className="font-medium">Card</p>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                Visa, Mastercard, American Express
                            </p>
                        </div>
                    </div>
                </label>

                {/* Swish */}
                <label className="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-surface-hover)] transition">
                    <input
                        type="radio"
                        name="payment"
                        value="swish"
                        className="h-4 w-4 text-blue-600"
                    />
                    <div className="flex items-center gap-3">
                        <img
                            src="/payment-icons/swish.svg"
                            alt="Swish"
                            className="h-6"
                        />
                        <div>
                            <p className="font-medium">Swish</p>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                Pay easily with your mobile
                            </p>
                        </div>
                    </div>
                </label>

                {/* Klarna */}
                <label className="flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-surface-hover)] transition">
                    <input
                        type="radio"
                        name="payment"
                        value="klarna"
                        className="h-4 w-4 text-blue-600"
                    />
                    <div className="flex items-center gap-3">
                        <img
                            src="/payment-icons/klarna.svg"
                            alt="Klarna"
                            className="h-5"
                        />
                        <div>
                            <p className="font-medium">Klarna</p>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                Pay later or split your payment
                            </p>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    );
}
