import Layout from "@layout/Layout";
import { AppProviders } from "@providers/AppProviders";
import BackendStatusBadge from "@ui/system/BackendStatusBadge";
import LoadingOverlay from "@ui/system/LoadingOverlay";
import SystemMessage from "@ui/system/SystemMessage";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
    return (
        <BrowserRouter>
            <AppProviders>
                <SystemMessage />
                <LoadingOverlay />
                <BackendStatusBadge />
                <Layout>
                    <AppRoutes />
                </Layout>
            </AppProviders>
        </BrowserRouter>
    );
}
