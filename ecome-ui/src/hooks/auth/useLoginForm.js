import { validateEmail, validatePassword } from "@utils";
import { useState } from "react";
import { useAuthActions } from "./useAuthActions";

export function useLoginForm() {
    const { login } = useAuthActions();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [remember, setRemember] = useState(false);

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(validateEmail(value));
    };

    const handleEmailBlur = () => {
        setEmailError(validateEmail(email));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(validatePassword(value));
    };

    const handlePasswordBlur = () => {
        setPasswordError(validatePassword(password));
    };

    const isFormValid = validateEmail(email) === "" && validatePassword(password) === "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        return await login({ email, password, remember });
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
    };
}
