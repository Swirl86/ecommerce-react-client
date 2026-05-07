import { useUI } from "@context/UIContext";

export default function OfflineModeBadge() {
    const { offlineMode } = useUI();

    const isVisible = offlineMode;

    return (
        <div
            className={`
                fixed bottom-4 right-4
                bg-yellow-500 text-black px-4 py-2 rounded shadow-lg
                z-[9999]
                transition-all duration-500 ease-out
                ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
            `}
        >
            Offline mode active – showing cached data
        </div>
    );
}
