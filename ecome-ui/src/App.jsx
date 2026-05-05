import { BrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import BackendStatusBadge from "./components/ui/system/BackendStatusBadge";
import LoadingOverlay from "./components/ui/system/LoadingOverlay";
import SystemMessage from "./components/ui/system/SystemMessage";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
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
