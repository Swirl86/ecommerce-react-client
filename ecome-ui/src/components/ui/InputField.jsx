import { useState } from "react";

export default function InputField({
    label,
    type = "text",
    value,
    onChange,
    onBlur,
    error,
    placeholder = "",
    icon,
    iconAction,
}) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-medium text-[var(--color-text)]">{label}</label>
            )}

            <div className="relative">
                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`
                        w-full p-3 pr-12 rounded-lg
                        border bg-[var(--color-bg)] text-[var(--color-text)]
                        transition-all duration-200
                        ${
                            error
                                ? `
                                    border-red-400
                                    focus:border-red-400
                                    focus:ring-2 focus:ring-red-400/40

                                    hover:border-red-500
                                    hover:bg-red-100/20 dark:hover:bg-red-900/20
                                `
                                : `
                                    border-[var(--color-border)]
                                    hover:border-[var(--color-primary)]
                                    hover:bg-[var(--color-sky)]/20
                                    focus:border-[var(--color-primary)]
                                    focus:ring-2 focus:ring-[var(--color-primary)]/50
                                `
                        }
                        focus:outline-none
                        focus-visible:outline-none
                        focus:ring-offset-0
                        focus:shadow-none
                        `}
                />

                {/* Password toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="
                            absolute right-3 top-1/2 -translate-y-1/2
                            text-[var(--color-text-muted)]
                            hover:text-[var(--color-primary-dark)]
                            transition material-symbols-outlined select-none
                        "
                        style={{ fontSize: "22px" }}
                    >
                        {showPassword ? "visibility_off" : "visibility"}
                    </button>
                )}

                {/* Custom icon */}
                {icon && !isPassword && (
                    <span
                        onClick={iconAction}
                        className="
                            absolute right-3 top-1/2 -translate-y-1/2
                            text-[var(--color-text-muted)]
                            hover:text-[var(--color-primary-dark)]
                            transition material-symbols-outlined select-none cursor-pointer
                        "
                        style={{ fontSize: "22px" }}
                    >
                        {icon}
                    </span>
                )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}
