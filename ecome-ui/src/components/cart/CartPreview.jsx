export default function CartPreview({ title, items, total }) {
    return (
        <div className="w-full border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] p-4">
            {/* Titel + total */}
            <div className="flex justify-between items-center pb-3 mb-4 border-b-4 border-[var(--color-border)]">
                <h4 className="font-semibold text-[var(--color-text)]">{title}</h4>
                <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                    ${total.toFixed(2)}
                </span>
            </div>

            {/* Items */}
            {items.length === 0 ? (
                <p className="text-[var(--color-text-muted)] text-sm">Empty</p>
            ) : (
                <div className="divide-y divide-[var(--color-border)]">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-1.5">
                            <img
                                src={item.imageUrl}
                                alt={item.productName}
                                className="w-12 h-12 rounded object-cover"
                            />

                            <div className="flex flex-col flex-1 leading-tight">
                                <p className="text-sm font-medium">{item.productName}</p>
                                <p className="text-xs text-[var(--color-text-muted)]">
                                    ${item.unitPrice.toFixed(2)}
                                </p>
                            </div>

                            <span className="text-sm font-semibold text-[var(--color-text)]">
                                × {item.quantity}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
