import { useBackendMonitor } from "@hooks/system/backend-monitor/useBackendMonitor";
import { AuthProvider } from "@providers/AuthProvider";
import { UIProvider } from "@providers/UIProvider";

function AppProviders({ children }) {
    const backendStatus = useBackendMonitor();

    return (
        <AuthProvider>
            <UIProvider online={backendStatus.online} offlineMode={backendStatus.offlineMode}>
                {children}
            </UIProvider>
        </AuthProvider>
    );
}

export { AppProviders };
