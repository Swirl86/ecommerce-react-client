import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// ----------------------
// 1. Stable mock for useLoginForm
// ----------------------
const mockHandleSubmit = vi.fn();

const mockUseLoginForm = vi.fn(() => ({
    email: "",
    emailError: "",
    password: "",
    passwordError: "",
    remember: false,
    isFormValid: true,

    setRemember: vi.fn(),
    handleEmailChange: vi.fn(),
    handleEmailBlur: vi.fn(),
    handlePasswordChange: vi.fn(),
    handlePasswordBlur: vi.fn(),
    handleSubmit: mockHandleSubmit,
}));

vi.mock("@hooks/auth/useLoginForm", () => ({
    useLoginForm: () => mockUseLoginForm(),
}));

// ----------------------
// 2. Mock AuthContext
// ----------------------
let mockAccessToken = null;

vi.mock("@context/AuthContext", () => ({
    useAuth: () => ({ accessToken: mockAccessToken }),
}));

// ----------------------
// 3. Mock UIContext
// ----------------------
vi.mock("@context/UIContext", () => ({
    useUI: () => ({
        showError: vi.fn(),
        showSuccess: vi.fn(),
        setLoading: vi.fn(),
    }),
}));

// ----------------------
// 4. Mock navigate
// ----------------------
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// ----------------------
// 5. Import component AFTER mocks
// ----------------------
import Login from "../Login";

// ----------------------
// TESTS
// ----------------------
describe("Login page (new architecture)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAccessToken = null;
    });

    test("disables login button when form is invalid", () => {
        mockUseLoginForm.mockReturnValueOnce({
            ...mockUseLoginForm(),
            isFormValid: false,
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(screen.getByRole("button", { name: /log in/i })).toBeDisabled();
    });
});
