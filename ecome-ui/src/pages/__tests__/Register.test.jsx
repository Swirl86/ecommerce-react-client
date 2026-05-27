import { fireEvent, render, screen } from "@testing-library/react";
import { createMockFormHook } from "@utils/test-utils/mockUtils";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// ----------------------
// Mock
// ----------------------
const { mockHandleSubmit, mockHook: mockUseRegisterForm } = createMockFormHook();

vi.mock("@hooks/auth/useRegisterForm", () => ({
    useRegisterForm: () => mockUseRegisterForm(),
}));

// ----------------------
// AuthContext mock
// ----------------------
let mockAccessToken = null;

vi.mock("@context/AuthContext", () => ({
    useAuth: () => ({
        accessToken: mockAccessToken,
    }),
}));

// ----------------------
// navigate mock
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
// Import component AFTER mocks
// ----------------------
import RegisterForm from "../RegisterForm";

// ----------------------
// TESTS
// ----------------------
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
        expect(mockHandleSubmit).toHaveBeenCalled();
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
