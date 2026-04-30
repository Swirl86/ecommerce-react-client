export default function SkeletonCard() {
    return (
        <div
            className="
                border border-gray-200 dark:border-gray-700
                rounded-xl p-4
                bg-white dark:bg-gray-800
                shadow-sm
                animate-pulse
            "
        >
            {/* Image skeleton */}
            <div
                className="
                    w-full 
                    h-40 sm:h-48 md:h-56
                    bg-gray-200 dark:bg-gray-700
                    rounded-lg mb-4
                "
            ></div>

            {/* Text skeleton */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
    );
}
