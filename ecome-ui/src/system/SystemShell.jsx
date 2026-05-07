import BackendStatusBadge from "@ui/system/BackendStatusBadge";
import LoadingOverlay from "@ui/system/LoadingOverlay";
import OfflineModeBadge from "@ui/system/OfflineModeBadge";
import SystemMessage from "@ui/system/SystemMessage";

export default function SystemShell({ children }) {
    return (
        <>
            <SystemMessage />
            <LoadingOverlay />
            <BackendStatusBadge />
            <OfflineModeBadge />
            {children}
        </>
    );
}
