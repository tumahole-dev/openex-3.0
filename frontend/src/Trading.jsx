import { useState } from "react";
import { orderApi } from "./api.js";
import OrderBook from "./OrderBook.jsx";
import MarketChart from "./MarketChart.jsx";
import ChatWidget from "./ChatWidget.jsx";
import Position from "./Position.jsx";

const STATUS_CLASS = { OPEN: "open", FILLED: "filled", PARTIALLY_FILLED: "partial", CANCELLED: "cancelled" };

export default function Trading() {
    const symbol = "BTC/USD";
    const [side, setSide] = useState("BUY");
    const [type, setType] = useState("LIMIT");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setResult(null);
        setRefreshKey((k) => k + 1);
        setLoading(true);
        try {
            const { data } = await orderApi.place({
                symbol, side, type,
                price: type === "LIMIT" ? price : null,
                quantity,
            });
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.error ?? "Order failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <MarketChart symbol={symbol} />
            <OrderBook symbol={symbol} />
            <Position symbol={symbol} refreshKey={refreshKey} onClosed={() => setRefreshKey((k) => k + 1)} />

            <div className="card">
                <div className="eyebrow">Place order — {symbol}</div>
                <form onSubmit={handleSubmit} className="row">
                    <select value={side} onChange={(e) => setSide(e.target.value)}>
                        <option value="BUY">Buy</option>
                        <option value="SELL">Sell</option>
                    </select>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="LIMIT">Limit</option>
                        <option value="MARKET">Market</option>
                    </select>
                    {type === "LIMIT" && (
                        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.00000001" required />
                    )}
                    <input placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" step="0.00000001" required />
                    <button type="submit" className={side === "BUY" ? "buy" : "sell"} disabled={loading}>
                        {loading ? "Placing…" : side === "BUY" ? "Buy" : "Sell"}
                    </button>
                </form>
                {error && <p className="error">{error}</p>}
                {result && (
                    <p className="muted" style={{ marginTop: 12 }}>
                        Order <span className="mono">{result.id.slice(0, 8)}</span>{" "}
                        <span className={`badge ${STATUS_CLASS[result.status]}`}>{result.status}</span>{" "}
                        <span className="mono">{result.filledQuantity}/{result.quantity} filled</span>
                    </p>
                )}
            </div>

            <ChatWidget />
        </div>
    );
}