import { AuthProvider } from "@providers/AuthProvider";
import { CartProvider } from "@providers/CartProvider";
import { UIProvider } from "@providers/UIProvider";
import { BrowserRouter } from "react-router-dom";

// Mocka backendStatus for UIProvider
const mockBackendStatus = {
    online: true,
    offlineMode: false,
};

export function TestProviders({ children }) {
    return (
        <BrowserRouter>
            <AuthProvider>
                <UIProvider
                    online={mockBackendStatus.online}
                    offlineMode={mockBackendStatus.offlineMode}
                >
                    <CartProvider>{children}</CartProvider>
                </UIProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
