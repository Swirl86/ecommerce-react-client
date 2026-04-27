import { useEffect, useState } from "react";
import { getProducts } from "../api/productsApi";

export function useProducts({ categoryId, sort }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);

            try {
                const data = await getProducts({ categoryId, sort });
                setProducts(data.content);
            } catch {
                setError("Could not connect to backend");
            }

            setLoading(false);
        }

        fetchData();
    }, [categoryId, sort]);

    return { products, loading, error };
}
