import { useEffect, useState } from "react";
import { API_BASE_URL } from "./config/api";

function App() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                email: "test@gmail.com",
                password: "12345678",
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                const token = data.token;
                return fetch(`${API_BASE_URL}/products`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("Products:", data);
                setProducts(data);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Products:</h1>

            <pre className="bg-gray-900 text-green-400 p-4 rounded">
                {JSON.stringify(products, null, 2)}
            </pre>
        </div>
    );
}

export default App;
