import CheckoutOrderSummary from "@components/checkout/CheckoutOrderSummary";
import CheckoutPaymentMethod from "@components/checkout/CheckoutPaymentMethod";
import CheckoutShippingInfoForm from "@components/checkout/CheckoutShippingInfoForm";
import CheckoutSubmitButton from "@components/checkout/CheckoutSubmitButton";
import PageContainer from "@components/layout/PageContainer";
import { useProfileData } from "@hooks/profile/useProfileData";
import { H2 } from "@typography";
import { isAddressComplete } from "@utils";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
    const { data: profile, loading, refetch, refresh } = useProfileData();
    const navigate = useNavigate();

    const address = profile?.address;
    const addressIsValid = isAddressComplete(address);

    return (
        <PageContainer>
            <div className="max-w-6xl mx-auto animate-fadeIn">
                <div className="text-center mb-6">
                    <H2>Checkout</H2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left side: Address */}
                    <div className="lg:col-span-2 space-y-6">
                        <CheckoutShippingInfoForm profile={profile} refetch={refetch} />
                    </div>

                    {/* Right side: Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        <CheckoutOrderSummary />
                        <CheckoutPaymentMethod /> {/* TODO IMPLEMENT */}
                        <CheckoutSubmitButton disabled={!addressIsValid} />
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
