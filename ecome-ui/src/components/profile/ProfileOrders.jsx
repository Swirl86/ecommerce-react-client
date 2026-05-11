export default function ProfileOrders() {
    return (
        <div className="animate-fadeIn bg-[var(--color-surface-alt)] dark:bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">Order History</h2>
            <p className="text-[var(--color-text-muted)] italic">
                Your past orders will appear here.
            </p>
        </div>
    );
}
