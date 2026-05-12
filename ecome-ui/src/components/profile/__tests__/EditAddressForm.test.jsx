import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import * as profileApi from "@api/profileApi";
import * as formUtils from "@utils/formUtils";
import * as validation from "@utils/validation";
import EditAddressForm from "../EditAddressForm";

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
    updateAddress: vi.fn(),
}));

vi.mock("@utils/formUtils", () => ({
    getChangedFields: vi.fn(),
    isDirty: vi.fn(),
}));

vi.mock("@utils/validation", () => ({
    validateAddress: vi.fn(),
}));

// ----------------------
// TESTS
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

        vi.mocked(formUtils.isDirty).mockReturnValue(true);
        vi.mocked(formUtils.getChangedFields).mockReturnValue({});
        vi.mocked(validation.validateAddress).mockReturnValue({});
    });

    test("renders initial values", () => {
        render(<EditAddressForm address={baseAddress} refetch={vi.fn()} onCancel={vi.fn()} />);

        expect(screen.getByDisplayValue("Main St")).toBeInTheDocument();
        expect(screen.getByDisplayValue("12345")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Stockholm")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Sweden")).toBeInTheDocument();
    });

    test("disables Save when no changes", () => {
        vi.mocked(formUtils.isDirty).mockReturnValue(false);

        render(<EditAddressForm address={baseAddress} refetch={vi.fn()} onCancel={vi.fn()} />);

        expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
    });

    test("shows validation errors", () => {
        vi.mocked(validation.validateAddress).mockReturnValueOnce({
            street: "Street must be at least 3 characters",
            postalCode: "Postal code must be 3–10 letters or numbers",
            city: "City must be at least 2 characters",
            country: "Country must be at least 2 characters",
        });

        render(<EditAddressForm address={baseAddress} refetch={vi.fn()} onCancel={vi.fn()} />);

        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(screen.getByText("Street must be at least 3 characters")).toBeInTheDocument();
        expect(screen.getByText("Postal code must be 3–10 letters or numbers")).toBeInTheDocument();
        expect(screen.getByText("City must be at least 2 characters")).toBeInTheDocument();
        expect(screen.getByText("Country must be at least 2 characters")).toBeInTheDocument();
    });

    test("shows info when no changes to update", () => {
        vi.mocked(validation.validateAddress).mockReturnValueOnce({});
        vi.mocked(formUtils.getChangedFields).mockReturnValueOnce({});

        const mockOnCancel = vi.fn();

        render(<EditAddressForm address={baseAddress} refetch={vi.fn()} onCancel={mockOnCancel} />);

        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(mockShowInfo).toHaveBeenCalledWith("No changes to update");
        expect(mockOnCancel).toHaveBeenCalled();
    });

    test("submits only changed fields", () => {
        vi.mocked(validation.validateAddress).mockReturnValueOnce({});
        vi.mocked(formUtils.getChangedFields).mockReturnValueOnce({ street: "New Street 5" });

        render(<EditAddressForm address={baseAddress} refetch={vi.fn()} onCancel={vi.fn()} />);

        fireEvent.change(screen.getByLabelText("Street"), { target: { value: "New Street 5" } });
        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(profileApi.updateAddress).toHaveBeenCalledWith(
            { street: "New Street 5" },
            "token123"
        );
    });

    test("calls refetch and onCancel after success", async () => {
        vi.mocked(profileApi.updateAddress).mockResolvedValueOnce({});
        vi.mocked(formUtils.getChangedFields).mockReturnValueOnce({ city: "Uppsala" });

        const mockRefetch = vi.fn();
        const mockOnCancel = vi.fn();

        render(
            <EditAddressForm address={baseAddress} refetch={mockRefetch} onCancel={mockOnCancel} />
        );

        fireEvent.change(screen.getByLabelText("City"), { target: { value: "Uppsala" } });
        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
            expect(mockShowSuccess).toHaveBeenCalledWith("Address updated successfully");
            expect(mockRefetch).toHaveBeenCalled();
            expect(mockOnCancel).toHaveBeenCalled();
        });
    });

    test("shows error on failure", async () => {
        vi.mocked(profileApi.updateAddress).mockRejectedValueOnce(new Error("Server error"));
        vi.mocked(formUtils.getChangedFields).mockReturnValueOnce({ city: "Uppsala" });

        render(<EditAddressForm address={baseAddress} refetch={vi.fn()} onCancel={vi.fn()} />);

        fireEvent.change(screen.getByLabelText("City"), { target: { value: "Uppsala" } });
        fireEvent.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
            expect(mockShowError).toHaveBeenCalledWith("Server error");
        });
    });
});
