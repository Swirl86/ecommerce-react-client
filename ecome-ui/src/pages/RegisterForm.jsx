import { useAuth } from "@context/AuthContext";
import { useRegisterForm } from "@hooks/auth/useRegisterForm";
import PageContainer from "@layout/PageContainer";
import InputField from "@ui/InputField";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterForm() {
    const {
        email,
        emailError,
        password,
        passwordError,
        isFormValid,
        handleEmailChange,
        handleEmailBlur,
        handlePasswordChange,
        handlePasswordBlur,
        handleSubmit,
    } = useRegisterForm();

    const { accessToken } = useAuth();
    const navigate = useNavigate();

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
                        Create account
                    </h1>
                    <p className="text-[var(--color-text-muted)] mb-6">
                        Register to start shopping.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        data-testid="register-form"
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

                        <button
                            disabled={!isFormValid}
                            className="
                                w-full py-3 rounded-lg text-white font-medium
                                bg-[var(--color-primary)]
                                hover:bg-[var(--color-primary-dark)]
                                transition disabled:opacity-50 disabled:cursor-not-allowed
                            "
                        >
                            Create account
                        </button>
                    </form>

                    <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-[var(--color-primary-dark)] hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </PageContainer>
    );
}
