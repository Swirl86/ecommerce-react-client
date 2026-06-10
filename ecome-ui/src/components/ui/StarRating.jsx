export default function StarRating({ rating }) {
    if (!rating || rating <= 0) return null;

    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
        <div className="flex justify-center gap-0.5 mt-1">
            {"★".repeat(fullStars).split("").map((s, i) => (
                <span key={`full-${i}`} className="text-yellow-500">★</span>
            ))}

            {hasHalf && (
                <span className="text-yellow-500/50">★</span>
            )}

            {"☆".repeat(emptyStars).split("").map((s, i) => (
                <span key={`empty-${i}`} className="text-gray-300 dark:text-gray-600">☆</span>
            ))}
        </div>
    );
}
