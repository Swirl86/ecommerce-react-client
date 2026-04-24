import { Body, H1, Muted } from "../components/typography";

export default function Home() {
    return (
        <div>
            {/* Hero section */}
            <section className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="mb-6">
                    <H1>Welcome to E‑ComE</H1>
                </div>

                <div className="max-w-2xl mx-auto mb-10">
                    <Body>
                        Discover quality apparel, curated styles, and a seamless shopping
                        experience.
                    </Body>
                </div>

                <a
                    href="/products"
                    className="inline-block bg-sky-300 text-gray-900
                               hover:bg-sky-400 dark:bg-sky-500 dark:text-white
                               px-8 py-3 rounded-lg text-sm font-medium transition"
                >
                    Shop Now
                </a>
            </section>

            {/* Future sections */}
            <section className="max-w-7xl mx-auto px-4 py-16 text-center">
                <Muted>More content coming soon — featured products, categories, and news.</Muted>
            </section>
        </div>
    );
}
