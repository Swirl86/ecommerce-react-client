import { EditProfileForm } from "@components/profile";
import { Link } from "react-router-dom";

export default function ProfileInfo({ data, isEditing, onEdit, onCancel, refetch, refresh }) {
    return (
        <div className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl shadow-sm p-6">
            {/* VIEW MODE */}
            {!isEditing && (
                <div className="animate-fadeInSoft">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-[var(--color-text)]">
                            Personal Information
                        </h2>

                        <button
                            onClick={onEdit}
                            className="text-[var(--color-primary-dark)] hover:underline"
                        >
                            Edit
                        </button>
                    </div>

                    <div className="space-y-2">
                        <p>
                            <strong>Name:</strong> {data.name || "Not provided"}
                        </p>
                        <p>
                            <strong>Email:</strong> {data.email}
                        </p>
                        <p>
                            <strong>Phone:</strong> {data.phone || "Not provided"}
                        </p>

                        {data.activeOrders?.length > 0 && (
                            <p>
                                <strong>Active order:</strong>{" "}
                                <Link
                                    to={`/orders/${data.activeOrders[0].id}`}
                                    className="text-[var(--color-primary-dark)] hover:underline"
                                >
                                    View active order
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* EDIT MODE */}
            {isEditing && (
                <div className="flex flex-col gap-4 animate-fadeInScale">
                    <EditProfileForm
                        data={data}
                        onCancel={onCancel}
                        refetch={refetch}
                        refresh={refresh}
                    />
                </div>
            )}
        </div>
    );
}
