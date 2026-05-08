import { validateEmail, validatePassword } from "@utils/validation";
import { useState } from "react";
import { useAuthActions } from "./useAuthActions";

export function useRegisterForm() {
    const { register } = useAuthActions();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

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
        return await register({ email, password });
    };

    return {
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
    };
}
