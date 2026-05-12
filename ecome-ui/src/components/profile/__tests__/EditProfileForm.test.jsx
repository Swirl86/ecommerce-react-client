import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import * as profileApi from "@api/profileApi";
import * as formUtils from "@utils/formUtils";
import * as validation from "@utils/validation";
import EditProfileForm from "../EditProfileForm";

// ----------------------
// GLOBAL MOCKS
// ----------------------
vi.mock("@context/AuthContext", () => ({
    useAuth: () => ({ accessToken: "token123" }),
}));

const mockSetLoading = vi.fn();
const mockShowError = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowInfo = vi.fn();

vi.mock("@context/UIContext", () => ({
    useUI: () => ({
        setLoading: mockSetLoading,
        showError: mockShowError,
        showSuccess: mockShowSuccess,
        showInfo: mockShowInfo,
    }),
}));

vi.mock("@api/profileApi", () => ({
    updateProfile: vi.fn(),
}));

vi.mock("@utils/formUtils", () => ({
    getChangedFields: vi.fn(),
    isDirty: vi.fn(),
}));

vi.mock("@utils/validation", () => ({
    validateEmail: vi.fn(),
    validatePhone: vi.fn(),
    validatePassword: vi.fn(),
}));

// ----------------------
// TESTS
// ----------------------
describe("EditProfileForm", () => {
    const baseData = {
        name: "Anna",
        email: "anna@example.com",
        phone: "0701234567",
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Default mocks
        vi.mocked(formUtils.isDirty).mockReturnValue(true);
        vi.mocked(formUtils.getChangedFields).mockReturnValue({});
        vi.mocked(validation.validateEmail).mockReturnValue(null);
        vi.mocked(validation.validatePhone).mockReturnValue(null);
        vi.mocked(validation.validatePassword).mockReturnValue(null);
    });

    test("renders initial values", () => {
        render(<EditProfileForm data={baseData} refetch={vi.fn()} onCancel={vi.fn()} />);

        expect(screen.getByDisplayValue("Anna")).toBeInTheDocument();
        expect(screen.getByDisplayValue("anna@example.com")).toBeInTheDocument();
        expect(screen.getByDisplayValue("0701234567")).toBeInTheDocument();
    });

    test("validates email format", () => {
        vi.mocked(validation.validateEmail).mockReturnValueOnce("Invalid email format");

        render(<EditProfileForm data={baseData} refetch={vi.fn()} onCancel={vi.fn()} />);

        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "bad" } });
        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    });

    test("shows info when no changes to update", () => {
        vi.mocked(formUtils.getChangedFields).mockReturnValueOnce({});

        const mockOnCancel = vi.fn();

        render(<EditProfileForm data={baseData} refetch={vi.fn()} onCancel={mockOnCancel} />);

        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(mockShowInfo).toHaveBeenCalledWith("No changes to update");
        expect(mockOnCancel).toHaveBeenCalled();
    });

    test("submits only changed fields", () => {
        vi.mocked(formUtils.getChangedFields).mockReturnValueOnce({ name: "Anna Maria" });

        render(<EditProfileForm data={baseData} refetch={vi.fn()} onCancel={vi.fn()} />);

        fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Anna Maria" } });
        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(profileApi.updateProfile).toHaveBeenCalledWith({ name: "Anna Maria" }, "token123");
    });

    test("submits password change fields", () => {
        vi.mocked(formUtils.getChangedFields).mockReturnValueOnce({
            currentPassword: "oldpass",
            newPassword: "newpassword123",
        });

        render(<EditProfileForm data={baseData} refetch={vi.fn()} onCancel={vi.fn()} />);

        fireEvent.change(screen.getByLabelText("Current Password"), {
            target: { value: "oldpass" },
        });
        fireEvent.change(screen.getByLabelText("New Password"), {
            target: { value: "newpassword123" },
        });
        fireEvent.change(screen.getByLabelText("Confirm New Password"), {
            target: { value: "newpassword123" },
        });

        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(profileApi.updateProfile).toHaveBeenCalledWith(
            {
                currentPassword: "oldpass",
                newPassword: "newpassword123",
            },
            "token123"
        );
    });

    test("calls refetch and onCancel after success", async () => {
        vi.mocked(profileApi.updateProfile).mockResolvedValueOnce({});
        vi.mocked(formUtils.getChangedFields).mockReturnValueOnce({ name: "Anna Maria" });

        const mockRefetch = vi.fn();
        const mockOnCancel = vi.fn();

        render(<EditProfileForm data={baseData} refetch={mockRefetch} onCancel={mockOnCancel} />);

        fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Anna Maria" } });
        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
            expect(mockShowSuccess).toHaveBeenCalledWith("Profile updated successfully");
            expect(mockRefetch).toHaveBeenCalled();
            expect(mockOnCancel).toHaveBeenCalled();
        });
    });

    test("shows error on failure", async () => {
        vi.mocked(profileApi.updateProfile).mockRejectedValueOnce(new Error("Server error"));
        vi.mocked(formUtils.getChangedFields).mockReturnValueOnce({ name: "Anna Maria" });

        render(<EditProfileForm data={baseData} refetch={vi.fn()} onCancel={vi.fn()} />);

        fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Anna Maria" } });
        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
            expect(mockShowError).toHaveBeenCalledWith("Server error");
        });
    });
});
