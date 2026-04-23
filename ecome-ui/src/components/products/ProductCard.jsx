export default function ProductCard() {
    return (
        <div className="space-y-2 group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg">
                <img
                    src="https://via.placeholder.com/400"
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    NEW
                </span>
            </div>

            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">Product Name</h3>

            <p className="text-sm text-gray-600 dark:text-gray-400">$599.00</p>
        </div>
    );
}
