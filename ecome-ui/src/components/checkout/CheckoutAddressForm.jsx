import InputField from "@ui/InputField";

export default function CheckoutAddressForm() {
    return (
        <div className="p-6 rounded-xl shadow-sm border border-[var(--color-border)] bg-[var(--color-surface)]">
            <h2 className="text-xl font-semibold mb-6 text-[var(--color-text)]">
                Shipping Address
            </h2>

            <div className="space-y-5">
                <InputField label="Full Name" placeholder="John Doe" disabled />

                <InputField label="Address" placeholder="Street 123" disabled />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="City" placeholder="City" disabled />

                    <InputField label="ZIP" placeholder="12345" disabled />
                </div>

                <InputField label="Country" placeholder="Sweden" disabled />
            </div>
        </div>
    );
}
