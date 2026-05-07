import { useAuth } from "@context/AuthContext";
import { useAuthActions } from "@hooks/auth/useAuthActions";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import Login from "../Login";

// Mock AuthContext
vi.mock("@context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

// Mock useAuthActions
vi.mock("@hooks/auth/useAuthActions", () => ({
    useAuthActions: vi.fn(),
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

function renderWithRouter(ui) {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("Login page (global UI version)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders email and password fields", () => {
        useAuth.mockReturnValue({ accessToken: null });
        useAuthActions.mockReturnValue({
            email: "",
            emailError: "",
            password: "",
            passwordError: "",
            remember: false,
            isFormValid: false,
            setRemember: vi.fn(),
            handleEmailChange: vi.fn(),
            handleEmailBlur: vi.fn(),
            handlePasswordChange: vi.fn(),
            handlePasswordBlur: vi.fn(),
            handleSubmit: vi.fn(),
        });

        renderWithRouter(<Login />);

        expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test("disables login button when form is invalid", () => {
        useAuth.mockReturnValue({ accessToken: null });
        useAuthActions.mockReturnValue({
            email: "",
            emailError: "",
            password: "",
            passwordError: "",
            remember: false,
            isFormValid: false,
            setRemember: vi.fn(),
            handleEmailChange: vi.fn(),
            handleEmailBlur: vi.fn(),
            handlePasswordChange: vi.fn(),
            handlePasswordBlur: vi.fn(),
            handleSubmit: vi.fn(),
        });

        renderWithRouter(<Login />);

        const button = screen.getByRole("button", { name: /log in/i });
        expect(button).toBeDisabled();
    });

    test("calls handleSubmit on form submit", () => {
        const mockSubmit = vi.fn();

        useAuth.mockReturnValue({ accessToken: null });
        useAuthActions.mockReturnValue({
            email: "test@example.com",
            emailError: "",
            password: "password123",
            passwordError: "",
            remember: false,
            isFormValid: true,
            setRemember: vi.fn(),
            handleEmailChange: vi.fn(),
            handleEmailBlur: vi.fn(),
            handlePasswordChange: vi.fn(),
            handlePasswordBlur: vi.fn(),
            handleSubmit: mockSubmit,
        });

        renderWithRouter(<Login />);

        const form = screen.getByTestId("login-form");
        fireEvent.submit(form);

        expect(mockSubmit).toHaveBeenCalled();
    });

    test("redirects to /profile if already logged in", () => {
        useAuth.mockReturnValue({ accessToken: "abc123" });

        useAuthActions.mockReturnValue({
            email: "",
            emailError: "",
            password: "",
            passwordError: "",
            remember: false,
            isFormValid: false,
            setRemember: vi.fn(),
            handleEmailChange: vi.fn(),
            handleEmailBlur: vi.fn(),
            handlePasswordChange: vi.fn(),
            handlePasswordBlur: vi.fn(),
            handleSubmit: vi.fn(),
        });

        renderWithRouter(<Login />);

        expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
});
