export default function Home() {
    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Hero section */}
            <section className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    Welcome to E‑ComE
                </h1>

                <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    Discover quality apparel, curated styles, and a seamless shopping experience.
                </p>

                <a
                    href="/products"
                    className="inline-block bg-black dark:bg-white dark:text-black text-white px-8 py-3 rounded-md text-sm font-medium hover:opacity-80 transition"
                >
                    Shop Now
                </a>
            </section>

            {/* Future sections */}
            <section className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500 dark:text-gray-400">
                <p>More content coming soon — featured products, categories, and news.</p>
            </section>
        </div>
    );
}
