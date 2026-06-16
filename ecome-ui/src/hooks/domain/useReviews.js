import { getAverageRating, getReviews } from "@api/reviewsApi";
import { API_BASE_URL } from "@config/api";
import { useCachedFetch } from "@hooks/system/useCachedFetch";

export function useReviews(productId) {
    const reviewsUrl = `${API_BASE_URL}/products/${productId}/reviews`;
    const ratingUrl = `${API_BASE_URL}/products/${productId}/reviews/average`;

    const {
        data: reviews,
        loading: loadingReviews,
        error: errorReviews,
    } = useCachedFetch(reviewsUrl, {
        fetcher: () => getReviews(productId),
    });

    const {
        data: rating,
        loading: loadingRating,
        error: errorRating,
    } = useCachedFetch(ratingUrl, {
        fetcher: () => getAverageRating(productId),
    });

    return {
        reviews: reviews || [],
        rating: rating || 0,
        loading: loadingReviews || loadingRating,
        error: errorReviews || errorRating,
    };
}
