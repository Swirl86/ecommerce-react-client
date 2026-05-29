import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMockAuth, createMockUI } from "@utils/test-utils/mockUtils";
import { vi } from "vitest";

import * as profileApi from "@api/profileApi";
import { EditProfileForm } from "@components/profile";
import * as formUtils from "@utils/formUtils";
import * as validation from "@utils/validation";

// ---------------------------------------------------------
// Mock AuthContext
// ---------------------------------------------------------
const mockAuth = createMockAuth();

vi.mock("@context/AuthContext", () => ({
    useAuth: () => mockAuth,
}));

// ---------------------------------------------------------
// Mock UIContext
// ---------------------------------------------------------
const mockUI = createMockUI();

vi.mock("@context/UIContext", () => ({
    useUI: () => mockUI,
}));

// ---------------------------------------------------------
// Mock profile API
// ---------------------------------------------------------
vi.mock("@api/profileApi", () => ({
    updateProfile: vi.fn(),
}));

// ---------------------------------------------------------
// Mock form utilities
// ---------------------------------------------------------
vi.mock("@utils/formUtils", () => ({
    getChangedFields: vi.fn(),
    isDirty: vi.fn(),
}));

// ---------------------------------------------------------
// Mock validation utilities
// ---------------------------------------------------------
vi.mock("@utils/validation", () => ({
    validateEmail: vi.fn(),
    validatePhone: vi.fn(),
    validatePassword: vi.fn(),
}));

// ---------------------------------------------------------
// Tests
// ---------------------------------------------------------
describe("EditProfileForm", () => {
    const baseData = {
        name: "Anna",
        email: "anna@example.com",
        phone: "0701234567",
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock behavior
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

        expect(mockUI.showInfo).toHaveBeenCalledWith("No changes to update");
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
            expect(mockUI.showSuccess).toHaveBeenCalledWith("Profile updated successfully");
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
            expect(mockUI.showError).toHaveBeenCalledWith("Server error");
        });
    });
});
