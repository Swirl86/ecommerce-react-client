export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
    const decrease = () => onChange(Math.max(min, value - 1));
    const increase = () => onChange(Math.min(max, value + 1));

    return (
        <div className="flex items-center gap-3">
            <button
                aria-label="Decrease quantity"
                onClick={decrease}
                disabled={value <= min}
                className="
                    flex items-center justify-center
                    w-9 h-9
                    rounded-md
                    bg-gray-200 dark:bg-gray-700
                    hover:bg-gray-300 dark:hover:bg-gray-600
                    transition
                    disabled:opacity-50 disabled:cursor-not-allowed
                "
            >
                -
            </button>

            <span className="text-lg w-6 text-center">{value}</span>

            <button
                aria-label="Increase quantity"
                onClick={increase}
                disabled={value >= max}
                className="
                    flex items-center justify-center
                    w-9 h-9
                    rounded-md
                    bg-gray-200 dark:bg-gray-700
                    hover:bg-gray-300 dark:hover:bg-gray-600
                    transition
                    disabled:opacity-50 disabled:cursor-not-allowed
                "
            >
                +
            </button>
        </div>
    );
}
