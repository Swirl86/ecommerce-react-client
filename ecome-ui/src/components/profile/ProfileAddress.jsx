import EditAddressForm from "./EditAddressForm";

export default function ProfileAddress({ data, isEditing, onEdit, onCancel, refetch }) {
    return (
        <div className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl shadow-sm p-6">
            {/* VIEW MODE */}
            {!isEditing && (
                <div className="animate-fadeInSoft">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-[var(--color-text)]">Address</h2>

                        <button
                            onClick={onEdit}
                            className="text-[var(--color-primary-dark)] hover:underline"
                        >
                            Edit
                        </button>
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
                        <p className="text-[var(--color-text-muted)] italic">
                            No address saved yet.
                        </p>
                    )}
                </div>
            )}

            {/* EDIT MODE */}
            {isEditing && (
                <div className="flex flex-col gap-4 animate-fadeInScale">
                    <EditAddressForm address={data.address} onCancel={onCancel} refetch={refetch} />
                </div>
            )}
        </div>
    );
}
