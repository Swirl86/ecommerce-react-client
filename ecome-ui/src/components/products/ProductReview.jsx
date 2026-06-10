import { H3 } from "@typography";
import StarRating from "@ui/StarRating";
import { useState } from "react";

export default function ProductReview({ reviews, rating }) {
    const [showReviews, setShowReviews] = useState(false);

    return (
        <div className="border-t border-gray-300 dark:border-gray-700 pt-6 mt-10">
            {/* Header */}
            <button
                onClick={() => setShowReviews((prev) => !prev)}
                className="flex justify-between items-center w-full text-left group"
            >
                <H3 className="m-0">Reviews</H3>
                <span className="text-gray-500 group-hover:text-gray-700 transition">
                    {showReviews ? "▲" : "▼"}
                </span>
            </button>

            {showReviews && (
                <div className="mt-8 animate-fadeIn">
                    {/* SUMMARY */}
                    <div
                        className="
                            max-w-4xl mx-auto w-full
                            flex flex-col sm:flex-row gap-10
                            p-6 rounded-xl
                            bg-gray-50 dark:bg-gray-800
                            border border-gray-200 dark:border-gray-700
                            shadow-sm
                        "
                    >
                        {/* Left: Average */}
                        <div className="flex flex-col items-center sm:items-start">
                            <div className="text-5xl font-bold">{rating.toFixed(1)}</div>
                            <StarRating rating={rating} />
                            <div className="text-sm text-gray-500 mt-1">
                                Based on {reviews.length} reviews
                            </div>
                        </div>

                        {/* Right: Distribution */}
                        <div className="flex-1 space-y-3">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = reviews.filter((r) => r.rating === star).length;
                                const percent = (count / reviews.length) * 100;

                                return (
                                    <div key={star} className="flex items-center gap-3">
                                        <span className="w-6 text-sm font-medium">{star}★</span>

                                        <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-500 rounded-full transition-all"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>

                                        <span className="w-6 text-sm text-gray-500 text-right">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* REVIEWS LIST */}
                    <div className="mt-10 space-y-10">
                        {reviews.map((r) => (
                            <div
                                key={r.id}
                                className="
                                    max-w-2xl mx-auto
                                    p-6 rounded-xl
                                    border border-gray-200 dark:border-gray-700
                                    bg-white dark:bg-gray-900
                                    shadow-md hover:shadow-lg transition
                                "
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <StarRating rating={r.rating} />
                                        <span className="text-sm text-gray-500">{r.rating}/5</span>
                                    </div>

                                    <span className="text-xs text-gray-400">
                                        {new Date(r.createdAt).toLocaleDateString()}
                                        {r.lastEditedAt && (
                                            <span className="italic ml-1 text-gray-500">
                                                (edited)
                                            </span>
                                        )}
                                    </span>
                                </div>

                                {/* Comment */}
                                {r.comment && (
                                    <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {r.comment}
                                    </p>
                                )}

                                {/* User */}
                                <p className="text-xs text-gray-500 mt-3">— {r.user}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
