import { H3, Muted } from "../typography";

export default function ProductCard() {
    return (
        <div className="space-y-2 group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <img
                    src="https://via.placeholder.com/400"
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <span className="absolute top-2 left-2 bg-rose-200 text-rose-800 dark:bg-rose-500 dark:text-white text-xs px-2 py-1 rounded">
                    NEW
                </span>
            </div>

            {/* Produktnamn */}
            <H3>Product Name</H3>

            {/* Pris */}
            <Muted>$599.00</Muted>
        </div>
    );
}
