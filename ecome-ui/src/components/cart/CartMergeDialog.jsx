import { H3 } from "@typography";
import CartPreview from "./CartPreview";

export default function CartMergeDialog({ oldCart, latestCart, onChoose }) {
    const oldTotal = oldCart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const latestTotal = latestCart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div
                className="
                    w-full max-w-xl
                    p-5 rounded-xl shadow-2xl
                    animate-fadeInScale
                    bg-[var(--color-surface-alt)]
                    text-[var(--color-text)]
                    max-h-[90vh] overflow-y-auto
                    space-y-4
                "
            >
                <H3 className="mb-4">Choose your cart</H3>

                <p className="text-sm text-[var(--color-text-muted)] mb-6">
                    You have items in both your old cart and your latest cart. Select which one you
                    want to use.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CartPreview title="Old cart" items={oldCart} total={oldTotal} />
                    <CartPreview title="Latest cart" items={latestCart} total={latestTotal} />
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-6">
                    <button
                        onClick={() => onChoose("old")}
                        className="
                            px-4 py-2 rounded-lg transition font-medium
                            bg-blue-600 hover:bg-blue-700 text-white
                            shadow-sm active:scale-[0.98]
                        "
                    >
                        Use old cart
                    </button>

                    <button
                        onClick={() => onChoose("latest")}
                        className="
                            px-4 py-2 rounded-lg transition font-medium
                            bg-green-600 hover:bg-green-700 text-white
                            shadow-sm active:scale-[0.98]
                        "
                    >
                        Use latest cart
                    </button>

                    <button
                        onClick={() => onChoose("merge")}
                        className="
                            px-4 py-2 rounded-lg transition font-medium
                            bg-gray-700 hover:bg-gray-800 text-white
                            shadow-sm active:scale-[0.98]
                        "
                    >
                        Merge both
                    </button>
                </div>
            </div>
        </div>
    );
}
