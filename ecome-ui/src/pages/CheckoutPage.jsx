import CheckoutAddressForm from "@components/checkout/CheckoutAddressForm";
import CheckoutOrderSummary from "@components/checkout/CheckoutOrderSummary";
import CheckoutSubmitButton from "@components/checkout/CheckoutSubmitButton";
import PageContainer from "@components/layout/PageContainer";
import { H2 } from "@typography";

export default function CheckoutPage() {
    return (
        <PageContainer>
            <div className="max-w-6xl mx-auto animate-fadeIn">
                <div className="text-center mb-6">
                    <H2>Checkout</H2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left side: Address */}
                    <div className="lg:col-span-2 space-y-6">
                        <CheckoutAddressForm />
                    </div>

                    {/* Right side: Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        <CheckoutOrderSummary />
                        <CheckoutSubmitButton />
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
