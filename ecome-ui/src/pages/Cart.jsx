import CartItems from "@components/cart/CartItems";
import OrderSummary from "@components/cart/OrderSummary";
import { useCart } from "@hooks/cart/useCart";
import PageContainer from "@layout/PageContainer";
import { H2 } from "@typography";

export default function Cart() {
    const { cart, updateQuantity, deleteItem, clear } = useCart();

    return (
        <PageContainer>
            <div className="max-w-6xl mx-auto animate-fadeIn">
                <div className="text-center mb-6">
                    <H2>Your Shopping Cart</H2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <CartItems
                            items={cart}
                            onUpdateQuantity={updateQuantity}
                            onDelete={deleteItem}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <OrderSummary items={cart} />
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button
                        onClick={clear}
                        className="px-5 py-2.5 bg-red-600 text-white rounded-lg shadow-sm 
                                   hover:bg-red-700 transition font-medium"
                    >
                        Empty cart
                    </button>
                </div>
            </div>
        </PageContainer>
    );
}
