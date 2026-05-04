import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, authLoading } = useAuth();

    // Wait until AuthContext is hydrated
    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen text-[var(--color-text-muted)]">
                Loading...
            </div>
        );
    }

    // Not logged in → redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Logged in → show page
    return children;
}
