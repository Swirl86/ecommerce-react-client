export default function FormButtons({
    onCancel,
    submitLabel = "Save",
    cancelLabel = "Cancel",
    extraButtons = null,
    disabled = false,
}) {
    return (
        <div className="flex gap-3 items-center">
            <button
                type="submit"
                disabled={disabled}
                className={`px-4 py-2 rounded-md text-white transition
                    ${
                        disabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
                    }`}
            >
                {submitLabel}
            </button>

            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition"
            >
                {cancelLabel}
            </button>

            {extraButtons}
        </div>
    );
}
