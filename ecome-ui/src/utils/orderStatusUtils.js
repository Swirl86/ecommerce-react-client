export const ORDER_STATUS_UI = {
    PENDING: {
        icon: "🕓",
        label: "Order received",
        bg: "bg-[var(--status-pending-bg)]",
        color: "text-[var(--status-pending-text)]",
        showExpectedDate: false,
        showCancel: true,
    },
    PROCESSING: {
        icon: "🚚",
        label: "Processing for shipment",
        bg: "bg-[var(--status-processing-bg)]",
        color: "text-[var(--status-processing-text)]",
        showExpectedDate: true,
        showCancel: true,
    },
    SHIPPED: {
        icon: "📦",
        label: "Shipped",
        bg: "bg-[var(--status-shipped-bg)]",
        color: "text-[var(--status-shipped-text)]",
        showExpectedDate: false,
        showCancel: false,
    },
    COMPLETED: {
        icon: "✅",
        label: "Delivered",
        bg: "bg-[var(--status-completed-bg)]",
        color: "text-[var(--status-completed-text)]",
        showExpectedDate: false,
        showCancel: false,
    },
    CANCELLED: {
        icon: "✖️",
        label: "Cancelled",
        bg: "bg-[var(--status-cancelled-bg)]",
        color: "text-[var(--status-cancelled-text)]",
        showExpectedDate: false,
        showCancel: false,
    },
    RETURN_REQUESTED: {
        icon: "↩️",
        label: "Return requested",
        bg: "bg-[var(--status-return-bg)]",
        color: "text-[var(--status-return-text)]",
        showExpectedDate: false,
        showCancel: false,
    },
    RETURNED: {
        icon: "📬",
        label: "Returned",
        bg: "bg-[var(--status-return-bg)]",
        color: "text-[var(--status-return-text)]",
        showExpectedDate: false,
        showCancel: false,
    },
    REFUNDED: {
        icon: "💸",
        label: "Refunded",
        bg: "bg-[var(--status-refunded-bg)]",
        color: "text-[var(--status-refunded-text)]",
        showExpectedDate: false,
        showCancel: false,
    },
};

export function getOrderStatusUI(status) {
    return ORDER_STATUS_UI[status] || ORDER_STATUS_UI.PENDING;
}
