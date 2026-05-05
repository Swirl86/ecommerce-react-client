import { useUI } from "@context/UIContext";

export default function SystemMessage() {
    const { message } = useUI();

    if (!message) return null;

    const base =
        "fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-fade-in";

    const styles = {
        error: "bg-red-600",
        success: "bg-green-600",
        info: "bg-blue-600",
    };

    return <div className={`${base} ${styles[message.type]}`}>{message.text}</div>;
}
