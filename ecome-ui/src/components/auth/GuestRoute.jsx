import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function GuestRoute({ children }) {
    const { isAuthenticated, authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen text-[var(--color-text-muted)]">
                Loading...
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/profile" replace />;
    }

    return children;
}
