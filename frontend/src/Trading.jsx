import { useState } from "react";
import { orderApi } from "./api.js";

export default function Trading() {
    const symbol = "BTC/USD";
    const [side, setSide] = useState("BUY");
    const [type, setType] = useState("LIMIT");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setResult(null);
        try {
            const { data } = await orderApi.place({
                symbol,
                side,
                type,
                price: type === "LIMIT" ? price : null,
                quantity,
            });
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.error ?? "Order failed");
        }
    }

    return (
        <div>
            <h2>Trading — {symbol}</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">{side === "BUY" ? "Buy" : "Sell"}</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {result && (
                <p>Order {result.id.slice(0, 8)} — {result.status} ({result.filledQuantity}/{result.quantity} filled)</p>
            )}
        </div>
    );
}