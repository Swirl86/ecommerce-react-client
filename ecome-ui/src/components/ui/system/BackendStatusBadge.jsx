import { useUI } from "@context/UIContext";

export default function BackendStatusBadge() {
    const { backendOffline, backendRestored } = useUI();

    const isVisible = backendOffline || backendRestored;

    const text = backendOffline ? "Backend offline ⚠️" : "Connection restored ✓";

    const color = backendOffline ? "bg-rose-600/90 animate-pulse" : "bg-green-600";

    return (
        <div
            className={`
                fixed top-8 left-6 
                z-[9999]
                text-xs px-3 py-1 rounded-md shadow-md
                text-white whitespace-nowrap pointer-events-none
                transition-all duration-500 ease-out
                ${color}
                ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
            `}
        >
            {text}
        </div>
    );
}
