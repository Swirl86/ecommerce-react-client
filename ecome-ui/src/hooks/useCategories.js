import { useEffect, useState } from "react";
import { getCategories } from "../api/categoriesApi";

export function useCategories() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getCategories();
                setCategories(data.content);
            } catch {
                setError("Could not load categories");
            }
        }

        fetchData();
    }, []);

    return categories;
}
