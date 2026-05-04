export default function CheckboxField({ label, checked, onChange }) {
    return (
        <label
            className="
                flex items-center gap-2 cursor-pointer select-none
                py-1
            "
        >
            <span
                className="
                    relative flex items-center justify-center
                    w-8 h-8
                "
            >
                {/* Custom checkbox */}
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {/* Checkbox visual */}
                <span
                    className="
                        w-5 h-5 rounded-md border border-[var(--color-border)]
                        bg-[var(--color-bg)]
                        transition-all duration-200

                        peer-hover:shadow-[0_0_0_4px_var(--color-primary)/25]
                        peer-hover:scale-110

                        peer-focus:outline-none
                        peer-focus:ring-2 peer-focus:ring-[var(--color-primary)]/50

                        peer-checked:bg-[var(--color-primary)]
                        peer-checked:border-[var(--color-primary)]
                    "
                ></span>

                {/* Animated checkmark */}
                <span
                    className="
                        absolute text-white dark:text-gray-900
                        text-sm font-bold
                        pointer-events-none

                        opacity-0 scale-50
                        transition-all duration-200

                        peer-checked:opacity-100
                        peer-checked:scale-100
                    "
                >
                    ✓
                </span>
            </span>

            <span className="text-[var(--color-text-muted)]">{label}</span>
        </label>
    );
}
