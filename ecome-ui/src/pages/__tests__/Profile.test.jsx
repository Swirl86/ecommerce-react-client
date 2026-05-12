import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// ----------------------
// AuthContext mock
// ----------------------
let mockAccessToken = null;

vi.mock("@context/AuthContext", () => ({
    useAuth: () => ({
        accessToken: mockAccessToken,
        user: { email: "test@example.com", role: "USER" },
    }),
}));

// ----------------------
// useProfileData mock
// ----------------------
const mockUseProfileData = vi.fn();

vi.mock("@hooks/profile/useProfileData", () => ({
    useProfileData: () => mockUseProfileData(),
}));

// ----------------------
// Mock child components
// ----------------------
vi.mock("@components/profile", () => ({
    ProfileTabs: ({ activeTab, setActiveTab }) => (
        <div>
            <button onClick={() => setActiveTab("profile")}>Profile</button>
            <button onClick={() => setActiveTab("wishlist")}>Wishlist</button>
            <button onClick={() => setActiveTab("orders")}>Order History</button>
        </div>
    ),

    ProfileDetails: ({ data }) => (
        <div>
            <h1>{data.name}</h1>
            <div>{data.address.street}</div>
            <div>
                {data.address.postalCode} {data.address.city}
            </div>
            <div>{data.address.country}</div>
        </div>
    ),

    ProfileWishlist: () => <div>Wishlist feature coming soon.</div>,
    ProfileOrders: () => <div>Your past orders will appear here.</div>,
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
import Profile from "../Profile";

// ----------------------
// TESTS
// ----------------------
describe("Profile page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAccessToken = "abc123";

        mockUseProfileData.mockReturnValue({
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
            refetch: vi.fn(),
        });
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
