import { AuthProvider } from "@providers/AuthProvider";
import { UIProvider } from "@providers/UIProvider";

function AppProviders({ children }) {
    return (
        <AuthProvider>
            <UIProvider>{children}</UIProvider>
        </AuthProvider>
    );
}

export { AppProviders };
