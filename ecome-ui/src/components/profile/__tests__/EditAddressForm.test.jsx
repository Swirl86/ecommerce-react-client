import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMockAuth, createMockUI } from "@utils/test-utils/mockUtils";
import { vi } from "vitest";

import * as profileApi from "@api/profileApi";
import { EditAddressForm } from "@components/profile";

// ----------------------
// Mock AuthContext
// ----------------------
const mockAuth = createMockAuth();

vi.mock("@context/AuthContext", () => ({
    useAuth: () => mockAuth,
}));

// ----------------------
// Mock UIContext
// ----------------------
const mockUI = createMockUI();

vi.mock("@context/UIContext", () => ({
    useUI: () => mockUI,
}));

// ----------------------
// Mock profile API
// ----------------------
vi.mock("@api/profileApi", () => ({
    updateAddress: vi.fn(),
}));

// ----------------------
// Tests
// ----------------------
describe("EditAddressForm", () => {
    const baseAddress = {
        street: "Main St",
        postalCode: "12345",
        city: "Stockholm",
        country: "Sweden",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders initial values", () => {
        render(<EditAddressForm address={baseAddress} refetch={vi.fn()} onCancel={vi.fn()} />);

        expect(screen.getByDisplayValue("Main St")).toBeInTheDocument();
        expect(screen.getByDisplayValue("12345")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Stockholm")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Sweden")).toBeInTheDocument();
    });

    test("disables Save when no changes", () => {
        render(<EditAddressForm address={baseAddress} refetch={vi.fn()} onCancel={vi.fn()} />);

        expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
    });

    test("enables Save when a field changes", () => {
        render(<EditAddressForm address={baseAddress} refetch={vi.fn()} onCancel={vi.fn()} />);

        fireEvent.change(screen.getByLabelText("City"), { target: { value: "Uppsala" } });

        expect(screen.getByRole("button", { name: /save/i })).not.toBeDisabled();
    });

    test("validates only changed fields", () => {
        const address = {
            street: null,
            postalCode: null,
            city: "Stockholm",
            country: null,
        };

        render(<EditAddressForm address={address} refetch={vi.fn()} onCancel={vi.fn()} />);

        // Change only city → should validate only city
        fireEvent.change(screen.getByLabelText("City"), { target: { value: "" } });
        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(screen.getByText("city must be at least 2 characters")).toBeInTheDocument();
    });

    test("does not submit when no changes", () => {
        const mockOnCancel = vi.fn();

        render(<EditAddressForm address={baseAddress} refetch={vi.fn()} onCancel={mockOnCancel} />);

        const saveButton = screen.getByRole("button", { name: /save/i });

        // Save should be disabled when no changes
        expect(saveButton).toBeDisabled();

        // Clicking save should do nothing
        fireEvent.click(saveButton);

        expect(mockUI.showInfo).not.toHaveBeenCalled();
        expect(mockOnCancel).not.toHaveBeenCalled();
    });

    test("submits only changed fields", () => {
        render(<EditAddressForm address={baseAddress} refetch={vi.fn()} onCancel={vi.fn()} />);

        fireEvent.change(screen.getByLabelText("Street"), { target: { value: "New Street 5" } });
        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(profileApi.updateAddress).toHaveBeenCalledWith(
            {
                street: "New Street 5",
                postalCode: "12345",
                city: "Stockholm",
                country: "Sweden",
            },
            "token123"
        );
    });

    test("calls refetch and onCancel after success", async () => {
        vi.mocked(profileApi.updateAddress).mockResolvedValueOnce({});

        const mockRefetch = vi.fn();
        const mockOnCancel = vi.fn();

        render(
            <EditAddressForm address={baseAddress} refetch={mockRefetch} onCancel={mockOnCancel} />
        );

        fireEvent.change(screen.getByLabelText("City"), { target: { value: "Uppsala" } });
        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
            expect(mockUI.showSuccess).toHaveBeenCalledWith("Address updated successfully");
            expect(mockRefetch).toHaveBeenCalled();
            expect(mockOnCancel).toHaveBeenCalled();
        });
    });

    test("shows error on failure", async () => {
        vi.mocked(profileApi.updateAddress).mockRejectedValueOnce(new Error("Server error"));

        render(<EditAddressForm address={baseAddress} refetch={vi.fn()} onCancel={vi.fn()} />);

        fireEvent.change(screen.getByLabelText("City"), { target: { value: "Uppsala" } });
        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
            expect(mockUI.showError).toHaveBeenCalledWith("Server error");
        });
    });
});
