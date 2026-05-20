import CartItems from "@components/cart/CartItems";
import OrderSummary from "@components/cart/OrderSummary";
import PageContainer from "@layout/PageContainer";
import { H2 } from "@typography";

export default function Cart() {
    // TODO change to real data
    return (
        <PageContainer>
            <div className="max-w-6xl mx-auto animate-fadeIn">
                <div class="text-center mb-6">
                    <H2>Your Shopping Cart</H2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <CartItems />
                    </div>

                    <div className="lg:col-span-1">
                        <OrderSummary />
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
