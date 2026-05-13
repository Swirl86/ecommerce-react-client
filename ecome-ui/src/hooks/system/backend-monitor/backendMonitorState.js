// Persistent state that survives React StrictMode double-mount
export const backendMonitorState = {
    initialized: false,
    offlineSince: null,
    backoff: null,
    lastPollingMode: null,
    wasOffline: false,
};
