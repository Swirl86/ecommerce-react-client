import { useUI } from "@context/UIContext";

export default function BackendStatusBadge() {
    const { backendOffline, backendRestored } = useUI();

    if (!backendOffline && !backendRestored) return null;

    const text = backendOffline ? "Backend offline ⚠️" : "Connection restored ✓";

    const color = backendOffline ? "bg-rose-600/90 animate-pulse" : "bg-green-600";

    const isVisible = backendOffline || backendRestored;

    return (
        <div
            className={`
            fixed top-16 left-1/2 -translate-x-1/2
            z-[9999]
            text-xs px-3 py-1 rounded-md shadow-md
            text-white whitespace-nowrap pointer-events-none
            transition-all duration-500 ease-out
            ${color}
            ${backendOffline || backendRestored ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
        >
            {text}
        </div>
    );
}
