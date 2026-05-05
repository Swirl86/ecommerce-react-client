import { SESSION_DURATION, WARNING_BEFORE } from "@config/constants";
import { useEffect, useRef, useState } from "react";

export function useSessionTimers(refreshToken, remember, refreshFn, logoutFn) {
    const [showSessionWarning, setShowSessionWarning] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const sessionTimeoutRef = useRef(null);
    const countdownIntervalRef = useRef(null);
    const extendingRef = useRef(false);

    const warningTime = SESSION_DURATION - WARNING_BEFORE;

    // SESSION WARNING TIMER
    useEffect(() => {
        if (extendingRef.current) return;

        const isSession = !remember;
        if (!isSession) return;

        clearTimeout(sessionTimeoutRef.current);

        sessionTimeoutRef.current = setTimeout(() => {
            setShowSessionWarning(true);
        }, warningTime);

        return () => clearTimeout(sessionTimeoutRef.current);
    }, [refreshToken, remember]);

    // COUNTDOWN
    useEffect(() => {
        if (!showSessionWarning) return;

        const seconds = Math.floor(WARNING_BEFORE / 1000);
        setCountdown(seconds);

        clearInterval(countdownIntervalRef.current);

        countdownIntervalRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (!showSessionWarning) {
                    clearInterval(countdownIntervalRef.current);
                    return prev;
                }

                if (prev <= 1) {
                    clearInterval(countdownIntervalRef.current);
                    logoutFn("countdown_zero");
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownIntervalRef.current);
    }, [showSessionWarning]);

    // EXTEND SESSION
    const extendSession = async () => {
        extendingRef.current = true;

        await refreshFn();
        setShowSessionWarning(false);

        clearTimeout(sessionTimeoutRef.current);
        clearInterval(countdownIntervalRef.current);

        sessionTimeoutRef.current = setTimeout(() => {
            setShowSessionWarning(true);
        }, warningTime);

        extendingRef.current = false;
    };

    const declineSession = () => logoutFn("decline_session");

    return {
        showSessionWarning,
        countdown,
        extendSession,
        declineSession,
    };
}
