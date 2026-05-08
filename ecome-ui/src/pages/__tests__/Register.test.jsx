import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

const mockSubmit = vi.fn();

vi.mock("@hooks/auth/useRegisterForm", () => ({
    useRegisterForm: () => ({
        email: "",
        emailError: "",
        password: "",
        passwordError: "",
        isFormValid: true,
        handleEmailChange: vi.fn(),
        handleEmailBlur: vi.fn(),
        handlePasswordChange: vi.fn(),
        handlePasswordBlur: vi.fn(),
        handleSubmit: mockSubmit,
    }),
}));

let mockAccessToken = null;

vi.mock("@context/AuthContext", () => ({
    useAuth: () => ({
        accessToken: mockAccessToken,
    }),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

import RegisterForm from "../RegisterForm";

describe("Register page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAccessToken = null;
    });

    test("renders email and password fields", () => {
        render(
            <MemoryRouter>
                <RegisterForm />
            </MemoryRouter>
        );

        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    test("calls handleSubmit on form submit", () => {
        render(
            <MemoryRouter>
                <RegisterForm />
            </MemoryRouter>
        );

        fireEvent.submit(screen.getByTestId("register-form"));
        expect(mockSubmit).toHaveBeenCalled();
    });

    test("redirects to /profile if already logged in", () => {
        mockAccessToken = "abc123";

        render(
            <MemoryRouter>
                <RegisterForm />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
});
