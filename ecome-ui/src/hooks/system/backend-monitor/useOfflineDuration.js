import { useEffect, useState } from "react";

export function useOfflineDuration(offlineSince) {
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!offlineSince) {
            setDuration(0);
            return;
        }

        const id = setInterval(() => {
            setDuration(Date.now() - offlineSince);
        }, 1000);

        return () => clearInterval(id);
    }, [offlineSince]);

    return duration;
}
