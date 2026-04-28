// components/ui/QuantitySelector.jsx
export default function QuantitySelector({ value, onChange }) {
    return (
        <div className="flex items-center gap-3 mt-2">
            <button
                onClick={() => onChange(Math.max(1, value - 1))}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
                -
            </button>

            <span className="text-lg">{value}</span>

            <button
                onClick={() => onChange(value + 1)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
                +
            </button>
        </div>
    );
}
