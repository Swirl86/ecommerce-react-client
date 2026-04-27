import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

export function useBackendStatus() {
    const [online, setOnline] = useState(true);

    useEffect(() => {
        async function check() {
            try {
                const res = await fetch(`${API_BASE_URL}/products?page=0&size=1`);
                if (!res.ok) throw new Error();
                setOnline(true);
            } catch {
                setOnline(false);
            }
        }

        check();
    }, []);

    return online;
}
