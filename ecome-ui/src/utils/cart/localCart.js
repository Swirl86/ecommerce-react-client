import { LOCAL_CART_KEY } from "@config/constants";

export function getLocalCart() {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
}

export function saveLocalCart(cart) {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
}

export function clearLocalCart() {
    localStorage.removeItem(LOCAL_CART_KEY);
}
