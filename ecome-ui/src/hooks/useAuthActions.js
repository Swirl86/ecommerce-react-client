import { API_BASE_URL } from "@config/api";
import { useAuth } from "@context/AuthContext";
import { useEffect, useState } from "react";

export function useAuthActions() {
    const { login: authLogin, logout: authLogout } = useAuth();

    // -----------------------------------------------------
    // FORM STATE
    // -----------------------------------------------------
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [remember, setRemember] = useState(false);

    const [error, setError] = useState("");
    const [showErrorAnim, setShowErrorAnim] = useState(false);
    const [loading, setLoading] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // -----------------------------------------------------
    // EFFECT: ERROR FADE ANIMATION
    // -----------------------------------------------------
    useEffect(() => {
        setShowErrorAnim(Boolean(error));
    }, [error]);

    // -----------------------------------------------------
    // EMAIL VALIDATION
    // -----------------------------------------------------
    const validateEmail = (value) => {
        if (value.length < 2) return "Email must be at least 2 characters";
        if (value.length > 50) return "Email must be less than 50 characters";
        if (!emailRegex.test(value)) return "Invalid email format";
        return "";
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setError("");
        setEmailError(validateEmail(value));
    };

    const handleEmailBlur = () => {
        setEmailError(validateEmail(email));
    };

    // -----------------------------------------------------
    // PASSWORD VALIDATION
    // -----------------------------------------------------
    const validatePassword = (value) => {
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setError("");
        setPasswordError(validatePassword(value));
    };

    const handlePasswordBlur = () => {
        setPasswordError(validatePassword(password));
    };

    // -----------------------------------------------------
    // FORM VALIDATION
    // -----------------------------------------------------
    const isFormValid = validateEmail(email) === "" && validatePassword(password) === "";

    // -----------------------------------------------------
    // LOGIN ACTION
    // -----------------------------------------------------
    const login = async () => {
        setError("");
        setLoading(true);

        if (!isFormValid) {
            setLoading(false);
            return false;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.status === 401) {
                setError("Invalid email or password");
                setLoading(false);
                return false;
            }

            if (!res.ok) {
                setError("Unexpected error");
                setLoading(false);
                return false;
            }

            const data = await res.json();

            authLogin(
                {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    user: {
                        id: data.userId,
                        email: data.email,
                        role: data.role,
                    },
                },
                remember
            );

            return true;
        } catch {
            setError("Network error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------------------
    // LOGOUT ACTION
    // -----------------------------------------------------
    const logout = async () => {
        setLoading(true);
        await authLogout();
        setLoading(false);
    };

    // -----------------------------------------------------
    // SUBMIT HANDLER (for forms)
    // -----------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        return await login();
    };

    // -----------------------------------------------------
    // RETURN API
    // -----------------------------------------------------
    return {
        // state
        email,
        emailError,
        password,
        passwordError,
        remember,
        error,
        showErrorAnim,
        loading,
        isFormValid,

        // setters
        setRemember,
        handleEmailChange,
        handleEmailBlur,
        handlePasswordChange,
        handlePasswordBlur,

        // actions
        handleSubmit,
        login,
        logout,
    };
}
