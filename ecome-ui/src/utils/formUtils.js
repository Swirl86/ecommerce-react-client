// Compare form values with original values and return only changed fields
export function getChangedFields(form, original = {}) {
    const payload = {};

    for (const key in form) {
        const newValue = typeof form[key] === "string" ? form[key].trim() : form[key];
        const oldValue = original?.[key] ?? "";

        if (newValue !== oldValue) {
            payload[key] = newValue;
        }
    }

    return payload;
}

// Check if any field has changed
export function isDirty(form, original) {
    return Object.keys(getChangedFields(form, original)).length > 0;
}
