import { getActiveOrders } from "@api/orderApi";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import { useEffect, useState } from "react";
import ProfileOrderCard from "./ProfileOrderCard";

export default function ProfileActiveOrders() {
    const { accessToken } = useAuth();
    const { setLoading, showError } = useUI();

    const [orders, setOrders] = useState([]);
    const [openOrderId, setOpenOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getActiveOrders(accessToken);
                setOrders(data || []);
            } catch (err) {
                showError("Failed to load active orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [accessToken]);

    if (orders.length === 0) {
        return (
            <div className="p-6 rounded-xl shadow-sm border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]">
                <p>You have no active orders</p>
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
                />
            ))}
        </div>
    );
}
