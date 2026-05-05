import { useAuth } from "@context/AuthContext";
import { useBackendBadge } from "@hooks/useBackendBadge";
import { useBackendStatus } from "@hooks/useBackendStatus";
import SessionWarningPopup from "@ui/system/SessionWarningPopup";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }) {
    const { showSessionWarning, extendSession, declineSession, countdown, remember, setRemember } =
        useAuth();

    const { online } = useBackendStatus();
    useBackendBadge(online);

    return (
        <div className="flex flex-col min-h-screen bg-sky-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Global session timeout popup */}

            {showSessionWarning && (
                <SessionWarningPopup
                    onStay={extendSession}
                    onLogout={declineSession}
                    countdown={countdown}
                    remember={remember}
                    setRemember={setRemember}
                />
            )}

            <Navbar />

            <main className="flex-1">{children}</main>

            <Footer />
        </div>
    );
}
