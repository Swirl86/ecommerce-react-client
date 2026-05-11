export default function ProfileHeader({ data }) {
    return (
        <div className="bg-[var(--color-surface-alt)] dark:bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl shadow-sm p-8 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-[var(--color-sky)] dark:bg-gray-700 flex items-center justify-center text-4xl text-white">
                👤
            </div>

            <div>
                <h1 className="text-3xl font-bold text-[var(--color-text)]">
                    {data.name || "Unnamed User"}
                </h1>
                <p className="text-[var(--color-text-muted)]">{data.email}</p>
            </div>
        </div>
    );
}
