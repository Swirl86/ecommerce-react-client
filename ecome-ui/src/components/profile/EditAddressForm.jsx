import { updateAddress } from "@api/profileApi";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import FormButtons from "@ui/FormButtons";
import InputField from "@ui/InputField";
import { getChangedFields, isDirty } from "@utils/formUtils";
import { validateAddress } from "@utils/validation";
import { useEffect, useState } from "react";

export default function EditAddressForm({ address, onCancel, refetch }) {
    const { accessToken } = useAuth();
    const { setLoading, showError, showSuccess, showInfo } = useUI();

    const [form, setForm] = useState({
        street: "",
        postalCode: "",
        city: "",
        country: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm({
            street: address?.street || "",
            postalCode: address?.postalCode || "",
            city: address?.city || "",
            country: address?.country || "",
        });
    }, [address]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateAddress(form);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        // -----------------------------------------------------
        // Build payload with only changed fields
        // -----------------------------------------------------
        const payload = getChangedFields(form, address);

        // -----------------------------------------------------
        // Nothing changed → do nothing
        // -----------------------------------------------------
        if (Object.keys(payload).length === 0) {
            showInfo("No changes to update");
            onCancel();
            return;
        }

        try {
            setLoading(true);

            // Send only changed fields
            await updateAddress(payload, accessToken);

            showSuccess("Address updated successfully");

            await refetch();
            onCancel();
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fadeInScale">
            <h2 className="text-2xl font-semibold text-[var(--color-text)]">Edit Address</h2>

            <div className="space-y-6">
                <InputField
                    label="Street"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    error={errors.street}
                />

                <InputField
                    label="Postal Code"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    error={errors.postalCode}
                />

                <InputField
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    error={errors.city}
                />

                <InputField
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    error={errors.country}
                />
            </div>

            <FormButtons onCancel={onCancel} disabled={!isDirty(form, address)} />
        </form>
    );
}
