import PageContainer from "@layout/PageContainer";
import { H2, Muted } from "@typography";
import { Link } from "react-router-dom";

export default function EmptyCart() {
    return (
        <PageContainer>
            <div className="flex flex-col items-center justify-center text-center py-20 px-6 animate-fadeIn gap-6">
                {/* Illustration */}
                <img
                    src="/images/empty-cart.png"
                    alt="Empty cart illustration"
                    loading="lazy"
                    className="
                        w-64 h-64
                        opacity-95
                        transition-opacity duration-300
                        animate-[float_4s_ease-in-out_infinite]
                    "
                />

                <H2>Your cart is empty!</H2>

                <Muted className="max-w-sm leading-relaxed text-[var(--color-text-muted)]">
                    Looks like you haven’t added anything to your cart yet.
                </Muted>

                <Link
                    to="/products"
                    className="
                        inline-block px-8 py-3 rounded-lg text-sm font-medium transition
                        bg-sky-300 text-gray-900 hover:bg-sky-500
                        dark:bg-sky-500 dark:text-white dark:hover:bg-sky-600
                    "
                >
                    Browse products
                </Link>
            </div>
        </PageContainer>
    );
}
