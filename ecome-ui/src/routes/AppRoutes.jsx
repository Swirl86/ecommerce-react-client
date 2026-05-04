import { Route, Routes } from "react-router-dom";
import GuestRoute from "../components/auth/GuestRoute";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProductDetail from "../pages/ProductDetail";
import Products from "../pages/Products";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public pages */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* Guest-only pages (login, register) */}
            <Route
                path="/login"
                element={
                    <GuestRoute>
                        <Login />
                    </GuestRoute>
                }
            />

            {/* Protected pages (profile, cart, orders) */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <div>Profile page placeholder</div>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
