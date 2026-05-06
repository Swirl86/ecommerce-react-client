import { SESSION_DURATION, WARNING_BEFORE } from "@config/constants";
import { useCallback, useEffect, useRef, useState } from "react";

export function useSessionTimers(refreshToken, remember, refreshFn, logoutFn) {
    const [showSessionWarning, setShowSessionWarning] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const sessionTimeoutRef = useRef(null);
    const countdownIntervalRef = useRef(null);

    const warningTime = SESSION_DURATION - WARNING_BEFORE;

    // -----------------------------------------------------
    // CLEANUP HELPERS
    // -----------------------------------------------------
    const clearTimers = useCallback(() => {
        clearTimeout(sessionTimeoutRef.current);
        clearInterval(countdownIntervalRef.current);

        sessionTimeoutRef.current = null;
        countdownIntervalRef.current = null;
    }, []);

    // -----------------------------------------------------
    // START TIMERS
    // -----------------------------------------------------
    const startTimers = useCallback(() => {
        clearTimers();

        // Only start timers if session is NOT remembered
        if (!refreshToken || remember) return;

        // Show warning before expiry
        sessionTimeoutRef.current = setTimeout(() => {
            setShowSessionWarning(true);
            setCountdown(Math.floor(WARNING_BEFORE / 1000));
        }, warningTime);
    }, [refreshToken, remember, clearTimers, warningTime]);

    // -----------------------------------------------------
    // COUNTDOWN
    // -----------------------------------------------------
    useEffect(() => {
        if (!showSessionWarning) return;

        clearInterval(countdownIntervalRef.current);

        countdownIntervalRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearTimers();
                    logoutFn("countdown_zero");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownIntervalRef.current);
    }, [showSessionWarning, clearTimers, logoutFn]);

    // -----------------------------------------------------
    // EXTEND SESSION
    // -----------------------------------------------------
    const extendSession = useCallback(async () => {
        const ok = await refreshFn();
        if (!ok) return;

        setShowSessionWarning(false);
        setCountdown(0);

        startTimers();
    }, [refreshFn, startTimers]);

    // -----------------------------------------------------
    // DECLINE SESSION
    // -----------------------------------------------------
    const declineSession = useCallback(() => {
        clearTimers();
        logoutFn("decline_session");
    }, [clearTimers, logoutFn]);

    // -----------------------------------------------------
    // RESET TIMERS WHEN TOKEN CHANGES
    // -----------------------------------------------------
    useEffect(() => {
        startTimers();
        return clearTimers;
    }, [startTimers, clearTimers]);

    return {
        showSessionWarning,
        countdown,
        extendSession,
        declineSession,
    };
}
