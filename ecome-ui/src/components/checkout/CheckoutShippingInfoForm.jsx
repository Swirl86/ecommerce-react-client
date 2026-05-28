import { updateAddress, updateProfile } from "@api/profileApi";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import FormButtons from "@ui/FormButtons";
import InputField from "@ui/InputField";
import {
    getChangedFields,
    getDefaultShippingForm,
    isShippingInfoComplete,
    validateAddress,
} from "@utils";
import { useEffect, useState } from "react";

export default function CheckoutShippingInfoForm({ profile, refetch }) {
    const { accessToken, updateAuthUser, refresh } = useAuth();
    const { setLoading, showError, showSuccess, showInfo } = useUI();

    const originalProfile = {
        name: profile?.name || "",
        phone: profile?.phone || "",
    };
    const originalAddress = profile?.address || {};

    const [form, setForm] = useState(getDefaultShippingForm(profile));

    const changedProfile = getChangedFields(
        { name: form.name, phone: form.phone },
        originalProfile
    );
    const changedAddress = getChangedFields(
        {
            street: form.street,
            city: form.city,
            postalCode: form.postalCode,
            country: form.country,
        },
        originalAddress
    );

    const isFormDirty =
        Object.keys(changedProfile).length > 0 || Object.keys(changedAddress).length > 0;

    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm(getDefaultShippingForm(profile));
    }, [profile]);

    const shippingIsValid = isShippingInfoComplete({
        name: profile?.name,
        phone: profile?.phone,
        ...profile?.address,
    });

    const fieldIsEmpty = (value) => !value || value.trim().length === 0;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setForm(getDefaultShippingForm(profile));
        setErrors({});
    };

    // -------------------------------
    // VALIDATION
    // -------------------------------
    const validate = () => {
        const errs = validateAddress(form);
        if (!form.name.trim()) errs.name = "Name is required";
        if (!form.phone.trim()) errs.phone = "Phone number is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // -------------------------------
    // SUBMIT
    // -------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        // Always recreate originals inside submit
        const originalProfile = {
            name: profile?.name || "",
            phone: profile?.phone || "",
        };

        const originalAddress = profile?.address || {};

        // Profile changes (name + phone)
        const changedProfile = getChangedFields(
            { name: form.name, phone: form.phone },
            originalProfile
        );

        // Address changes
        const changedAddress = getChangedFields(
            {
                street: form.street,
                city: form.city,
                postalCode: form.postalCode,
                country: form.country,
            },
            originalAddress
        );

        const hasProfileChanges = Object.keys(changedProfile).length > 0;
        const hasAddressChanges = Object.keys(changedAddress).length > 0;

        if (!hasProfileChanges && !hasAddressChanges) {
            showInfo("No changes to update");
            return;
        }

        try {
            setLoading(true);

            // Update profile (name + phone)
            if (hasProfileChanges) {
                await updateProfile(changedProfile, accessToken);
                updateAuthUser(changedProfile);
                await refresh();
            }

            // Update address
            if (hasAddressChanges) {
                const payload = { ...originalAddress, ...changedAddress };
                await updateAddress(payload, accessToken);
            }

            showSuccess("Shipping info updated successfully");

            await refetch();
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fadeInScale">
            {/* UI CONTAINER */}
            <div className="p-6 rounded-xl shadow-sm border border-[var(--color-border)] bg-[var(--color-surface)]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[var(--color-text)]">
                        Shipping Address
                    </h2>

                    {!shippingIsValid && (
                        <span className="text-sm px-3 py-1 rounded-full bg-red-500/20 text-red-600 font-medium">
                            Missing information
                        </span>
                    )}
                </div>

                {!shippingIsValid && (
                    <p className="text-sm text-red-500 mb-4">
                        Please complete your address before proceeding to checkout.
                    </p>
                )}

                <div className="space-y-5">
                    <InputField
                        label="Full Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        error={errors.name}
                        className={fieldIsEmpty(form.name) ? "border-red-300" : ""}
                    />

                    <InputField
                        label="Phone Number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                        error={errors.phone}
                        className={fieldIsEmpty(form.phone) ? "border-red-300" : ""}
                    />

                    <InputField
                        label="Street"
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        placeholder="Your Street Address"
                        error={errors.street}
                        className={fieldIsEmpty(form.street) ? "border-red-300" : ""}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                            label="City"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="Your City"
                            error={errors.city}
                            className={fieldIsEmpty(form.city) ? "border-red-300" : ""}
                        />

                        <InputField
                            label="Postal Code"
                            name="postalCode"
                            value={form.postalCode}
                            onChange={handleChange}
                            placeholder="12345"
                            error={errors.postalCode}
                            className={fieldIsEmpty(form.postalCode) ? "border-red-300" : ""}
                        />
                    </div>

                    <InputField
                        label="Country"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        placeholder="Your Country"
                        error={errors.country}
                        className={fieldIsEmpty(form.country) ? "border-red-300" : ""}
                    />
                </div>
            </div>

            {isFormDirty && (
                <div className="flex justify-end">
                    <FormButtons onCancel={() => resetForm()} disabled={!isFormDirty} />
                </div>
            )}
        </form>
    );
}
