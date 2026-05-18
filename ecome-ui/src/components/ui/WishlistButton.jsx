import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import { useWishlist } from "@hooks/wishlist/useWishlist";

export default function WishlistButton({ productId, variant = "icon" }) {
    const { accessToken } = useAuth();
    const { wishlist, toggle } = useWishlist();
    const { showInfo } = useUI();

    const isInWishlist = wishlist?.some((w) => w.productId === productId);
    const disabled = !accessToken;

    const handleClick = (e) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (disabled) {
            showInfo("You need to be logged in to manage a wishlist");
            return;
        }

        toggle(productId);
    };

    const variants = {
        icon: `
            absolute top-2 right-2 z-20
            text-xl
            transition-transform
            ${disabled ? "opacity-40 cursor-not-allowed" : "hover:scale-110"}
        `,

        floating: `
            absolute top-4 right-4 z-20
            p-2.5 rounded-full
            backdrop-blur-md bg-white/80 dark:bg-gray-800/70
            border border-gray-300 dark:border-gray-600
            shadow-md
            transition-transform
            ${disabled ? "opacity-40 cursor-not-allowed" : "hover:scale-110"}
        `,

        button: `
            px-4 py-3 rounded-lg flex items-center justify-center
            border transition
            ${
                disabled
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600"
                    : "bg-red-100 text-red-600 hover:bg-red-200 border-red-300 dark:border-red-500"
            }
        `,
    };

    // -------------------------------------------------------
    // Render
    // -------------------------------------------------------
    return (
        <button onClick={handleClick} className={variants[variant]}>
            <span className={variant === "button" ? "text-xl" : "text-2xl leading-none"}>
                {isInWishlist ? "❤️" : "🤍"}
            </span>
        </button>
    );
}
