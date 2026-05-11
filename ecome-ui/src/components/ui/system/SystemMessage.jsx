import { useUI } from "@context/UIContext";

export default function SystemMessage() {
    const { message } = useUI();

    if (!message) return null;

    const styles = {
        error: "bg-red-600",
        success: "bg-green-600",
        info: "bg-blue-600",
    };

    return (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
            <div
                className={`
                    pointer-events-auto
                    px-6 py-3 rounded-lg shadow-lg text-white font-medium
                    animate-fadeInMessage
                    ${styles[message.type]}
                `}
            >
                {message.text}
            </div>
        </div>
    );
}
