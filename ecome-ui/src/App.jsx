import { BrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Layout>
                    <AppRoutes />
                </Layout>
            </AuthProvider>
        </BrowserRouter>
    );
}
