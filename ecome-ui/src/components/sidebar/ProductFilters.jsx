export default function ProductFilters() {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-200">Apparels</h3>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-400">
                    <li>Pants</li>
                    <li>Jumpsuits</li>
                    <li>Shorts</li>
                    <li>Tops</li>
                </ul>
            </div>

            <div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-200">Styles</h3>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-400">
                    <li>Bold</li>
                    <li>Monochrome</li>
                    <li>Neutrals</li>
                </ul>
            </div>

            <div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-200">Size</h3>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((size) => (
                        <button
                            key={size}
                            className="border px-3 py-1 rounded bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
