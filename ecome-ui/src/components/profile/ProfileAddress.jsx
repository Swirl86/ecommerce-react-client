export default function ProfileAddress({ data }) {
    return (
        <div className="bg-[var(--color-surface-alt)] dark:bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[var(--color-text)]">Address</h2>
                <button className="text-[var(--color-primary-dark)] hover:underline">Edit</button>
            </div>

            {data.address ? (
                <div className="space-y-1">
                    <p>{data.address.street}</p>
                    <p>
                        {data.address.postalCode} {data.address.city}
                    </p>
                    <p>{data.address.country}</p>
                </div>
            ) : (
                <p className="text-[var(--color-text-muted)] italic">No address saved yet.</p>
            )}
        </div>
    );
}
