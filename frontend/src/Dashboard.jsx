import { useEffect, useState } from "react";
import { walletApi } from "./api.js";

export default function Dashboard() {
  const [balances, setBalances] = useState([]);
  const [amount, setAmount] = useState("100");
  const [currency, setCurrency] = useState("USD");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
    setSuccess("");
    setLoading(true);
    try {
      await walletApi.deposit(currency, amount);
      await refresh();
      setSuccess(`Deposited ${amount} ${currency}`);
    } catch (err) {
      setError(err.response?.data?.error ?? "Deposit failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <div className="eyebrow">Wallet</div>
        <table>
          <thead><tr><th>Currency</th><th>Balance</th></tr></thead>
          <tbody>
            {balances.length === 0 && (
              <tr><td colSpan={2} className="muted" style={{ fontFamily: "Inter" }}>No balances yet — deposit below to get started.</td></tr>
            )}
            {balances.map((b) => (
              <tr key={b.currency}><td>{b.currency}</td><td>{b.balance}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="eyebrow">Deposit simulated funds</div>
        <form onSubmit={handleDeposit} className="row">
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="USD">USD</option>
            <option value="BTC">BTC</option>
          </select>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.00000001" min="0" />
          <button type="submit" disabled={loading}>{loading ? "Depositing…" : "Deposit"}</button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </div>
    </div>
  );
}