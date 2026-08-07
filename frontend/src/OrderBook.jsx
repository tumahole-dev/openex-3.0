import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { orderApi } from "./api.js";

export default function OrderBook({ symbol }) {
    const [book, setBook] = useState({ bids: [], asks: [] });

    useEffect(() => {
        // Load the current snapshot immediately, so the table isn't empty
        // while we wait for the WebSocket connection to establish.
        orderApi.book(symbol).then(({ data }) => setBook(data)).catch(() => {});

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 3000,
        });

        client.onConnect = () => {
            client.subscribe(`/topic/orderbook/${symbol}`, (message) => {
                setBook(JSON.parse(message.body));
            });
        };

        client.activate();
        return () => client.deactivate();
    }, [symbol]);

    return (
        <div>
            <h3>Order Book</h3>
            <div style={{ display: "flex", gap: 20 }}>
                <table>
                    <thead><tr><th>Ask Price</th><th>Qty</th></tr></thead>
                    <tbody>
                    {[...book.asks].reverse().map((level, i) => (
                        <tr key={i} style={{ color: "red" }}><td>{level.price}</td><td>{level.quantity}</td></tr>
                    ))}
                    </tbody>
                </table>
                <table>
                    <thead><tr><th>Bid Price</th><th>Qty</th></tr></thead>
                    <tbody>
                    {book.bids.map((level, i) => (
                        <tr key={i} style={{ color: "green" }}><td>{level.price}</td><td>{level.quantity}</td></tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}