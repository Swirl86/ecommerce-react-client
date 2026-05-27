import { render, screen } from "@testing-library/react";
import {
    createDynamicAuthMock,
    createMockFormHook,
    createMockUI,
} from "@utils/test-utils/mockUtils";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// ---------------------------------------------------------
// Mock useLoginForm
// ---------------------------------------------------------
const { mockHandleSubmit, mockHook: mockUseLoginForm } = createMockFormHook();

vi.mock("@hooks/auth/useLoginForm", () => ({
    useLoginForm: () => mockUseLoginForm(),
}));

// ---------------------------------------------------------
// AuthContext mock (dynamic token)
// ---------------------------------------------------------
let mockAccessToken = null;

vi.mock("@context/AuthContext", () => createDynamicAuthMock(() => mockAccessToken));

// ---------------------------------------------------------
// UIContext mock
// ---------------------------------------------------------
vi.mock("@context/UIContext", () => ({
    useUI: () => createMockUI(),
}));

// ---------------------------------------------------------
// Mock navigate
// ---------------------------------------------------------
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// ---------------------------------------------------------
// Import component AFTER mocks
// ---------------------------------------------------------
import Login from "../Login";

// ---------------------------------------------------------
// TESTS
// ---------------------------------------------------------
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
