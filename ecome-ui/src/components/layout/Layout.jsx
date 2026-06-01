import { useAuth } from "@context/AuthContext";
import SessionWarningPopup from "@ui/system/SessionWarningPopup";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }) {
    const { showSessionWarning, extendSession, declineSession, countdown, remember, setRemember } =
        useAuth();

    const [forceShowPopup, setForceShowPopup] = useState(false);

    // When the popup opens via sessionTimers enable override
    useEffect(() => {
        if (showSessionWarning) {
            setForceShowPopup(true);
        }
    }, [showSessionWarning]);

    const handleStay = () => {
        setForceShowPopup(false);
        extendSession();
    };

    const handleLogout = () => {
        setForceShowPopup(false);
        declineSession();
    };

    return (
        <div className="flex flex-col min-h-screen bg-sky-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Global session timeout popup */}

            {(showSessionWarning || forceShowPopup) && (
                <SessionWarningPopup
                    onStay={handleStay}
                    onLogout={handleLogout}
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
