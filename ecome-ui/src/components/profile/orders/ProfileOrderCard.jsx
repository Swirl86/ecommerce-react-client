import { IMAGE_PLACEHOLDER } from "@config/constants";
import { CartUtils, getOrderStatusUI } from "@utils";

export default function ProfileOrderCard({ order, isOpen, onToggle }) {
    const ui = getOrderStatusUI(order.status);

    const { items } = order;
    const subtotal = CartUtils.getSubtotal(items);
    const shipping = CartUtils.getShipping(subtotal);
    const tax = CartUtils.getTax(subtotal);
    const total = CartUtils.getTotal(items);

    // Fake expected ship date
    const expectedShipDate = CartUtils.getRandomExpectedShipDate(order.createdAt);

    return (
        <div className="w-full border-4 border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] p-5 shadow-sm transition hover:shadow-md">
            {/* Header */}
            <div className="w-full flex justify-between items-center pb-4 border-b-4 border-[var(--color-border)]">
                <div className="text-left">
                    <h4 className="text-lg font-semibold text-[var(--color-text)]">
                        Order #{order.id}
                    </h4>

                    <p className="text-sm text-[var(--color-text-muted)]">
                        Placed: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                {/* Status badge */}
                <span
                    className={`
                        flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                        ${ui.bg} ${ui.color}
                    `}
                >
                    {ui.icon} {order.status}
                </span>
            </div>

            {/* Chevron + text */}
            <button
                onClick={onToggle}
                className="w-full flex flex-col items-center py-3 transition group"
            >
                <span className="text-xs text-[var(--color-text-muted)] mb-1">
                    {isOpen ? "Hide details" : "Show details"}
                </span>

                <span
                    className={`
                        flex items-center justify-center
                        w-10 h-10 rounded-full
                        transition-all duration-300
                        ${isOpen ? "rotate-180" : "rotate-0"}
                        group-hover:bg-[var(--color-border)]/20
                        group-hover:scale-105
                        active:scale-95
                    `}
                >
                    <span className="text-xl font-light">▼</span>
                </span>
            </button>

            {/* Divider */}
            <div className="w-full h-px bg-[var(--color-border)] mb-3 opacity-40"></div>

            {/* Slide-down animation */}
            <div
                className={`
                    overflow-hidden transition-all duration-300 ease-out
                    ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
                `}
            >
                {/* Order Status details */}
                <div
                    className={`mt-4 mb-4 flex items-center justify-between px-4 py-2 rounded-lg ${ui.bg} ${ui.color}`}
                >
                    <div className="flex items-center gap-2">
                        <span>{ui.icon}</span>
                        <span className="text-sm font-medium">{ui.label}</span>
                    </div>

                    {ui.showExpectedDate && (
                        <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                            ⏱️
                            <span>Expected ship date:</span>
                            <span className="font-medium text-[var(--color-text)]">
                                {expectedShipDate.toLocaleDateString()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Items */}
                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.productId}
                            className="flex items-center gap-4 py-4 border-b border-[var(--color-border)] last:border-none"
                        >
                            <img
                                src={item.imageUrl || IMAGE_PLACEHOLDER}
                                alt={item.productName}
                                className="w-16 h-16 rounded-lg object-cover shadow-sm"
                            />

                            <div className="flex flex-col flex-1">
                                <p className="text-sm font-semibold text-[var(--color-text)]">
                                    {item.productName}
                                </p>

                                <p className="text-xs text-[var(--color-text-muted)]">
                                    {item.price.toFixed(2)} kr / st
                                </p>

                                <p className="text-xs text-[var(--color-text-muted)]">
                                    Qty: {item.quantity}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-sm font-semibold text-[var(--color-text)]">
                                    {(item.price * item.quantity).toFixed(2)} kr
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Summary */}
                    <div className="pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-[var(--color-text-muted)]">
                            <span>Subtotal</span>
                            <span>{subtotal.toFixed(2)} kr</span>
                        </div>

                        <div className="flex justify-between text-[var(--color-text-muted)]">
                            <span>VAT (25%)</span>
                            <span>{tax.toFixed(2)} kr</span>
                        </div>

                        <div className="flex justify-between text-[var(--color-text-muted)]">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? "Free" : `${shipping.toFixed(2)} kr`}</span>
                        </div>

                        <div className="flex justify-between font-semibold text-[var(--color-text)] text-base pt-3 border-t border-[var(--color-border)]">
                            <span>Total</span>
                            <span>{total.toFixed(2)} kr</span>
                        </div>
                    </div>

                    {/* Cancel order button */}
                    <button
                        disabled
                        onClick={() => onCancel(order.id)}
                        className="mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                    >
                        ✖️ Cancel order DUMMY BUTTON
                    </button>
                </div>
            </div>
        </div>
    );
}
