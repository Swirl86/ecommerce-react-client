import { getOrderHistory } from "@api/orderApi";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import { useEffect, useState } from "react";
import ProfileOrderCard from "./ProfileOrderCard";

export default function ProfileOrderHistory() {
    const { accessToken } = useAuth();
    const { setLoading, showError } = useUI();

    const [orders, setOrders] = useState([]);
    const [openOrderId, setOpenOrderId] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const size = 5;

    const loadPage = async (pageToLoad) => {
        try {
            setLoading(true);
            const data = await getOrderHistory(accessToken, pageToLoad, size);

            setOrders(data?.content || []);
            setTotalPages(data?.totalPages || 1);
        } catch (err) {
            showError("Failed to load order history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPage(0);
    }, [accessToken]);

    const handleNext = () => {
        if (page + 1 < totalPages) {
            const next = page + 1;
            setPage(next);
            loadPage(next);
        }
    };

    const handlePrev = () => {
        if (page > 0) {
            const prev = page - 1;
            setPage(prev);
            loadPage(prev);
        }
    };

    if (orders.length === 0) {
        return (
            <div className="p-6 rounded-xl shadow-sm border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]">
                <p>You have no past orders</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <ProfileOrderCard
                    key={order.id}
                    order={order}
                    isOpen={openOrderId === order.id}
                    onToggle={() => setOpenOrderId(openOrderId === order.id ? null : order.id)}
                    showCancelButton={false} // Don't show cancel button for past orders
                />
            ))}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-4">
                <button
                    onClick={handlePrev}
                    disabled={page === 0}
                    className={`px-4 py-2 rounded-lg border ${
                        page === 0
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-[var(--color-surface-hover)]"
                    }`}
                >
                    Previous
                </button>

                <span className="text-[var(--color-text-muted)]">
                    Page {page + 1} of {totalPages}
                </span>

                <button
                    onClick={handleNext}
                    disabled={page + 1 >= totalPages}
                    className={`px-4 py-2 rounded-lg border ${
                        page + 1 >= totalPages
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-[var(--color-surface-hover)]"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
