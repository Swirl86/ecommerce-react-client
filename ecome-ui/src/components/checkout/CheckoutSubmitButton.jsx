export default function CheckoutSubmitButton() {
    return (
        <button
            className="
                w-full py-3 rounded-lg font-medium
                bg-[var(--color-primary)]
                text-[var(--color-text)]
                hover:bg-[var(--color-primary-dark)]
                transition
                disabled:opacity-50 disabled:cursor-not-allowed
            "
            disabled
        >
            Place Order
        </button>
    );
}
