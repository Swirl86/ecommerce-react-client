import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

export function useLogin() {
    const { login } = useAuth();

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
    // SUBMIT HANDLER
    // -----------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!isFormValid) {
            setLoading(false);
            return;
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
                return;
            }

            if (!res.ok) {
                setError("Unexpected error");
                setLoading(false);
                return;
            }

            const data = await res.json();
            localStorage.setItem("remember", remember);

            login(
                {
                    token: data.accessToken,
                    refreshToken: data.refreshToken,
                    id: data.userId,
                    email: data.email,
                    role: data.role,
                },
                remember
            );
        } catch {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------------------
    // RETURN API
    // -----------------------------------------------------
    return {
        email,
        emailError,
        password,
        passwordError,
        remember,
        error,
        showErrorAnim,
        loading,
        isFormValid,

        setRemember,
        handleEmailChange,
        handleEmailBlur,
        handlePasswordChange,
        handlePasswordBlur,
        handleSubmit,
    };
}
