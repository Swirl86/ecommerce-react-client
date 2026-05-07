import { useBackendMonitor } from "@hooks/system/useBackendMonitor";
import { AuthProvider } from "@providers/AuthProvider";
import { UIProvider } from "@providers/UIProvider";

function AppProviders({ children }) {
    const backendStatus = useBackendMonitor();

    return (
        <AuthProvider>
            <UIProvider backendStatus={backendStatus}>{children}</UIProvider>
        </AuthProvider>
    );
}

export { AppProviders };
