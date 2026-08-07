import { useEffect, useState } from "react";
import { walletApi } from "./api.js";

export default function Dashboard() {
    const [balances, setBalances] = useState([]);
    const [amount, setAmount] = useState("100");
    const [currency, setCurrency] = useState("USD");
    const [error, setError] = useState("");

    async function refresh() {
        const { data } = await walletApi.balances();
        setBalances(data);
    }

    useEffect(() => {
        refresh();
    }, []);

    async function handleDeposit(e) {
        e.preventDefault();
        setError("");
        try {
            await walletApi.deposit(currency, amount);
            await refresh();
        } catch (err) {
            setError(err.response?.data?.error ?? "Deposit failed");
        }
    }

    return (
        <div>
            <h2>Wallet</h2>
            <table>
                <thead><tr><th>Currency</th><th>Balance</th></tr></thead>
                <tbody>
                {balances.map((b) => (
                    <tr key={b.currency}><td>{b.currency}</td><td>{b.balance}</td></tr>
                ))}
                </tbody>
            </table>

            <h3>Deposit simulated funds</h3>
            <form onSubmit={handleDeposit}>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="USD">USD</option>
                    <option value="BTC">BTC</option>
                </select>
                <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.00000001" />
                <button type="submit">Deposit</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}