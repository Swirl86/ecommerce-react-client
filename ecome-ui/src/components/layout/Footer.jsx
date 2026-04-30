export default function Footer() {
    return (
        <footer className="border-t bg-neutral-50 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
            <div
                className="
                    max-w-7xl mx-auto px-4
                    pt-8 pb-4
                    lg:pt-12 lg:pb-6
                    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
                    gap-8 lg:gap-12
                "
            >
                {/* Frequently Asked Questions */}
                <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Frequently Asked Questions
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-400">
                        <li>Orders</li>
                        <li>Returns</li>
                        <li>Offers</li>
                        <li>Membership</li>
                    </ul>
                </div>

                {/* Help & Information */}
                <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Help & Information
                    </h3>

                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-400">
                        <li>Membership Terms</li>
                        <li>Purchase Terms</li>
                        <li>Privacy Policy</li>
                        <li>Campaign Reservations</li>
                        <li>Product Recalls</li>
                    </ul>
                </div>

                {/* About + Contact */}
                <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">About</h3>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-400">
                        <li>About E‑ComE</li>
                        <li>Sustainability</li>
                        <li>Cookies</li>
                    </ul>

                    <h3 className="font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100">
                        Contact Us
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-400">
                        <li>Blekinge, Sweden</li>
                        <li>+46 123 456 789</li>
                        <li>info@ecome.dummyemail.com</li>
                    </ul>
                </div>

                {/* Membership + Newsletter */}
                <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Become a Member
                    </h3>

                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-400 mb-4">
                        <li>✓ 10% off your first purchase</li>
                        <li>✓ Bonus on all purchases</li>
                        <li>✓ Bonus checks</li>
                        <li>✓ Personal & unique member offers</li>
                    </ul>

                    <button
                        className="
                            w-full py-2 mb-6
                            bg-sky-600 hover:bg-sky-700
                            text-white rounded-lg
                            transition
                        "
                    >
                        Join Now
                    </button>

                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Subscribe to Newsletter
                    </h3>
                    <input
                        type="email"
                        placeholder="Your email"
                        className="
                            border px-3 py-2 rounded w-full
                            bg-white dark:bg-gray-900
                            border-gray-300 dark:border-gray-600
                            text-gray-900 dark:text-gray-100
                            focus:ring-2 focus:ring-sky-500 focus:border-sky-500
                            transition
                        "
                    />
                </div>
            </div>

            <div className="text-center py-4 text-xs text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} E‑ComE. All rights reserved.
            </div>
        </footer>
    );
}
