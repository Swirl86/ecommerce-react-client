import Layout from "@layout/Layout";
import { AppProviders } from "@providers/AppProviders";
import { CartProvider } from "@providers/CartProvider";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import SystemShell from "./system/SystemShell";

export default function App() {
    return (
        <BrowserRouter>
            <AppProviders>
                <CartProvider>
                    <SystemShell>
                        <Layout>
                            <AppRoutes />
                        </Layout>
                    </SystemShell>
                </CartProvider>
            </AppProviders>
        </BrowserRouter>
    );
}
