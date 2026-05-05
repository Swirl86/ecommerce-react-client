import { useUI } from "../../../context/UIContext";

export default function LoadingOverlay() {
    const { loading } = useUI();

    if (!loading) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-white/40 border-t-white rounded-full animate-spin" />
        </div>
    );
}
