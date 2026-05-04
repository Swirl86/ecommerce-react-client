import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import CheckboxField from "../components/ui/CheckboxField";
import InputField from "../components/ui/InputField";
import { useAuth } from "../context/AuthContext";
import { useAuthActions } from "../hooks/useAuthActions";

export default function Login() {
    const {
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
    } = useAuthActions();

    const { accessToken } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (accessToken) {
            navigate("/profile");
        }
    }, [accessToken, navigate]);

    return (
        <PageContainer>
            <div className="flex justify-center">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-[var(--color-border)] rounded-xl shadow-sm p-8">
                    <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
                        Welcome back
                    </h1>
                    <p className="text-[var(--color-text-muted)] mb-6">
                        Log in to your account to continue.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        data-testid="login-form"
                        className="flex flex-col gap-5"
                    >
                        <InputField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={handleEmailBlur}
                            error={emailError}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                            error={passwordError}
                        />

                        <div className="flex items-center justify-between text-sm">
                            <CheckboxField
                                label="Keep me logged in"
                                checked={remember}
                                onChange={() => setRemember(!remember)}
                            />

                            <Link
                                to="/forgot-password"
                                className="text-[var(--color-primary-dark)] hover:underline"
                            >
                                Forgot password
                            </Link>
                        </div>

                        <div
                            className={`
                                error-fade
                                ${showErrorAnim ? "error-fade-enter-active" : "error-fade-exit-active"}
                                text-red-500 text-sm h-5
                            `}
                        >
                            {error}
                        </div>

                        <button
                            disabled={!isFormValid || loading}
                            className="
                                w-full py-3 rounded-lg text-white font-medium
                                bg-[var(--color-primary)]
                                hover:bg-[var(--color-primary-dark)]
                                transition disabled:opacity-50 disabled:cursor-not-allowed
                            "
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
                        Need an account?{" "}
                        <Link
                            to="/register"
                            className="text-[var(--color-primary-dark)] hover:underline"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </PageContainer>
    );
}
