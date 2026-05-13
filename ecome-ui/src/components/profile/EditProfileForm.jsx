import { updateProfile } from "@api/profileApi";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import FormButtons from "@ui/FormButtons";
import InputField from "@ui/InputField";
import { getChangedFields, isDirty } from "@utils/formUtils";
import { validateEmail, validatePassword, validatePhone } from "@utils/validation";
import { useEffect, useState } from "react";

export default function EditProfileForm({ data, refetch, refresh, onCancel }) {
    const { accessToken, updateAuthUser } = useAuth();
    const { setLoading, showError, showSuccess, showInfo } = useUI();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    }, [data]);

    // -----------------------------------------------------
    // Validation
    // -----------------------------------------------------
    const validate = () => {
        const newErrors = {};

        // NAME (validate only if changed)
        if (form.name !== (data.name || "")) {
            if (!form.name || form.name.length < 2) {
                newErrors.name = "Name must be at least 2 characters";
            }
        }

        // EMAIL (always required)
        const emailError = validateEmail(form.email);
        if (emailError) newErrors.email = emailError;

        // PHONE (validate only if changed)
        if (form.phone !== (data.phone || "")) {
            const phoneError = validatePhone(form.phone);
            if (phoneError) newErrors.phone = phoneError;
        }

        // PASSWORD CHANGE
        const isChangingPassword = form.currentPassword || form.newPassword || form.confirmPassword;

        if (isChangingPassword) {
            if (!form.currentPassword) newErrors.currentPassword = "Current password is required";

            const pwError = validatePassword(form.newPassword);
            if (pwError) newErrors.newPassword = pwError;

            if (form.newPassword !== form.confirmPassword)
                newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // -----------------------------------------------------
    // Detect if anything has changed (for disabling Save)
    // -----------------------------------------------------
    const isProfileDirty = () => {
        const baseChanged = isDirty(form, {
            name: data.name,
            email: data.email,
            phone: data.phone,
        });

        const passwordChanged = form.currentPassword || form.newPassword || form.confirmPassword;

        return baseChanged || passwordChanged;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // -----------------------------------------------------
    // Submit
    // -----------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Base changed fields
        const payload = getChangedFields(form, {
            name: data.name,
            email: data.email,
            phone: data.phone,
        });

        // Password change
        if (form.currentPassword || form.newPassword || form.confirmPassword) {
            payload.currentPassword = form.currentPassword;
            payload.newPassword = form.newPassword;
        }

        // Nothing changed
        if (Object.keys(payload).length === 0) {
            showInfo("No changes to update");
            onCancel();
            return;
        }

        try {
            setLoading(true);

            // 1. Update backend - Send only changed fields
            await updateProfile(payload, accessToken);

            // 2. Update local auth state if email changed
            const emailChanged = Boolean(payload.email);
            if (emailChanged) {
                await refresh(); // new token might have new email in payload
                updateAuthUser({ email: payload.email });
            }

            // 4. Refetch profile + close
            await refetch();

            showSuccess("Profile updated successfully");
            onCancel();
        } catch (err) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fadeInScale">
            <h2 className="text-2xl font-semibold text-[var(--color-text)]">Edit Profile</h2>

            {/* PERSONAL INFO */}
            <div className="space-y-6">
                <InputField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                />

                <InputField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                />

                <InputField
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    error={errors.phone}
                />
            </div>

            {/* PASSWORD CHANGE */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[var(--color-text)]">Change Password</h3>

                <InputField
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    error={errors.currentPassword}
                />

                <InputField
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    error={errors.newPassword}
                />

                <InputField
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                />
            </div>

            {/* BUTTONS */}
            <FormButtons onCancel={onCancel} disabled={!isProfileDirty()} />
        </form>
    );
}
