export default function Footer() {
    return (
        <footer className="border-t bg-neutral-50 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300 mt-10">
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Categories
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-400">
                        <li>Apparels</li>
                        <li>Accessories</li>
                        <li>Houseware</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Partners
                    </h3>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-400">
                        <li>Partner 1</li>
                        <li>Partner 2</li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Contact us
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-400">Blekinge, Sweden</p>
                    <p className="text-sm text-gray-700 dark:text-gray-400">+46 123 456 789</p>
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                        info@ecome.dummyemail.com
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                        Subscribe to newsletter
                    </h3>
                    <input
                        type="email"
                        placeholder="Your email"
                        className="border px-3 py-2 rounded w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                </div>
            </div>

            <div className="text-center py-4 text-xs text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} E‑ComE. All rights reserved.
            </div>
        </footer>
    );
}
