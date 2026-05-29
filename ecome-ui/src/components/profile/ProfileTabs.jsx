export default function ProfileTabs({ activeTab, setActiveTab }) {
    const tabs = [
        { id: "profile", label: "Profile" },
        { id: "wishlist", label: "Wishlist" },
        { id: "activeOrders", label: "Active Orders" },
        { id: "orders", label: "Order History" },
    ];

    return (
        <div className="bg-[var(--color-surface)] dark:bg-gray-800 border border-[var(--color-border)] rounded-xl shadow-sm top-20 z-20">
            <div className="flex gap-8 px-6 pt-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 text-lg font-medium relative transition
                            ${
                                activeTab === tab.id
                                    ? "text-[var(--color-primary-dark)]"
                                    : "text-[var(--color-text-muted)] hover:text-[var(--color-primary-dark)]"
                            }
                        `}
                    >
                        {tab.label}
                        <span
                            className={`absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[var(--color-primary-dark)] transition-all duration-300
                                ${activeTab === tab.id ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}
                            `}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
