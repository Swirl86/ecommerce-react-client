import { createContext, useContext } from "react";

const AuthContext = createContext(undefined);
AuthContext.displayName = "AuthContext";

function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }
    return ctx;
}

export { AuthContext, useAuth };
