import PageContainer from "@components/layout/PageContainer";
import { useOrder } from "@hooks/orders/useOrder";
import { useParams } from "react-router-dom";

export default function CheckoutConfirmationPage() {
    const { orderId } = useParams();
    const { order, loading } = useOrder(orderId);

    const isLoading = loading || !order;

    return (
        <PageContainer>
            <div className="max-w-3xl mx-auto py-16 px-4 text-center animate-fadeIn">
                <h1 className="text-3xl font-semibold mb-4 text-[var(--color-text)]">
                    Order Confirmed
                </h1>

                <p className="text-[var(--color-text-muted)] mb-10">
                    Thank you for your purchase! Your order has been placed successfully.
                </p>

                <div className="p-6 rounded-xl shadow-sm border border-[var(--color-border)] bg-[var(--color-surface)]">
                    <p className="text-sm text-[var(--color-text-muted)]">Order ID:</p>

                    <p className="text-xl font-semibold text-[var(--color-text)] mt-1">
                        {isLoading ? "Loading..." : `#${order.id}`}
                    </p>

                    {!isLoading && (
                        <div className="mt-6 text-left space-y-3">
                            <div className="flex justify-between text-[var(--color-text)]">
                                <span>Status:</span>
                                <span className="font-medium">{order.status}</span>
                            </div>

                            <div className="flex justify-between text-[var(--color-text)]">
                                <span>Total:</span>
                                <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
                            </div>

                            <div className="border-t border-[var(--color-border)] pt-4">
                                <h3 className="text-lg font-semibold mb-2 text-[var(--color-text)]">
                                    Items
                                </h3>

                                <ul className="space-y-2">
                                    {order.items.map((item) => (
                                        <li
                                            key={item.productId}
                                            className="flex justify-between text-[var(--color-text-muted)]"
                                        >
                                            <span>
                                                {item.productName} × {item.quantity}
                                            </span>
                                            <span>${item.price.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
