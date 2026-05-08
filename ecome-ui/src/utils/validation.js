export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value) {
    if (!value) return "Email is required";
    if (value.length < 2) return "Email must be at least 2 characters";
    if (value.length > 50) return "Email must be less than 50 characters";
    if (!value.includes("@")) return "Email must contain @";
    if (!emailRegex.test(value))
        return "Email must include a valid domain (example: name@company.com)";
    return "";
}

export function validatePassword(value) {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return "";
}
