import { useCheckout } from "@hooks/checkout/useCheckout";

export default function CheckoutSubmitButton({ disabled }) {
    const { placeOrder } = useCheckout();

    return (
        <button
            onClick={placeOrder}
            disabled={disabled}
            className={`
                w-full py-3 rounded-lg font-medium
                bg-[var(--color-primary)]
                text-[var(--color-text)]
                hover:bg-[var(--color-primary-dark)]
                transition
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
        >
            {disabled ? "Need shipping information" : "Continue to payment"}
        </button>
    );
}
