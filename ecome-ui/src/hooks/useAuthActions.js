import { API_BASE_URL } from "@config/api";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import { useState } from "react";

export function useAuthActions() {
    const { login: authLogin, logout: authLogout } = useAuth();
    const { showError, showSuccess, setLoading } = useUI();

    // -----------------------------------------------------
    // FORM STATE
    // -----------------------------------------------------
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [remember, setRemember] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        if (!isFormValid) {
            showError("Please fix the errors in the form");
            return false;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.status === 401) {
                showError("Invalid email or password");
                return false;
            }

            if (!res.ok) {
                showError("Unexpected error");
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
            showError("Network error");
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
        showSuccess("Logged out");
    };

    // -----------------------------------------------------
    // SUBMIT HANDLER
    // -----------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        return await login();
    };

    return {
        email,
        emailError,
        password,
        passwordError,
        remember,
        isFormValid,

        setRemember,
        handleEmailChange,
        handleEmailBlur,
        handlePasswordChange,
        handlePasswordBlur,

        handleSubmit,
        login,
        logout,
    };
}
