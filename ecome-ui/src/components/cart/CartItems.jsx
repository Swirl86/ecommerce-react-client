import { IMAGE_PLACEHOLDER } from "@config/constants";
import { H3, Muted } from "@typography";
import QuantitySelector from "@ui/QuantitySelector";

export default function CartItems() {
    // TODO change to real data
    const items = [
        {
            id: 1,
            name: "Plaid Shirt & Buttoned Skirt Set",
            price: 39.99,
            quantity: 1,
            image: IMAGE_PLACEHOLDER,
            color: "Olive / Multi",
            size: "S",
        },
        {
            id: 2,
            name: "Soft Knit Hoodie",
            price: 29.99,
            quantity: 2,
            image: IMAGE_PLACEHOLDER,
            color: "Cream",
            size: "M",
        },
    ];

    return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-8">
            <div className="space-y-6">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="
                            flex flex-col sm:flex-row
                            gap-4 sm:gap-6
                            p-4
                            border border-[var(--color-border)]
                            rounded-xl
                            bg-[var(--color-surface-alt)]
                        "
                    >
                        {/* IMAGE */}
                        <div className="sm:shrink-0">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="
                w-full h-48
                sm:w-32 sm:h-32
                object-cover rounded-lg
            "
                            />
                        </div>

                        {/* TEXT + CONTROLS */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <H3>{item.name}</H3>
                                <Muted className="text-sm">
                                    {item.color} — Size {item.size}
                                </Muted>
                            </div>

                            <div className="flex items-center gap-4 mt-3">
                                <QuantitySelector value={item.quantity} onChange={() => {}} />

                                <button
                                    type="button"
                                    className="
                                        flex items-center justify-center
                                        w-9 h-9
                                        rounded-md
                                        bg-red-600 text-white
                                        border border-red-700
                                        shadow-sm transition-all
                                        hover:bg-red-700 hover:border-red-800 hover:shadow-lg
                                        active:bg-red-800 active:shadow-none
                                        focus:bg-red-700
                                    "
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M9 3.75A1.75 1.75 0 0 1 10.75 2h2.5A1.75 1.75 0 0 1 15 3.75V5h4.25a.75.75 0 0 1 0 1.5H4.75a.75.75 0 0 1 0-1.5H9V3.75ZM6.75 8.5h10.5l-.7 10.08a2.25 2.25 0 0 1-2.24 2.17H9.69a2.25 2.25 0 0 1-2.24-2.17L6.75 8.5Zm3.75 2.75a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Zm4.5 0a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="text-left sm:text-right font-medium text-lg mt-3 sm:mt-0">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
