import axios from "axios";

const client = axios.create({ baseURL: "http://localhost:8080/api" });

// Automatically attach the saved token to every request, if we have one.
client.interceptors.request.use((config) => {
    const token = localStorage.getItem("openex_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const authApi = {
    register: (email, password, fullName) => client.post("/auth/register", { email, password, fullName }),
    login: (email, password) => client.post("/auth/login", { email, password }),
};

export const walletApi = {
    balances: () => client.get("/wallets"),
    deposit: (currency, amount) => client.post("/wallets/deposit", { currency, amount }),
};

export const orderApi = {
    place: (order) =>
        client.post("/orders", order, {
            headers: { "Idempotency-Key": crypto.randomUUID() },
        }),
    book: (symbol) => client.get(`/orders/book/${symbol.replace("/", "-")}`),
};

export const positionApi = {
    get: (symbol) => client.get(`/positions/${symbol.replace("/", "-")}`),
};
export default client;