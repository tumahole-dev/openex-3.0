import axios from "axios";

const client = axios.create({ baseURL: "http://localhost:8080/api" });

// Automatically attach the saved token to every request, if we have one.
client.interceptors.request.use((config) => {
    const token = localStorage.getItem("openex_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const authApi = {
    register: (email, password) => client.post("/auth/register", { email, password }),
    login: (email, password) => client.post("/auth/login", { email, password }),
};

export const walletApi = {
    balances: () => client.get("/wallets"),
    deposit: (currency, amount) => client.post("/wallets/deposit", { currency, amount }),
};

export default client;