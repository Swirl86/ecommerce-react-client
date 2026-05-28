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

export function validatePhone(value) {
    if (!value) return "";
    if (!phoneRegex.test(value)) return "Invalid phone number format";
    return "";
}

// GLOBAL POSTAL CODE (letters + numbers allowed)
export const postalRegex = /^[A-Za-z0-9\s\-]{3,10}$/;

// ADDRESS VALIDATION (used in EditAddressForm)
export function validateAddress(form) {
    const errors = {};

    if (!form.street || form.street.trim().length < 3)
        errors.street = "Street must be at least 3 characters";

    if (!postalRegex.test(form.postalCode))
        errors.postalCode = "Postal code must be 3–10 letters or numbers";

    if (!form.city || form.city.trim().length < 2)
        errors.city = "City must be at least 2 characters";

    if (!form.country || form.country.trim().length < 2)
        errors.country = "Country must be at least 2 characters";

    return errors;
}

export function isAddressComplete(address) {
    if (!address) return false;

    const errors = validateAddress(address);
    return Object.keys(errors).length === 0;
}

export function getMissingAddressFields(address) {
    if (!address) return [];

    const missing = [];

    if (!address.street?.trim()) missing.push("street");
    if (!address.city?.trim()) missing.push("city");
    if (!address.postalCode?.trim()) missing.push("postalCode");
    if (!address.country?.trim()) missing.push("country");

    return missing;
}

// CHECKOUT VALIDATIONS
export function isShippingInfoComplete(form) {
    return (
        form.name?.trim().length > 0 &&
        form.phone?.trim().length > 0 &&
        form.street?.trim().length > 0 &&
        form.city?.trim().length > 0 &&
        form.postalCode?.trim().length > 0 &&
        form.country?.trim().length > 0
    );
}
