import { AuthProvider } from "@context/AuthContext";
import { UIProvider } from "@context/UIContext";
import Layout from "@layout/Layout";
import BackendStatusBadge from "@ui/system/BackendStatusBadge";
import LoadingOverlay from "@ui/system/LoadingOverlay";
import SystemMessage from "@ui/system/SystemMessage";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
    return (
        <BrowserRouter>
            <UIProvider>
                <AuthProvider>
                    <SystemMessage />
                    <LoadingOverlay />
                    <BackendStatusBadge />
                    <Layout>
                        <AppRoutes />
                    </Layout>
                </AuthProvider>
            </UIProvider>
        </BrowserRouter>
    );
}
