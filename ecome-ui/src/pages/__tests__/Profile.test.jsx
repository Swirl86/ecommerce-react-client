import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

let mockAccessToken = null;

vi.mock("@context/AuthContext", () => ({
    useAuth: () => ({
        accessToken: mockAccessToken,
        user: { email: "test@example.com", role: "USER" },
    }),
}));

vi.mock("@hooks/profile/useProfileData", () => ({
    useProfileData: () => ({
        data: {
            name: "Test User",
            email: "test@example.com",
            phone: "0701234567",
            orderCount: 3,
            activeOrders: [],
            address: {
                street: "Main St",
                city: "Stockholm",
                postalCode: "12345",
                country: "Sweden",
            },
        },
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

import Profile from "../Profile";

describe("Profile page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAccessToken = "abc123";
    });

    test("redirects to login if not authenticated", () => {
        mockAccessToken = null;

        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    test("renders profile tab content by default", () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test User");
        expect(screen.getAllByText("test@example.com")[0]).toBeInTheDocument();
        expect(screen.getByText("0701234567")).toBeInTheDocument();
    });

    test("renders address correctly", () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        expect(screen.getByText("Main St")).toBeInTheDocument();
        expect(screen.getByText("12345 Stockholm")).toBeInTheDocument();
        expect(screen.getByText("Sweden")).toBeInTheDocument();
    });

    test("switches to wishlist tab", () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Wishlist"));

        expect(screen.getByText("Wishlist feature coming soon.")).toBeInTheDocument();
    });

    test("switches to order history tab", () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Order History"));

        expect(screen.getByText("Your past orders will appear here.")).toBeInTheDocument();
    });
});
