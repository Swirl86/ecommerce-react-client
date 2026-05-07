import Layout from "@layout/Layout";
import { AppProviders } from "@providers/AppProviders";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import SystemShell from "./system/SystemShell";

export default function App() {
    return (
        <BrowserRouter>
            <AppProviders>
                <SystemShell>
                    <Layout>
                        <AppRoutes />
                    </Layout>
                </SystemShell>
            </AppProviders>
        </BrowserRouter>
    );
}
