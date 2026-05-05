import { createContext, useContext } from "react";

const UIContext = createContext(undefined);
UIContext.displayName = "UIContext";

function useUI() {
    const ctx = useContext(UIContext);
    if (!ctx) {
        throw new Error("useUI must be used inside <UIProvider>");
    }
    return ctx;
}

export { UIContext, useUI };
