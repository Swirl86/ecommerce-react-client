// Compare form values with original values and return only changed fields
export function getChangedFields(form, original = {}) {
    const payload = {};

    for (const key in form) {
        // Normalize null → ""
        const newValueRaw = form[key] ?? "";
        const oldValueRaw = original?.[key] ?? "";

        // Trim strings
        const newValue = typeof newValueRaw === "string" ? newValueRaw.trim() : newValueRaw;

        const oldValue = typeof oldValueRaw === "string" ? oldValueRaw.trim() : oldValueRaw;

        // Compare normalized values
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
