import { Body, H3 } from "../typography";

export default function ProductFilters() {
    return (
        <div className="space-y-10">
            <div>
                <H3>Apparels</H3>
                <ul className="space-y-1 mt-3">
                    <Body>Pants</Body>
                    <Body>Jumpsuits</Body>
                    <Body>Shorts</Body>
                    <Body>Tops</Body>
                </ul>
            </div>

            <div>
                <H3>Styles</H3>
                <ul className="space-y-1 mt-3">
                    <Body>Bold</Body>
                    <Body>Monochrome</Body>
                    <Body>Neutrals</Body>
                </ul>
            </div>

            <div>
                <H3>Size</H3>
                <div className="flex gap-2 mt-3">
                    {[1, 2, 3, 4].map((size) => (
                        <button
                            key={size}
                            className="border px-3 py-1 rounded bg-white text-gray-900 
                                       hover:bg-sky-100 dark:hover:bg-gray-600
                                       dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100
                                       transition"
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
