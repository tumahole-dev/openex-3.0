import { useEffect, useState } from "react";
import axios from "axios";
import { positionApi, orderApi } from "./api.js";

export default function Position({ symbol, refreshKey, onClosed }) {
    const [position, setPosition] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(null);
    const [closing, setClosing] = useState(false);
    const [error, setError] = useState("");

    async function refresh() {
        try {
            const { data } = await positionApi.get(symbol);
            setPosition(data);
        } catch {
            // ignore transient errors, keep last known state
        }
        try {
            const { data } = await axios.get(`http://localhost:5000/api/market/${symbol.replace("/", "-")}`);
            setCurrentPrice(data.latestPrice);
        } catch {
            // market data service down — not critical, just skip
        }
    }

    useEffect(() => {
        refresh();
    }, [symbol, refreshKey]);

    async function handleClose() {
        if (!position || position.quantity <= 0) return;
        setError("");
        setClosing(true);
        try {
            await orderApi.place({
                symbol, side: "SELL", type: "MARKET",
                price: null, quantity: position.quantity,
            });
            await refresh();
            onClosed?.();
        } catch (err) {
            setError(err.response?.data?.error ?? "Failed to close position");
        } finally {
            setClosing(false);
        }
    }

    if (!position) return null;

    const hasPosition = position.quantity > 0;
    const unrealizedPnl = hasPosition && currentPrice
        ? (currentPrice - position.avgEntryPrice) * position.quantity
        : null;

    return (
        <div className="card">
            <div className="eyebrow">Position — {symbol}</div>
            {!hasPosition ? (
                <p className="muted">No open position. Buy some {symbol.split("/")[0]} to open one.</p>
            ) : (
                <>
                    <table>
                        <tbody>
                        <tr><td>Quantity</td><td>{position.quantity}</td></tr>
                        <tr><td>Avg. entry price</td><td>{position.avgEntryPrice}</td></tr>
                        <tr><td>Current price</td><td>{currentPrice ?? "—"}</td></tr>
                        {unrealizedPnl !== null && (
                            <tr>
                                <td>Unrealized P&L</td>
                                <td className={unrealizedPnl >= 0 ? "success" : "error"} style={{ margin: 0 }}>
                                    {unrealizedPnl >= 0 ? "+" : ""}{unrealizedPnl.toFixed(2)}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <div className="row" style={{ marginTop: 12 }}>
                        <button className="sell" onClick={handleClose} disabled={closing}>
                            {closing ? "Closing…" : "Close position"}
                        </button>
                    </div>
                    {error && <p className="error">{error}</p>}
                </>
            )}
            {position.realizedPnl != 0 && (
                <p className="muted" style={{ marginTop: 10 }}>
                    Realized P&L so far: <span className={position.realizedPnl >= 0 ? "success" : "error"}>{position.realizedPnl}</span>
                </p>
            )}
        </div>
    );
}