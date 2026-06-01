import { WARNING_BEFORE } from "@config/constants";
import { getMsUntilExpiry } from "@utils/jwt";
import { useCallback, useEffect, useRef, useState } from "react";

export function useSessionTimers(accessToken, remember, refreshFn, logoutFn) {
    const [showSessionWarning, setShowSessionWarning] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const warningTimeoutRef = useRef(null);
    const logoutTimeoutRef = useRef(null);
    const countdownIntervalRef = useRef(null);

    // -----------------------------------------------------
    // CLEANUP HELPERS
    // -----------------------------------------------------
    const clearTimers = useCallback(() => {
        clearTimeout(warningTimeoutRef.current);
        clearTimeout(logoutTimeoutRef.current);
        clearInterval(countdownIntervalRef.current);
    }, []);

    // -----------------------------------------------------
    // START TIMERS
    // -----------------------------------------------------
    const startTimers = useCallback(() => {
        clearTimers();
        setShowSessionWarning(false);
        setCountdown(0);

        if (!accessToken) return;

        const msUntilExpiry = getMsUntilExpiry(accessToken);
        if (msUntilExpiry == null || msUntilExpiry <= 0) {
            logoutFn("token_expired");
            return;
        }

        const warningIn = Math.max(msUntilExpiry - WARNING_BEFORE, 0);

        warningTimeoutRef.current = setTimeout(() => {
            if (!remember) {
                setShowSessionWarning(true);
                setCountdown(Math.floor(WARNING_BEFORE / 1000));
            }
        }, warningIn);

        logoutTimeoutRef.current = setTimeout(() => {
            clearTimers();
            logoutFn("session_timeout");
        }, msUntilExpiry);
    }, [accessToken, remember, clearTimers, logoutFn]);

    // -----------------------------------------------------
    // COUNTDOWN
    // -----------------------------------------------------
    useEffect(() => {
        if (!showSessionWarning) return;

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
        setShowSessionWarning(false);
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
