import PageContainer from "@components/layout/PageContainer";

export default function CheckoutConfirmationPage() {
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
                    <p className="text-xl font-semibold text-[var(--color-text)]">—</p>
                </div>
            </div>
        </PageContainer>
    );
}
