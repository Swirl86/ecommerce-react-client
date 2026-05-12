// EMAIL
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value) {
    if (!value) return "Email is required";
    if (value.length < 2) return "Email must be at least 2 characters";
    if (value.length > 50) return "Email must be less than 50 characters";
    if (!emailRegex.test(value)) return "Invalid email format";
    return "";
}

// PASSWORD
export function validatePassword(value) {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return "";
}

// PHONE (global formats)
export const phoneRegex = /^\+?[0-9\s\-()]{6,20}$/;
// Examples allowed:
// +46 70 123 45 67
// (202) 555-0182
// 070-1234567
// 0044 20 7946 0958

export function validatePhone(value) {
    if (!value) return "";
    if (!phoneRegex.test(value)) return "Invalid phone number format";
    return "";
}

// ADDRESS VALIDATION
export function validateAddress(form) {
    const errors = {};

    if (!form.street || form.street.length < 3)
        errors.street = "Street must be at least 3 characters";

    // GLOBAL POSTAL CODE (letters + numbers allowed)
    const postalRegex = /^[A-Za-z0-9\s\-]{3,10}$/;

    if (!postalRegex.test(form.postalCode))
        errors.postalCode = "Postal code must be 3–10 letters or numbers";

    if (!form.city || form.city.length < 2) errors.city = "City must be at least 2 characters";

    if (!form.country || form.country.length < 2)
        errors.country = "Country must be at least 2 characters";

    return errors;
}
